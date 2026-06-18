import React, { useMemo, useState } from 'react';
import { AlertCircle, Code2, Eye, Home, Lock, Save, ShieldCheck, Upload } from 'lucide-react';

const HOME_PATH = 'artifacts/planos-saude/src/pages/Home.tsx';

type Status = 'idle' | 'loading' | 'ready' | 'saving' | 'error';
type Tab = 'identidade' | 'hero' | 'cotacao' | 'planos' | 'coberturas' | 'diferenciais' | 'todos' | 'avancado';
type TextEdit = { id: string; section: Tab; original: string; value: string };

const tabs: { id: Tab; label: string }[] = [
  { id: 'identidade', label: 'Identidade' },
  { id: 'hero', label: 'Seção principal' },
  { id: 'cotacao', label: 'Cotação' },
  { id: 'planos', label: 'Planos' },
  { id: 'coberturas', label: 'Coberturas' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'todos', label: 'Todos os textos' },
  { id: 'avancado', label: 'Código' },
];

function replaceAllText(source: string, search: string, replacement: string) {
  if (!search || search === replacement) return source;
  return source.split(search).join(replacement);
}

function updateWhatsappConstant(source: string, phone: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  return source.replace(/const WHATSAPP_BASE = "https:\/\/wa\.me\/[^\"]*";/, `const WHATSAPP_BASE = "https://wa.me/${cleanPhone}";`);
}

function readFirst(source: string, regex: RegExp, fallback: string) {
  return source.match(regex)?.[1]?.trim() || fallback;
}

function sectionFromIndex(source: string, index: number): Tab {
  const before = source.slice(0, index);
  const markers: { marker: string; section: Tab }[] = [
    ['{/* ── HERO ── */}', 'hero'],
    ['{/* ── QUOTE FORM ── */}', 'cotacao'],
    ['{/* ── PLANS ── */}', 'planos'],
    ['{/* ── COBERTURAS ── */}', 'coberturas'],
    ['{/* ── BENEFITS / DIFFERENTIALS ── */}', 'diferenciais'],
    ['{/* ── HOW IT WORKS ── */}', 'diferenciais'],
    ['{/* ── TESTIMONIALS ── */}', 'diferenciais'],
    ['{/* ── FOOTER ── */}', 'identidade'],
  ];

  let selected: Tab = 'identidade';
  let last = -1;
  for (const item of markers) {
    const found = before.lastIndexOf(item.marker);
    if (found > last) {
      last = found;
      selected = item.section;
    }
  }
  return selected;
}

function shouldIncludeText(value: string) {
  const text = value.trim();
  if (text.length < 4 || text.length > 180) return false;
  if (/^[#./A-Za-z0-9:_\-\s]+$/.test(text) && !/[áàãâéêíóôõúçÁÀÃÂÉÊÍÓÔÕÚÇ]/.test(text)) return false;
  if (text.includes('className') || text.includes('data-testid') || text.includes('http')) return false;
  if (text.startsWith('w-') || text.startsWith('text-') || text.startsWith('bg-')) return false;
  return /[A-Za-zÀ-ÿ]/.test(text);
}

function extractEditableTexts(source: string): TextEdit[] {
  const results: TextEdit[] = [];
  const seen = new Set<string>();
  const patterns = [
    />\s*([^<>{}\n][^<>{}]{3,180})\s*</g,
    /"([^"{}\n]{4,180})"/g,
  ];

  patterns.forEach((pattern) => {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(source))) {
      const original = match[1].trim();
      if (!shouldIncludeText(original)) continue;
      if (seen.has(original)) continue;
      seen.add(original);
      results.push({
        id: `${results.length}-${original.slice(0, 18)}`,
        section: sectionFromIndex(source, match.index),
        original,
        value: original,
      });
    }
  });

  return results.slice(0, 140);
}

