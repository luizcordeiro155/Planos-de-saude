import React, { useState } from 'react';
import { AlertCircle, Eye, Home, Lock, Save, ShieldCheck, Upload, X } from 'lucide-react';

const CONTENT_PATH = 'artifacts/planos-saude/src/content/siteContent.json';
const MAX_SAVE_PAYLOAD_BYTES = 3_500_000;
const MAX_IMAGE_DATA_BYTES = 1_200_000;
const MAX_ICON_DATA_BYTES = 260_000;

type Status = 'idle' | 'loading' | 'ready' | 'saving' | 'error';
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Section = { id: string; label: string; path: string };

const defaultSeo = {
  browserTitle: 'SW Seguros | Planos de Saúde',
  description: 'Corretora especializada em planos de saúde individuais, familiares, empresariais e coletivos por adesão. Cotação gratuita pelo WhatsApp.',
  faviconDataUrl: '',
  faviconUrl: '/favicon.svg',
  shareTitle: 'SW Seguros | Cotação de Planos de Saúde',
  shareDescription: 'Receba uma cotação gratuita de plano de saúde pelo WhatsApp com atendimento profissional e sem compromisso.',
  shareImageDataUrl: '',
  shareImageUrl: 'https://www.rotaseguros.com.br/images/banner/familia.webp',
  shareImageAlt: 'SW Seguros | Cotação de Planos de Saúde',
  siteUrl: 'https://planosdesaude-five.vercel.app/',
  themeColor: '#007c89'
};

const sections: Section[] = [
  { id: 'brand', label: 'Identidade', path: 'brand' },
  { id: 'seo', label: 'SEO / Compartilhamento', path: 'seo' },
  { id: 'photos', label: 'Fotos do site', path: 'photos' },
  { id: 'nav', label: 'Menu', path: 'nav' },
  { id: 'hero', label: 'Seção principal', path: 'hero' },
  { id: 'metrics', label: 'Métricas', path: 'metrics' },
  { id: 'operators', label: 'Operadoras', path: 'operators' },
  { id: 'quote', label: 'Cotação', path: 'quote' },
  { id: 'plans', label: 'Planos', path: 'plans' },
  { id: 'coverages', label: 'Coberturas', path: 'coverages' },
  { id: 'differentials', label: 'Diferenciais', path: 'differentials' },
  { id: 'process', label: 'Como funciona', path: 'process' },
  { id: 'testimonials', label: 'Depoimentos', path: 'testimonials' },
  { id: 'faq', label: 'FAQ', path: 'faq' },
  { id: 'finalCta', label: 'CTA final', path: 'finalCta' },
  { id: 'footer', label: 'Rodapé', path: 'footer' },
  { id: 'json', label: 'JSON completo', path: '' }
];

const labels: Record<string, string> = {
  brand: 'Identidade', name: 'Nome', logoDataUrl: 'Logo', whatsapp: 'WhatsApp com DDI e DDD', phoneDisplay: 'Telefone exibido', email: 'E-mail', city: 'Cidade', coverage: 'Área de atendimento',
  seo: 'SEO e compartilhamento', browserTitle: 'Nome na aba do navegador', description: 'Descrição', faviconDataUrl: 'Ícone por upload', faviconUrl: 'Ícone por URL', shareTitle: 'Título ao compartilhar', shareDescription: 'Descrição ao compartilhar', shareImageDataUrl: 'Imagem de compartilhamento por upload', shareImageUrl: 'Imagem de compartilhamento por URL', shareImageAlt: 'Texto da imagem', siteUrl: 'Link oficial do site', themeColor: 'Cor do navegador',
  photos: 'Fotos do site', hero: 'Foto da seção principal', quote: 'Foto da cotação', differentials: 'Foto dos diferenciais', finalCta: 'Foto da chamada final', imageDataUrl: 'Imagem',
  nav: 'Menu', badge: 'Selo', titleStart: 'Título início', titleHighlight: 'Título destaque', titleEnd: 'Título final', subtitle: 'Subtítulo', supportText: 'Texto de apoio', primaryButton: 'Botão principal', secondaryButton: 'Botão secundário',
  metrics: 'Métricas', value: 'Valor', suffix: 'Sufixo', label: 'Rótulo', operators: 'Operadoras', items: 'Itens', title: 'Título', imageUrl: 'Imagem', photoUrl: 'Foto',
  kicker: 'Chamada pequena', benefits: 'Benefícios', formTitle: 'Título do formulário', formSubtitle: 'Subtítulo do formulário', nameLabel: 'Campo nome', namePlaceholder: 'Placeholder nome', cityLabel: 'Campo cidade', cityPlaceholder: 'Placeholder cidade', typeLabel: 'Campo tipo', types: 'Tipos de plano', button: 'Botão', note: 'Observação',
  plans: 'Planos', features: 'Características', coverages: 'Coberturas', stats: 'Estatísticas', ratingTitle: 'Nota', ratingSubtitle: 'Texto da nota', process: 'Como funciona', steps: 'Passos', number: 'Número', testimonials: 'Depoimentos', role: 'Cargo/cidade', text: 'Comentário', stars: 'Estrelas', faq: 'FAQ', question: 'Pergunta', answer: 'Resposta', footerText: 'Texto final', footer: 'Rodapé', regulatoryLabel: 'Texto regulatório', regulatoryValue: 'Valor regulatório', navigationTitle: 'Título navegação', contactTitle: 'Título contato', copyright: 'Copyright', bottomText: 'Texto final do rodapé'
};

