import type { VercelRequest, VercelResponse } from '@vercel/node';

const OWNER = process.env.GITHUB_OWNER || 'luizcordeiro155';
const REPO = process.env.GITHUB_REPO || 'Planos-de-saude';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const DEFAULT_PATH = 'artifacts/planos-saude/src/pages/Home.tsx';

function json(res: VercelResponse, status: number, body: unknown) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).send(JSON.stringify(body));
}

function isAllowedPath(path: string) {
  return [
    'artifacts/planos-saude/src/pages/Home.tsx',
    'artifacts/planos-saude/src/pages/Admin.tsx',
    'artifacts/planos-saude/src/pages/Terms.tsx',
    'artifacts/planos-saude/src/pages/Privacy.tsx',
    'artifacts/planos-saude/src/App.tsx',
  ].includes(path);
}

function isAuthorized(req: VercelRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const headerPassword = req.headers['x-admin-password'];
  return Boolean(password && typeof headerPassword === 'string' && headerPassword === password);
}

async function github(path: string, init?: RequestInit) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN nao configurado na Vercel. Crie um token do GitHub com permissao de Contents: Read and Write.');
  }

  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `Erro GitHub: ${response.status}`);
  }
  return data;
}

function decodeBase64(value: string) {
  return Buffer.from(value, 'base64').toString('utf8');
}

function encodeBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!isAuthorized(req)) {
      return json(res, 401, { ok: false, message: 'Senha invalida.' });
    }

    const path = typeof req.query.path === 'string' ? req.query.path : DEFAULT_PATH;
    if (!isAllowedPath(path)) {
      return json(res, 400, { ok: false, message: 'Arquivo nao permitido para edicao.' });
    }

    if (req.method === 'GET') {
      const file = await github(`${encodeURIComponent(path).replace(/%2F/g, '/') }?ref=${BRANCH}`);
      return json(res, 200, {
        ok: true,
        path,
        sha: file.sha,
        content: decodeBase64(String(file.content || '').replace(/\n/g, '')),
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const content = body?.content;
      if (typeof content !== 'string') {
        return json(res, 400, { ok: false, message: 'Conteudo invalido.' });
      }

      const current = await github(`${encodeURIComponent(path).replace(/%2F/g, '/') }?ref=${BRANCH}`);
      const saved = await github(encodeURIComponent(path).replace(/%2F/g, '/'), {
        method: 'PUT',
        body: JSON.stringify({
          message: `Admin: atualizar ${path}`,
          content: encodeBase64(content),
          sha: current.sha,
          branch: BRANCH,
        }),
      });

      return json(res, 200, {
        ok: true,
        path,
        commit: saved?.commit?.sha,
        message: 'Alteracao salva no GitHub. A Vercel deve iniciar um novo deploy automaticamente.',
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { ok: false, message: 'Metodo nao permitido.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    return json(res, 500, { ok: false, message });
  }
}
