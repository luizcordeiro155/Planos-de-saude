import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentPath = path.join(root, 'src/content/siteContent.json');
const indexPath = path.join(root, 'index.html');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const brand = content.brand || {};
const seo = content.seo || {};

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const siteUrl = seo.siteUrl || 'https://planosdesaude-five.vercel.app/';
const siteOrigin = (() => {
  try {
    return new URL(siteUrl).origin;
  } catch {
    return 'https://planosdesaude-five.vercel.app';
  }
})();

const abs = (value = '') => {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:')) return text;
  if (text.startsWith('/')) return `${siteOrigin}${text}`;
  return text;
};

const addCacheBust = (value = '') => {
  const text = String(value || '').trim();
  if (!text || text.startsWith('data:')) return text;
  try {
    const url = new URL(text);
    url.searchParams.set('v', String(seo.shareVersion || process.env.VERCEL_GIT_COMMIT_SHA || Date.now()));
    return url.toString();
  } catch {
    return text;
  }
};

const siteTitle = seo.browserTitle || seo.shareTitle || `${brand.name || 'SW Seguros'} | Planos de Saúde`;
const description = seo.description || seo.shareDescription || 'Corretora especializada em planos de saúde individuais, familiares e empresariais. Cotação gratuita pelo WhatsApp.';
const shareTitle = seo.shareTitle || siteTitle;
const shareDescription = seo.shareDescription || description;
const favicon = seo.faviconDataUrl || seo.faviconUrl || brand.logoDataUrl || '/favicon.svg';
const rawShareImage = abs(seo.shareImageUrl || seo.shareImageDataUrl || content.photos?.hero?.imageDataUrl || brand.logoDataUrl || '');
const shareImage = addCacheBust(rawShareImage);
const themeColor = seo.themeColor || '#007c89';

const imageTags = shareImage ? `
    <meta property="og:image" content="${esc(shareImage)}" />
    <meta property="og:image:secure_url" content="${esc(shareImage)}" />
    <meta property="og:image:alt" content="${esc(seo.shareImageAlt || shareTitle)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content="${esc(shareImage)}" />` : '';

const faviconType = String(favicon).startsWith('data:image/png') ? 'image/png' : String(favicon).startsWith('data:image/jpeg') ? 'image/jpeg' : String(favicon).startsWith('data:image/webp') ? 'image/webp' : 'image/svg+xml';

const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${esc(siteTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="${esc(themeColor)}" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <link rel="canonical" href="${esc(siteUrl)}" />
    <meta property="og:title" content="${esc(shareTitle)}" />
    <meta property="og:description" content="${esc(shareDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${esc(siteUrl)}" />
    <meta property="og:site_name" content="${esc(brand.name || 'SW Seguros')}" />${imageTags}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(shareTitle)}" />
    <meta name="twitter:description" content="${esc(shareDescription)}" />
    <link rel="icon" type="${faviconType}" href="${esc(favicon)}" />
    <link rel="apple-touch-icon" href="${esc(favicon)}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`SEO metadata applied: ${siteTitle}`);
console.log(`Share image: ${shareImage || 'none'}`);