function normalizeContent(data: any) {
  return { ...data, seo: { ...defaultSeo, ...(data?.seo || {}) } };
}

function getAtPath(obj: any, path: string) {
  return path ? path.split('.').reduce((acc, key) => acc?.[key], obj) : obj;
}

function setAtPath(obj: any, path: string, value: JsonValue) {
  if (!path) return value;
  const parts = path.split('.');
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  let cursor: any = copy;
  parts.slice(0, -1).forEach((part) => {
    cursor[part] = Array.isArray(cursor[part]) ? [...cursor[part]] : { ...cursor[part] };
    cursor = cursor[part];
  });
  cursor[parts[parts.length - 1]] = value;
  return copy;
}

function labelFor(key: string) {
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function isLongText(value: string) {
  return value.length > 70 || value.includes('\n') || value.includes('.') || value.includes(',');
}

function isImagePath(path: string) {
  const lower = path.toLowerCase();
  return lower.includes('logodataurl') || lower.includes('imagedataurl') || lower.includes('imageurl') || lower.includes('photourl') || lower.includes('favicon') || lower.endsWith('.image') || lower.endsWith('.photo');
}

function blankClone(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key.toLowerCase().includes('image') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('favicon') ? '' : blankClone(child)]));
  }
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return '';
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function byteLength(value: string) {
  return new Blob([value]).size;
}

function friendlyApiError(text: string, status: number) {
  const compact = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (status === 413 || /request entity|payload too large|body exceeded|request en/i.test(compact)) {
    return 'A imagem deixou o conteúdo pesado demais para salvar. O painel agora otimiza as próximas imagens automaticamente; remova a imagem atual, envie novamente e salve.';
  }
  if (!compact) return 'O servidor não retornou uma resposta válida.';
  return compact.slice(0, 220);
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    if (!response.ok || !data.ok) throw new Error(data.message || friendlyApiError(text, response.status));
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(friendlyApiError(text, response.status));
    throw error;
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Não foi possível converter a imagem.'));
    reader.readAsDataURL(blob);
  });
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Imagem inválida ou corrompida.'));
    image.src = dataUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Não foi possível otimizar a imagem.')), type, quality);
  });
}

