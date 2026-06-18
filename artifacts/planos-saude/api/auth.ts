export default function handler(req: any, res: any) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    return res.status(405).end(JSON.stringify({ ok: false, message: 'Metodo nao permitido.' }));
  }
  const secret = process.env.ADMIN_PASSWORD;
  const received = req.body && req.body.password;
  if (!secret) {
    return res.status(500).end(JSON.stringify({ ok: false, message: 'ADMIN_PASSWORD nao configurada na Vercel.' }));
  }
  if (received === secret) {
    return res.status(200).end(JSON.stringify({ ok: true }));
  }
  return res.status(401).end(JSON.stringify({ ok: false, message: 'Senha invalida.' }));
}
