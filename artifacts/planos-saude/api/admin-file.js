const OWNER = process.env.GITHUB_OWNER || 'luizcordeiro155';
const REPO = process.env.GITHUB_REPO || 'Planos-de-saude';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const DEFAULT_PATH = 'artifacts/planos-saude/src/pages/Home.tsx';

function send(res, status, body) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  return res.status(status).end(JSON.stringify(body));
}

function isAllowedPath(path) {
  return [
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

async function github(path, init) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN nao configurado na Vercel.');

  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      ...((init && init.headers) || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data && data.message ? data.message : `Erro GitHub: ${response.status}`);
  return data;
}

function toUtf8(value) {
  return Buffer.from(value, 'base64').toString('utf8');
}

function toBase64(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

export default async function handler(req, res) {
  try {
    if (!isAuthorized(req)) return send(res, 401, { ok: false, message: 'Senha invalida.' });

    const path = typeof req.query.path === 'string' ? req.query.path : DEFAULT_PATH;
    if (!isAllowedPath(path)) return send(res, 400, { ok: false, message: 'Arquivo nao permitido para edicao.' });

    const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');

    if (req.method === 'GET') {
      const file = await github(`${encodedPath}?ref=${BRANCH}`);
      return send(res, 200, {
        ok: true,
        path,
        sha: file.sha,
        content: toUtf8(String(file.content || '').replace(/\n/g, ''))
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const content = body && body.content;
      if (typeof content !== 'string') return send(res, 400, { ok: false, message: 'Conteudo invalido.' });

      const current = await github(`${encodedPath}?ref=${BRANCH}`);
      const saved = await github(encodedPath, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Admin: atualizar ${path}`,
          content: toBase64(content),
          sha: current.sha,
          branch: BRANCH
        })
      });

      return send(res, 200, {
        ok: true,
        path,
        commit: saved && saved.commit && saved.commit.sha,
        message: 'Alteracao salva no GitHub. A Vercel deve iniciar um novo deploy automaticamente.'
      });
    }

    return send(res, 405, { ok: false, message: 'Metodo nao permitido.' });
  } catch (error) {
    return send(res, 500, { ok: false, message: error instanceof Error ? error.message : 'Erro desconhecido.' });
  }
}