async function optimizeImageFile(file: File, path: string) {
  const lowerPath = path.toLowerCase();
  const isIcon = lowerPath.includes('favicon');
  const isSvg = file.type.includes('svg') || file.name.toLowerCase().endsWith('.svg');
  const maxBytes = isIcon ? MAX_ICON_DATA_BYTES : MAX_IMAGE_DATA_BYTES;

  if (isSvg) {
    if (file.size > maxBytes) throw new Error(`Esse SVG tem ${formatBytes(file.size)}. Use um SVG menor ou cole uma URL da imagem.`);
    return { dataUrl: await readFileAsDataUrl(file), originalSize: file.size, optimizedSize: file.size };
  }

  const rawDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(rawDataUrl);
  let maxDimension = isIcon ? 512 : lowerPath.includes('share') ? 1200 : lowerPath.includes('logo') ? 900 : 1600;
  let quality = isIcon ? 0.86 : 0.82;
  let bestBlob: Blob | null = null;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível preparar a imagem.');
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, 'image/webp', quality);
    bestBlob = blob;
    if (blob.size <= maxBytes) break;
    maxDimension = Math.max(320, Math.round(maxDimension * 0.72));
    quality = Math.max(0.62, quality - 0.07);
  }

  if (!bestBlob || bestBlob.size > maxBytes) {
    throw new Error(`A imagem foi otimizada, mas ainda ficou com ${formatBytes(bestBlob?.size || file.size)}. Use uma imagem menor ou cole uma URL externa.`);
  }

  return { dataUrl: await blobToDataUrl(bestBlob), originalSize: file.size, optimizedSize: bestBlob.size };
}

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin-password') || '');
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin-auth') === 'true');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('brand');
  const [content, setContent] = useState<any>(null);
  const [rawJson, setRawJson] = useState('');

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setMessage('Validando senha...');
    try {
      const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await readJsonResponse(response);
      sessionStorage.setItem('admin-password', password);
      sessionStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
      await loadContent(password);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao autenticar.');
    }
  }

  async function loadContent(activePassword = password) {
    setStatus('loading');
    setMessage('Carregando conteúdo atual do site...');
    try {
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(CONTENT_PATH)}&t=${Date.now()}`, { headers: { 'x-admin-password': activePassword, 'cache-control': 'no-cache' } });
      const data = await readJsonResponse(response);
      const parsed = normalizeContent(JSON.parse(data.content));
      setContent(parsed);
      setRawJson(JSON.stringify(parsed, null, 2));
      setStatus('ready');
      setMessage('Conteúdo atual carregado do GitHub.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao carregar conteúdo.');
    }
  }

  function updateValue(path: string, value: JsonValue) {
    const next = setAtPath(content, path, value);
    setContent(next);
    setRawJson(JSON.stringify(next, null, 2));
  }

  async function save() {
    setStatus('saving');
    setMessage('Salvando no GitHub e criando commit...');
    try {
      const nextContent = normalizeContent(activeSection === 'json' ? JSON.parse(rawJson) : content);
      const contentText = JSON.stringify(nextContent, null, 2) + '\n';
      const body = JSON.stringify({ content: contentText });
      if (byteLength(body) > MAX_SAVE_PAYLOAD_BYTES) {
        throw new Error('O conteúdo ainda está pesado demais para salvar por causa das imagens. Remova a imagem pesada e envie novamente pelo botão Escolher imagem para o painel otimizar automaticamente, ou use uma URL externa.');
      }
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(CONTENT_PATH)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body });
      const data = await readJsonResponse(response);
      setContent(nextContent);
      setRawJson(JSON.stringify(nextContent, null, 2));
      setStatus('ready');
      setMessage(`Salvo com sucesso. Commit: ${data.commit || 'criado'}. A Vercel deve iniciar novo deploy.`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar. Verifique o JSON.');
    }
  }

  const section = sections.find((item) => item.id === activeSection) || sections[0];
  const sectionData = content ? getAtPath(content, section.path) : null;

  if (!authenticated) {
    return <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 p-8 shadow-2xl"><div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6"><Lock className="h-7 w-7" /></div><h1 className="text-3xl font-bold mb-2">Admin do site</h1><p className="text-slate-300 mb-6">Edite o site, SEO, ícone da aba e imagens.</p><label className="block text-sm font-semibold mb-2">Senha secreta</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-emerald-400" /><button type="submit" className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-bold hover:bg-emerald-400">Entrar</button>{message && <p className="mt-4 text-sm text-amber-200">{message}</p>}</form></main>;
  }

  return <main className="min-h-screen bg-slate-100 text-slate-950"><header className="bg-white border-b border-slate-200 sticky top-0 z-20"><div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-emerald-700 font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Painel protegido</p><h1 className="text-2xl font-black">Editar site completo</h1></div><div className="flex gap-2"><a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold flex items-center gap-2"><Home className="h-4 w-4" /> Ver site</a><button onClick={() => loadContent()} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold">Recarregar</button><button onClick={save} disabled={!content || status === 'saving'} className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-bold flex items-center gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> Salvar e publicar</button></div></div></header><section className="max-w-7xl mx-auto px-4 py-6">{message && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2"><AlertCircle className="h-5 w-5 shrink-0" /><span>{message}</span></div>}<div className="mb-5 flex gap-2 overflow-x-auto pb-2">{sections.map((tab) => <button key={tab.id} onClick={() => setActiveSection(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2 font-bold border ${activeSection === tab.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'}`}>{tab.label}</button>)}</div>{!content ? <div className="rounded-3xl bg-white p-8 border">Carregando...</div> : <div className="grid lg:grid-cols-[1fr_520px] gap-6"><div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2">Editar {section.label}</h2><p className="text-sm text-slate-500 mb-5">{activeSection === 'seo' ? 'Altere aqui o nome da aba, ícone do navegador e a prévia enviada no WhatsApp, Instagram e outros lugares.' : 'Tudo que aparece aqui altera o site e a prévia muda enquanto você digita.'}</p>{activeSection === 'json' ? <textarea value={rawJson} onChange={(event) => setRawJson(event.target.value)} className="w-full min-h-[720px] rounded-xl border p-4 font-mono text-xs" /> : <JsonEditor value={sectionData} path={section.path} onChange={updateValue} />}</div><aside className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm h-fit sticky top-28"><h2 className="text-xl font-bold mb-4 flex gap-2"><Eye className="h-5 w-5" /> Prévia da seção</h2><div className="rounded-2xl border bg-slate-50 p-5 max-h-[760px] overflow-auto"><Preview content={content} section={activeSection} /></div></aside></div>}</section></main>;
}

