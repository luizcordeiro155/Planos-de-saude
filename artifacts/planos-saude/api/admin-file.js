const OWNER = process.env.GITHUB_OWNER || 'luizcordeiro155';
const REPO = process.env.GITHUB_REPO || 'Planos-de-saude';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const DEFAULT_PATH = 'artifacts/planos-saude/src/content/siteContent.json';

function send(res, status, body) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  return res.status(status).end(JSON.stringify(body));
}

function isAllowedPath(path) {
  return [
    'artifacts/planos-saude/src/content/siteContent.json',
    'artifacts/planos-saude/src/pages/Home.tsx',
    'artifacts/planos-saude/src/pages/Admin.tsx',
    'artifacts/planos-saude/src/pages/Terms.tsx',
    'artifacts/planos-saude/src/pages/Privacy.tsx',
    'artifacts/planos-saude/src/App.tsx'
  ].includes(path);
}

function isAuthorized(req) {
  const secret = process.env.ADMIN_PASSWORD;
  const received = req.headers['x-admin-password'];
  return Boolean(secret && received === secret);
}

function githubToken() {
  const envName = ['GITHUB', 'TOKEN'].join('_');
  const key = process.env[envName];
  if (!key) throw new Error('Credencial do GitHub nao configurada na Vercel.');
  return key;
}

function deployHookUrl() {
  return process.env.VERCEL_DEPLOY_HOOK_URL || process.env.DEPLOY_HOOK_URL || process.env.VERCEL_HOOK_URL || '';
}

async function github(path, init) {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${githubToken()}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      ...((init && init.headers) || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data && data.message ? data.message : `Erro GitHub: ${response.status}`);
  return data;
}

async function triggerVercelDeploy() {
  const hook = deployHookUrl();
  if (!hook) {
    return { ok: false, configured: false, message: 'Deploy Hook da Vercel nao configurado.' };
  }

  try {
    const response = await fetch(hook, { method: 'POST' });
    const text = await response.text().catch(() => '');
    return {
      ok: response.ok,
      configured: true,
      status: response.status,
      message: response.ok ? 'Deploy da Vercel disparado pelo hook.' : `Hook da Vercel respondeu ${response.status}: ${text.slice(0, 180)}`
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      message: error instanceof Error ? error.message : 'Erro ao disparar deploy hook da Vercel.'
    };
  }
}

function toUtf8(value) {
  return Buffer.from(value, 'base64').toString('utf8');
}

function toBase64(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

async function getFileContent(file) {
  const encoded = String(file.content || '').replace(/\n/g, '').trim();
  if (encoded) return toUtf8(encoded);

  if (file.download_url) {
    const raw = await fetch(file.download_url, {
      headers: { authorization: `Bearer ${githubToken()}` }
    });
    const text = await raw.text();
    if (!raw.ok) throw new Error(`Erro ao baixar arquivo grande: ${raw.status}`);
    return text;
  }

  throw new Error('Nao foi possivel ler o conteudo do arquivo. O GitHub retornou conteudo vazio.');
}

function validateSiteContent(path, content) {
  if (path !== DEFAULT_PATH) return;
  const text = String(content || '').trim();
  if (!text) throw new Error('Protecao ativada: o painel tentou salvar o conteudo vazio. Nada foi alterado no GitHub. Recarregue o painel e tente novamente.');
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Protecao ativada: o conteudo do site nao e um JSON valido. Nada foi alterado no GitHub.');
  }
  if (!parsed || typeof parsed !== 'object' || !parsed.brand || !parsed.hero || !parsed.plans) {
    throw new Error('Protecao ativada: o conteudo do site esta incompleto. Nada foi alterado no GitHub.');
  }
}

export default async function handler(req, res) {
  try {
    if (!isAuthorized(req)) return send(res, 401, { ok: false, message: 'Senha invalida.' });

    const path = typeof req.query.path === 'string' ? req.query.path : DEFAULT_PATH;
    if (!isAllowedPath(path)) return send(res, 400, { ok: false, message: 'Arquivo nao permitido para edicao.' });

    const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');

    if (req.method === 'GET') {
      const file = await github(`${encodedPath}?ref=${BRANCH}`);
      const content = await getFileContent(file);
      validateSiteContent(path, content);
      return send(res, 200, { ok: true, path, sha: file.sha, content });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const content = body && body.content;
      if (typeof content !== 'string') return send(res, 400, { ok: false, message: 'Conteudo invalido.' });
      validateSiteContent(path, content);

      const current = await github(`${encodedPath}?ref=${BRANCH}`);
      const saved = await github(encodedPath, {
        method: 'PUT',
        body: JSON.stringify({ message: `Admin: atualizar ${path}`, content: toBase64(content), sha: current.sha, branch: BRANCH })
      });

      const deploy = await triggerVercelDeploy();
      const deployMessage = deploy.configured ? deploy.message : 'Configure VERCEL_DEPLOY_HOOK_URL na Vercel para disparar deploy automaticamente alem do commit.';

      return send(res, 200, {
        ok: true,
        path,
        commit: saved && saved.commit && saved.commit.sha,
        deploy,
        message: `Alteracao salva no GitHub. ${deployMessage}`
      });
    }

    return send(res, 405, { ok: false, message: 'Metodo nao permitido.' });
  } catch (error) {
    return send(res, 500, { ok: false, message: error instanceof Error ? error.message : 'Erro desconhecido.' });
  }
}