function sectionTitle(section: Tab) {
  const found = tabs.find((tab) => tab.id === section);
  return found?.label || 'Seção';
}

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin-password') || '');
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin-auth') === 'true');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('identidade');
  const [textEdits, setTextEdits] = useState<TextEdit[]>([]);

  const [brandName, setBrandName] = useState('Rota Seguros');
  const [whatsapp, setWhatsapp] = useState('553193659875');
  const [heroBadge, setHeroBadge] = useState('Corretora de Saúde Especializada - Belo Horizonte, MG');
  const [heroTitleStart, setHeroTitleStart] = useState('O plano de saúde');
  const [heroTitleHighlight, setHeroTitleHighlight] = useState('certo para você');
  const [heroTitleEnd, setHeroTitleEnd] = useState('sem complicação.');
  const [heroSubtitle, setHeroSubtitle] = useState('Somos especialistas em planos de saúde individuais, familiares e empresariais. Consultoria gratuita, imparcial e com as melhores operadoras do mercado.');
  const [heroSupport, setHeroSupport] = useState('Atendemos por WhatsApp rápido, sem burocracia e sem compromisso.');
  const [primaryCta, setPrimaryCta] = useState('Fazer Cotação Gratuita');
  const [secondaryCta, setSecondaryCta] = useState('Conhecer os Planos');
  const [logoDataUrl, setLogoDataUrl] = useState('');

  function hydrateFields(content: string) {
    setWhatsapp(readFirst(content, /const WHATSAPP_BASE = "https:\/\/wa\.me\/([^\"]*)";/, whatsapp));
    setBrandName(readFirst(content, /<span className="font-display font-bold text-xl tracking-tight text-primary">([^<]*)<\/span>/, brandName));
    setHeroBadge(readFirst(content, /<Shield className="h-4 w-4" \/>\s*([^<]*)\s*<\/motion\.div>/, heroBadge));
    setHeroTitleHighlight(readFirst(content, /<span className="relative z-10 text-primary">([^<]*)<\/span>/, heroTitleHighlight));
    setHeroSubtitle(readFirst(content, /<motion\.p variants=\{fadeUp\} className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">\s*([^<]*)\s*<\/motion\.p>/, heroSubtitle));
    setHeroSupport(readFirst(content, /<motion\.p variants=\{fadeUp\} className="text-base text-muted-foreground\/70 mb-10 max-w-xl mx-auto">\s*([^<]*)\s*<\/motion\.p>/, heroSupport));
    setTextEdits(extractEditableTexts(content));
  }

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setMessage('Validando senha...');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Senha inválida.');
      sessionStorage.setItem('admin-password', password);
      sessionStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
      await loadHome(password);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao autenticar.');
    }
  }

  async function loadHome(activePassword = password) {
    setStatus('loading');
    setMessage('Carregando o conteúdo atual do site...');

    try {
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(HOME_PATH)}`, {
        headers: { 'x-admin-password': activePassword },
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível carregar o site.');
      const content = String(data.content || '');
      setSource(content);
      hydrateFields(content);
      setStatus('ready');
      setMessage('Conteúdo carregado.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao carregar conteúdo.');
    }
  }

  function updateTextEdit(id: string, value: string) {
    setTextEdits((items) => items.map((item) => item.id === id ? { ...item, value } : item));
  }

  const updatedSource = useMemo(() => {
    let next = source;
    next = updateWhatsappConstant(next, whatsapp);
    next = replaceAllText(next, 'Rota Seguros', brandName);
    next = replaceAllText(next, 'Corretora de Saúde Especializada - Belo Horizonte, MG', heroBadge);
    next = replaceAllText(next, 'Corretora de Saúde Especializada — Belo Horizonte, MG', heroBadge);
    next = replaceAllText(next, 'O plano de saúde', heroTitleStart);
    next = replaceAllText(next, 'certo para você', heroTitleHighlight);
    next = replaceAllText(next, 'sem complicação.', heroTitleEnd);
    next = replaceAllText(next, 'Somos especialistas em planos de saúde individuais, familiares e empresariais. Consultoria gratuita, imparcial e com as melhores operadoras do mercado.', heroSubtitle);
    next = replaceAllText(next, 'Atendemos por WhatsApp rápido, sem burocracia e sem compromisso.', heroSupport);
    next = replaceAllText(next, 'Atendemos por WhatsApp — rápido, sem burocracia e sem compromisso.', heroSupport);
    next = replaceAllText(next, 'Fazer Cotação Gratuita', primaryCta);
    next = replaceAllText(next, 'Conhecer os Planos', secondaryCta);

    textEdits.forEach((item) => {
      if (item.value.trim() && item.value !== item.original) {
        next = replaceAllText(next, item.original, item.value);
      }
    });

    if (logoDataUrl) {
      const imgTag = `<img src="${logoDataUrl}" alt="Logo" className="admin-logo-data-url h-7 w-7 rounded-lg object-contain" />`;
      if (next.includes('admin-logo-data-url')) {
        next = next.replace(/<img src="[^"]*" alt="Logo" className="admin-logo-data-url h-7 w-7 rounded-lg object-contain" \/>/, imgTag);
      } else {
        next = next.replace('<HeartPulse className="h-5 w-5 text-white" />', imgTag);
      }
    }

    return next;
  }, [source, brandName, whatsapp, heroBadge, heroTitleStart, heroTitleHighlight, heroTitleEnd, heroSubtitle, heroSupport, primaryCta, secondaryCta, logoDataUrl, textEdits]);

  async function save() {
    setStatus('saving');
    setMessage('Salvando no GitHub e criando commit...');

    try {
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(HOME_PATH)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ content: activeTab === 'avancado' ? source : updatedSource }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível salvar.');
      const savedContent = activeTab === 'avancado' ? source : updatedSource;
      setSource(savedContent);
      hydrateFields(savedContent);
      setStatus('ready');
      setMessage(`Salvo com sucesso. Commit: ${data.commit || 'criado'}. A Vercel deve iniciar novo deploy.`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar.');
    }
  }

  function uploadLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 450_000) {
      setMessage('Use uma imagem menor que 450 KB para não deixar o site pesado.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  const visibleTexts = textEdits.filter((item) => activeTab === 'todos' ? true : item.section === activeTab);
  const changedTexts = textEdits.filter((item) => item.value !== item.original);
  const previewTexts = activeTab === 'identidade'
    ? [brandName, `WhatsApp: ${whatsapp}`, heroBadge]
    : activeTab === 'hero'
      ? [heroBadge, `${heroTitleStart} ${heroTitleHighlight} ${heroTitleEnd}`, heroSubtitle, heroSupport, primaryCta, secondaryCta]
      : visibleTexts.slice(0, 8).map((item) => item.value);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin do site</h1>
          <p className="text-slate-300 mb-6">Página secreta para editar conteúdo, logo e publicar com commit no GitHub.</p>
          <label className="block text-sm font-semibold mb-2">Senha secreta</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-emerald-400" placeholder="Digite a senha" />
          <button type="submit" className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-bold hover:bg-emerald-400 transition">Entrar</button>
          {message && <p className="mt-4 text-sm text-amber-200">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-700 font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Painel protegido</p>
            <h1 className="text-2xl font-black">Editar site completo</h1>
          </div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold flex items-center gap-2"><Home className="h-4 w-4" /> Ver site</a>
            <button onClick={save} disabled={!source || status === 'saving'} className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-bold flex items-center gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> Salvar e publicar</button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-6">
        {message && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2"><AlertCircle className="h-5 w-5 shrink-0" /> <span>{message}</span></div>}

        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2 font-bold border ${activeTab === tab.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_460px] gap-6">
          <div className="space-y-5">
            {activeTab === 'identidade' && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Identidade do site</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block"><span className="text-sm font-semibold">Nome da marca</span><input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                  <label className="block"><span className="text-sm font-semibold">WhatsApp com DDI e DDD</span><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                </div>
                <label className="mt-4 block"><span className="text-sm font-semibold flex items-center gap-2"><Upload className="h-4 w-4" /> Logo</span><div className="mt-1 rounded-xl border border-dashed p-4 bg-slate-50"><input type="file" accept="image/*" onChange={uploadLogo} /><p className="text-xs text-slate-500 mt-2">Use PNG, JPG ou SVG pequeno. A imagem será salva no commit.</p>{logoDataUrl && <img src={logoDataUrl} alt="Prévia" className="mt-3 h-16 w-16 object-contain rounded-xl bg-white border" />}</div></label>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Seção principal</h2>
                <div className="space-y-4">
                  <label className="block"><span className="text-sm font-semibold">Selo</span><input value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                  <div className="grid md:grid-cols-3 gap-4">
                    <label className="block"><span className="text-sm font-semibold">Título início</span><input value={heroTitleStart} onChange={(e) => setHeroTitleStart(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                    <label className="block"><span className="text-sm font-semibold">Título destaque</span><input value={heroTitleHighlight} onChange={(e) => setHeroTitleHighlight(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                    <label className="block"><span className="text-sm font-semibold">Título final</span><input value={heroTitleEnd} onChange={(e) => setHeroTitleEnd(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                  </div>
                  <label className="block"><span className="text-sm font-semibold">Subtítulo</span><textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="mt-1 w-full rounded-xl border p-3 min-h-24" /></label>
                  <label className="block"><span className="text-sm font-semibold">Texto de apoio</span><input value={heroSupport} onChange={(e) => setHeroSupport(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="block"><span className="text-sm font-semibold">Botão principal</span><input value={primaryCta} onChange={(e) => setPrimaryCta(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                    <label className="block"><span className="text-sm font-semibold">Botão secundário</span><input value={secondaryCta} onChange={(e) => setSecondaryCta(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'identidade' && activeTab !== 'hero' && activeTab !== 'avancado' && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-2">Textos de {sectionTitle(activeTab)}</h2>
                <p className="text-sm text-slate-500 mb-5">Altere os textos abaixo. A prévia ao lado muda imediatamente conforme você edita.</p>
                <div className="space-y-4">
                  {visibleTexts.length === 0 && <p className="text-sm text-slate-500">Nenhum texto automático encontrado nesta seção. Use a aba Código para editar manualmente.</p>}
                  {visibleTexts.map((item, index) => (
                    <label key={item.id} className="block rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <span className="text-xs font-bold text-slate-500">Texto {index + 1}</span>
                      <textarea value={item.value} onChange={(e) => updateTextEdit(item.id, e.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3 min-h-20" />
                      {item.value !== item.original && <span className="mt-2 block text-xs text-emerald-700 font-semibold">Alterado</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'avancado' && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Code2 className="h-5 w-5" /> Editor avançado do Home.tsx</h2>
                <p className="text-sm text-slate-500 mb-4">Use apenas quando precisar mexer em estrutura, ordem das seções ou elementos que não aparecem no editor visual.</p>
                <textarea value={source} onChange={(e) => setSource(e.target.value)} className="w-full min-h-[680px] rounded-xl border p-4 font-mono text-xs" />
              </div>
            )}
          </div>

          <aside className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm h-fit sticky top-28">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="h-5 w-5" /> Prévia da aba</h2>
            <div className="rounded-2xl border bg-slate-50 p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{sectionTitle(activeTab)}</p>
              {activeTab === 'hero' && (
                <>
                  <p className="text-sm font-bold text-emerald-700">{heroBadge}</p>
                  {logoDataUrl && <img src={logoDataUrl} alt="Logo" className="h-14 w-14 rounded-xl object-contain bg-white border" />}
                  <h3 className="text-3xl font-black leading-tight">{heroTitleStart} <span className="text-emerald-700">{heroTitleHighlight}</span> {heroTitleEnd}</h3>
                  <p className="text-slate-600">{heroSubtitle}</p>
                  <p className="text-sm text-slate-500">{heroSupport}</p>
                  <div className="flex flex-col gap-2">
                    <span className="rounded-xl bg-emerald-600 text-white px-4 py-3 font-bold text-center">{primaryCta}</span>
                    <span className="rounded-xl border px-4 py-3 font-semibold text-center">{secondaryCta}</span>
                  </div>
                </>
              )}
              {activeTab !== 'hero' && previewTexts.map((text, index) => (
                <div key={`${text}-${index}`} className="rounded-xl bg-white border p-3">
                  <p className={index === 0 ? 'text-lg font-black' : 'text-sm text-slate-600'}>{text}</p>
                </div>
              ))}
              {changedTexts.length > 0 && <p className="text-xs text-emerald-700 font-bold">{changedTexts.length} texto(s) alterado(s) antes de salvar.</p>}
            </div>
            <button onClick={() => loadHome()} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2 font-semibold">Recarregar arquivo</button>
          </aside>
        </div>
      </section>
    </main>
  );
}