function JsonEditor({ value, path, onChange }: { value: JsonValue; path: string; onChange: (path: string, value: JsonValue) => void }) {
  if (Array.isArray(value)) {
    const template = value[0] ?? '';
    return <div className="space-y-5"><div className="flex justify-end"><button type="button" onClick={() => onChange(path, [...value, blankClone(template)])} className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-bold">Adicionar item</button></div>{value.map((item, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm font-black text-emerald-700">Item {index + 1}</span><button type="button" onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg border px-3 py-1 text-xs font-bold text-red-600">Remover</button></div><JsonEditor value={item} path={path ? `${path}.${index}` : String(index)} onChange={onChange} /></div>)}</div>;
  }
  if (value && typeof value === 'object') return <div className="space-y-4">{Object.entries(value).map(([key, child]) => <div key={key}><div className="mb-2 text-sm font-bold text-slate-700">{labelFor(key)}</div><JsonEditor value={child} path={path ? `${path}.${key}` : key} onChange={onChange} /></div>)}</div>;
  if (typeof value === 'boolean') return <select value={value ? 'true' : 'false'} onChange={(event) => onChange(path, event.target.value === 'true')} className="w-full rounded-xl border bg-white p-3"><option value="true">Sim</option><option value="false">Não</option></select>;
  if (typeof value === 'number') return <input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} className="w-full rounded-xl border bg-white p-3" />;
  const text = value === null || value === undefined ? '' : String(value);
  if (isImagePath(path)) return <ImageInput value={text} path={path} onChange={onChange} />;
  if (isLongText(text)) return <textarea value={text} onChange={(event) => onChange(path, event.target.value)} className="w-full min-h-24 rounded-xl border bg-white p-3" />;
  return <input value={text} onChange={(event) => onChange(path, event.target.value)} className="w-full rounded-xl border bg-white p-3" />;
}

