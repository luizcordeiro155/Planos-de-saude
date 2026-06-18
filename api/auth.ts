import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Metodo nao permitido.' });
  }

  const password = process.env.ADMIN_PASSWORD;
  const typedPassword = req.body?.password;

  if (!password) {
    return res.status(500).json({ ok: false, message: 'ADMIN_PASSWORD nao configurada na Vercel.' });
  }

  if (typeof typedPassword === 'string' && typedPassword === password) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false, message: 'Senha invalida.' });
}