function ImageInput({ value, path, onChange }: { value: string; path: string; onChange: (path: string, value: JsonValue) => void }) {
  const [fileInfo, setFileInfo] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [optimizing, setOptimizing] = useState(false);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setOptimizing(true);
    setUploadError('');
    setFileInfo(`Otimizando ${file.name}...`);
    try {
      const optimized = await optimizeImageFile(file, path);
      onChange(path, optimized.dataUrl);
      setFileInfo(`${file.name} • ${formatBytes(optimized.originalSize)} → ${formatBytes(optimized.optimizedSize)}`);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Não foi possível otimizar a imagem.');
      setFileInfo('');
    } finally {
      setOptimizing(false);
      event.target.value = '';
    }
  }

  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4"><div className="flex flex-wrap items-center gap-3"><label className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white ${optimizing ? 'cursor-wait bg-slate-400' : 'cursor-pointer bg-emerald-600'}`}><Upload className="h-4 w-4" /> {optimizing ? 'Otimizando...' : 'Escolher imagem'}<input type="file" accept="image/*" onChange={upload} disabled={optimizing} className="hidden" /></label>{value && <button type="button" onClick={() => { setFileInfo(''); setUploadError(''); onChange(path, ''); }} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-red-600"><X className="h-4 w-4" /> Remover</button>}</div><p className="mt-2 text-xs text-slate-500">PNG, JPG, WEBP ou SVG. Imagens comuns são otimizadas automaticamente antes de salvar para evitar erro de limite no servidor. Para imagens muito grandes, prefira colar uma URL externa.</p>{fileInfo && <p className="mt-2 text-xs font-semibold text-emerald-700">Arquivo: {fileInfo}</p>}{uploadError && <p className="mt-2 text-xs font-semibold text-red-600">{uploadError}</p>}{value && <img src={value} alt="Prévia" className="mt-4 max-h-56 w-full rounded-xl border bg-slate-50 object-contain" />}<textarea value={value} onChange={(event) => onChange(path, event.target.value)} placeholder="Ou cole uma URL/base64 de imagem aqui" className="mt-4 w-full min-h-20 rounded-xl border bg-slate-50 p-3 text-xs" /></div>;
}

function photoCard(photo: any) {
  return <div className="overflow-hidden rounded-xl border bg-white"><div className="aspect-[4/3] bg-slate-100 flex items-center justify-center">{photo?.imageDataUrl ? <img src={photo.imageDataUrl} className="h-full w-full object-cover" /> : <span className="text-xs text-slate-400">Sem imagem</span>}</div><div className="p-3"><b>{photo?.title}</b><p className="text-xs text-slate-500">{photo?.description}</p></div></div>;
}

function Preview({ content, section }: { content: any; section: string }) {
  if (section === 'brand') return <div className="space-y-3"><h3 className="text-2xl font-black text-teal-700">{content.brand.name}</h3><p>WhatsApp: {content.brand.whatsapp}</p><p>Telefone: {content.brand.phoneDisplay}</p><p>E-mail: {content.brand.email}</p><p>{content.brand.city}</p><p>{content.brand.coverage}</p>{content.brand.logoDataUrl && <img src={content.brand.logoDataUrl} className="h-24 w-24 object-contain rounded-xl bg-white border" />}</div>;
  if (section === 'seo') return <SeoPreview content={content} />;
  if (section === 'photos') return <div className="space-y-4"><p className="text-sm text-slate-600">As 4 fotos aparecem espalhadas pelo site: seção principal, cotação, diferenciais e chamada final.</p><div className="grid grid-cols-2 gap-3">{photoCard(content.photos?.hero)}{photoCard(content.photos?.quote)}{photoCard(content.photos?.differentials)}{photoCard(content.photos?.finalCta)}</div></div>;
  if (section === 'hero') return <div className="space-y-4 text-center"><p className="inline-block rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">{content.hero.badge}</p><h3 className="text-4xl font-black">{content.hero.titleStart} <span className="text-emerald-700">{content.hero.titleHighlight}</span> {content.hero.titleEnd}</h3><p>{content.hero.subtitle}</p><p className="text-slate-500">{content.hero.supportText}</p><span className="block rounded-xl bg-emerald-600 text-white py-3 font-bold">{content.hero.primaryButton}</span></div>;
  if (section === 'metrics') return <div className="grid grid-cols-2 gap-4 text-center">{content.metrics.map((m: any) => <div key={m.label}><b className="text-3xl">{Number(m.value).toLocaleString('pt-BR')}{m.suffix}</b><p>{m.label}</p></div>)}</div>;
  if (section === 'operators') return <div className="text-center space-y-4"><p className="uppercase text-xs font-bold text-slate-500">{content.operators.title}</p><div className="flex flex-wrap gap-3 justify-center font-black text-slate-400">{content.operators.items.map((item: string) => <span key={item}>{item}</span>)}</div></div>;
  if (section === 'quote') return <div className="space-y-4"><p className="uppercase text-xs font-black text-teal-700">{content.quote.kicker}</p><h3 className="text-4xl font-black">{content.quote.title}</h3><p>{content.quote.description}</p><div className="bg-white border rounded-2xl p-4"><h4 className="text-xl font-black">{content.quote.formTitle}</h4><p>{content.quote.formSubtitle}</p><span className="mt-3 block bg-emerald-500 text-white text-center rounded-xl py-3 font-bold">{content.quote.button}</span></div></div>;
  if (section === 'plans') return <div className="text-center space-y-4"><p className="uppercase text-xs font-black text-teal-700">{content.plans.kicker}</p><h3 className="text-3xl font-black">{content.plans.title}</h3><p>{content.plans.description}</p>{content.plans.items.map((p: any) => <div key={p.title} className="bg-white border rounded-xl p-3 text-left"><b>{p.title}</b><p className="text-sm text-slate-500">{p.description}</p></div>)}</div>;
  if (section === 'coverages') return <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 text-center"><p className="uppercase text-xs text-emerald-400 font-bold">{content.coverages.kicker}</p><h3 className="text-3xl font-black">{content.coverages.title}</h3><p>{content.coverages.description}</p></div>;
  if (section === 'differentials') return <div className="space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{content.differentials.kicker}</p><h3 className="text-3xl font-black">{content.differentials.title}</h3><p>{content.differentials.description}</p>{content.differentials.items.map((i: any) => <div key={i.title} className="bg-white border rounded-xl p-3"><b>{i.title}</b><p className="text-sm text-slate-500">{i.description}</p></div>)}</div>;
  if (section === 'process') return <div className="bg-teal-700 text-white rounded-2xl p-5 text-center space-y-4"><p className="uppercase text-xs text-teal-200 font-bold">{content.process.kicker}</p><h3 className="text-3xl font-black">{content.process.title}</h3><p>{content.process.description}</p>{content.process.steps.map((s: any) => <div key={s.number} className="bg-white/10 rounded-xl p-3"><b>{s.number} - {s.title}</b><p className="text-sm text-white/70">{s.description}</p></div>)}</div>;
  if (section === 'testimonials') return <div className="space-y-4 text-center"><p className="uppercase text-xs text-teal-700 font-bold">{content.testimonials.kicker}</p><h3 className="text-3xl font-black">{content.testimonials.title}</h3><p>{content.testimonials.description}</p>{content.testimonials.items.map((t: any) => <div key={t.name} className="bg-white border rounded-xl p-4 text-left"><p className="text-emerald-600">★★★★★</p><p className="text-sm">{t.text}</p><b>{t.name}</b><p className="text-xs text-slate-500">{t.role}</p></div>)}</div>;
  if (section === 'faq') return <div className="text-center space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{content.faq.kicker}</p><h3 className="text-3xl font-black">{content.faq.title}</h3><p>{content.faq.description}</p>{content.faq.items.map((f: any) => <div key={f.question} className="bg-white border rounded-xl p-3 text-left"><b>{f.question}</b><p className="text-sm text-slate-500 mt-2">{f.answer}</p></div>)}</div>;
  if (section === 'finalCta') return <div className="text-center space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{content.finalCta.kicker}</p><h3 className="text-4xl font-black">{content.finalCta.title}</h3><p>{content.finalCta.description}</p><span className="block bg-emerald-500 text-white rounded-xl py-3 font-bold">{content.finalCta.button}</span></div>;
  if (section === 'footer') return <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4"><h3 className="text-2xl font-black text-teal-400">{content.brand.name}</h3><p>{content.footer.description}</p><div className="grid grid-cols-2 gap-4"><div><b>{content.footer.navigationTitle}</b></div><div><b>{content.footer.contactTitle}</b><p>{content.brand.email}<br />{content.brand.city}<br />{content.brand.coverage}</p></div></div></div>;
  return <div className="space-y-3"><p className="text-sm text-slate-500">Prévia resumida. Use os campos à esquerda para editar.</p><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(content[section] || content, null, 2)}</pre></div>;
}

function SeoPreview({ content }: { content: any }) {
  const seo = { ...defaultSeo, ...(content.seo || {}) };
  const icon = seo.faviconDataUrl || seo.faviconUrl || content.brand?.logoDataUrl || '/favicon.svg';
  const image = seo.shareImageDataUrl || seo.shareImageUrl || content.photos?.hero?.imageDataUrl || content.brand?.logoDataUrl;
  return <div className="space-y-5"><div><p className="mb-2 text-xs font-bold uppercase text-slate-500">Aba do navegador</p><div className="flex max-w-sm items-center gap-2 rounded-t-xl bg-slate-900 px-3 py-2 text-white"><img src={icon} className="h-5 w-5 rounded object-cover bg-white" /><span className="truncate text-sm">{seo.browserTitle}</span><span className="text-slate-400">×</span></div></div><div><p className="mb-2 text-xs font-bold uppercase text-slate-500">Prévia do link no WhatsApp/redes</p><div className="overflow-hidden rounded-2xl border bg-white shadow-sm">{image ? <img src={image} className="aspect-[1.91/1] w-full object-cover bg-slate-100" /> : <div className="aspect-[1.91/1] bg-slate-100 flex items-center justify-center text-sm text-slate-400">Sem imagem</div>}<div className="p-4"><p className="text-xs uppercase text-slate-400">{seo.siteUrl}</p><h3 className="mt-1 text-lg font-black">{seo.shareTitle}</h3><p className="mt-1 text-sm text-slate-600">{seo.shareDescription}</p></div></div></div><p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Depois de salvar, a Vercel gera o HTML com esses dados. WhatsApp e redes podem levar alguns minutos para limpar o cache da prévia antiga.</p></div>;
}
