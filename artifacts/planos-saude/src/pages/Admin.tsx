import React, { useMemo, useState } from 'react';
import { AlertCircle, Code2, Eye, Home, Lock, Save, ShieldCheck, Upload, MessageCircle, CheckCircle2 } from 'lucide-react';

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

const defaultTexts: TextEdit[] = [
  { id: 'cotacao-1', section: 'cotacao', original: 'Cotação Gratuita', value: 'Cotação Gratuita' },
  { id: 'cotacao-2', section: 'cotacao', original: 'Receba sua cotação em minutos pelo WhatsApp.', value: 'Receba sua cotação em minutos pelo WhatsApp.' },
  { id: 'cotacao-3', section: 'cotacao', original: 'Preencha os campos ao lado e clique no botão. Sua mensagem chegará já formatada para o nosso especialista — sem precisar digitar nada.', value: 'Preencha os campos ao lado e clique no botão. Sua mensagem chegará já formatada para o nosso especialista — sem precisar digitar nada.' },
  { id: 'cotacao-4', section: 'cotacao', original: 'Consultoria 100% gratuita e sem compromisso', value: 'Consultoria 100% gratuita e sem compromisso' },
  { id: 'cotacao-5', section: 'cotacao', original: 'Respondemos em até 5 minutos em horário comercial', value: 'Respondemos em até 5 minutos em horário comercial' },
  { id: 'cotacao-6', section: 'cotacao', original: 'Solicite sua cotação', value: 'Solicite sua cotação' },
  { id: 'cotacao-7', section: 'cotacao', original: 'Preencha e envie — simples assim.', value: 'Preencha e envie — simples assim.' },
  { id: 'cotacao-8', section: 'cotacao', original: 'Seu nome completo', value: 'Seu nome completo' },
  { id: 'cotacao-9', section: 'cotacao', original: 'Cidade', value: 'Cidade' },
  { id: 'cotacao-10', section: 'cotacao', original: 'Tipo de plano', value: 'Tipo de plano' },
  { id: 'cotacao-11', section: 'cotacao', original: 'Enviar Cotação pelo WhatsApp', value: 'Enviar Cotação pelo WhatsApp' },

  { id: 'planos-1', section: 'planos', original: 'Nossos Planos', value: 'Nossos Planos' },
  { id: 'planos-2', section: 'planos', original: 'Uma solução para cada momento de vida', value: 'Uma solução para cada momento de vida' },
  { id: 'planos-3', section: 'planos', original: 'Seja para você, sua família ou sua empresa — encontramos as melhores opções com as melhores condições do mercado. Consulte-nos gratuitamente pelo WhatsApp.', value: 'Seja para você, sua família ou sua empresa — encontramos as melhores opções com as melhores condições do mercado. Consulte-nos gratuitamente pelo WhatsApp.' },
  { id: 'planos-4', section: 'planos', original: 'Plano Individual', value: 'Plano Individual' },
  { id: 'planos-5', section: 'planos', original: 'Plano Familiar', value: 'Plano Familiar' },
  { id: 'planos-6', section: 'planos', original: 'Plano Empresarial', value: 'Plano Empresarial' },
  { id: 'planos-7', section: 'planos', original: 'Proteção completa para toda a família com benefícios exclusivos para crianças, gestantes e idosos.', value: 'Proteção completa para toda a família com benefícios exclusivos para crianças, gestantes e idosos.' },
  { id: 'planos-8', section: 'planos', original: 'Planos corporativos acessíveis para MEIs, microempresas e grandes empresas. Valorize sua equipe com saúde de qualidade.', value: 'Planos corporativos acessíveis para MEIs, microempresas e grandes empresas. Valorize sua equipe com saúde de qualidade.' },
  { id: 'planos-9', section: 'planos', original: 'Cotar Plano Familiar', value: 'Cotar Plano Familiar' },
  { id: 'planos-10', section: 'planos', original: 'Cotar Plano Empresarial', value: 'Cotar Plano Empresarial' },

  { id: 'coberturas-1', section: 'coberturas', original: 'Coberturas', value: 'Coberturas' },
  { id: 'coberturas-2', section: 'coberturas', original: 'O que os planos podem cobrir', value: 'O que os planos podem cobrir' },
  { id: 'coberturas-3', section: 'coberturas', original: 'De acordo com a ANS, os planos de saúde oferecem cobertura obrigatória para diversos procedimentos. Conheça os principais:', value: 'De acordo com a ANS, os planos de saúde oferecem cobertura obrigatória para diversos procedimentos. Conheça os principais:' },
  { id: 'coberturas-4', section: 'coberturas', original: 'Consultas Médicas', value: 'Consultas Médicas' },
  { id: 'coberturas-5', section: 'coberturas', original: 'Exames e Diagnósticos', value: 'Exames e Diagnósticos' },
  { id: 'coberturas-6', section: 'coberturas', original: 'Internação Hospitalar', value: 'Internação Hospitalar' },
  { id: 'coberturas-7', section: 'coberturas', original: 'Urgência e Emergência', value: 'Urgência e Emergência' },
  { id: 'coberturas-8', section: 'coberturas', original: 'Tirar dúvidas no WhatsApp', value: 'Tirar dúvidas no WhatsApp' },

  { id: 'diferenciais-1', section: 'diferenciais', original: 'Por que a Rota Seguros', value: 'Por que a Rota Seguros' },
  { id: 'diferenciais-2', section: 'diferenciais', original: 'Mais do que um corretor — um parceiro de saúde.', value: 'Mais do que um corretor — um parceiro de saúde.' },
  { id: 'diferenciais-3', section: 'diferenciais', original: 'Não somos representantes de uma única operadora. Trabalhamos com as principais do mercado e buscamos, de forma independente, o plano que realmente faz sentido para o seu perfil e orçamento.', value: 'Não somos representantes de uma única operadora. Trabalhamos com as principais do mercado e buscamos, de forma independente, o plano que realmente faz sentido para o seu perfil e orçamento.' },
  { id: 'diferenciais-4', section: 'diferenciais', original: 'Consultoria Imparcial e Gratuita', value: 'Consultoria Imparcial e Gratuita' },
  { id: 'diferenciais-5', section: 'diferenciais', original: 'Atendimento Rápido pelo WhatsApp', value: 'Atendimento Rápido pelo WhatsApp' },
  { id: 'diferenciais-6', section: 'diferenciais', original: 'Suporte Completo Pós-Contratação', value: 'Suporte Completo Pós-Contratação' },
  { id: 'diferenciais-7', section: 'diferenciais', original: 'Especialistas em Regulamentação ANS', value: 'Especialistas em Regulamentação ANS' },
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

function sectionTitle(section: Tab) {
  return tabs.find((tab) => tab.id === section)?.label || 'Seção';
}

function mergeTextEdits(source: string) {
  return defaultTexts.map((item) => ({ ...item, value: source.includes(item.original) ? item.original : item.value }));
}

function FieldList({ items, onChange }: { items: TextEdit[]; onChange: (id: string, value: string) => void }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <label key={item.id} className="block rounded-2xl border border-slate-200 p-4 bg-slate-50">
          <span className="text-xs font-bold text-slate-500">Texto {index + 1}</span>
          <textarea value={item.value} onChange={(e) => onChange(item.id, e.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3 min-h-20" />
          {item.value !== item.original && <span className="mt-2 block text-xs text-emerald-700 font-semibold">Alterado</span>}
        </label>
      ))}
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin-password') || '');
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin-auth') === 'true');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('identidade');
  const [textEdits, setTextEdits] = useState<TextEdit[]>(defaultTexts);

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
    setTextEdits(mergeTextEdits(content));
  }

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setMessage('Validando senha...');
    try {
      const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
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
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(HOME_PATH)}`, { headers: { 'x-admin-password': activePassword } });
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
    textEdits.forEach((item) => { if (item.value !== item.original) next = replaceAllText(next, item.original, item.value); });
    if (logoDataUrl) {
      const imgTag = `<img src="${logoDataUrl}" alt="Logo" className="admin-logo-data-url h-7 w-7 rounded-lg object-contain" />`;
      next = next.includes('admin-logo-data-url') ? next.replace(/<img src="[^"]*" alt="Logo" className="admin-logo-data-url h-7 w-7 rounded-lg object-contain" \/>/, imgTag) : next.replace('<HeartPulse className="h-5 w-5 text-white" />', imgTag);
    }
    return next;
  }, [source, brandName, whatsapp, heroBadge, heroTitleStart, heroTitleHighlight, heroTitleEnd, heroSubtitle, heroSupport, primaryCta, secondaryCta, logoDataUrl, textEdits]);

  async function save() {
    setStatus('saving');
    setMessage('Salvando no GitHub e criando commit...');
    try {
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(HOME_PATH)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ content: activeTab === 'avancado' ? source : updatedSource }) });
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
    if (file.size > 450_000) { setMessage('Use uma imagem menor que 450 KB para não deixar o site pesado.'); return; }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  const visibleTexts = textEdits.filter((item) => activeTab === 'todos' ? true : item.section === activeTab);
  const getText = (id: string, fallback: string) => textEdits.find((item) => item.id === id)?.value || fallback;
  const changedTexts = textEdits.filter((item) => item.value !== item.original);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6"><Lock className="h-7 w-7" /></div>
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
          <div><p className="text-sm text-emerald-700 font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Painel protegido</p><h1 className="text-2xl font-black">Editar site completo</h1></div>
          <div className="flex gap-2"><a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold flex items-center gap-2"><Home className="h-4 w-4" /> Ver site</a><button onClick={save} disabled={!source || status === 'saving'} className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-bold flex items-center gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> Salvar e publicar</button></div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-6">
        {message && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2"><AlertCircle className="h-5 w-5 shrink-0" /> <span>{message}</span></div>}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2 font-bold border ${activeTab === tab.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'}`}>{tab.label}</button>)}</div>

        <div className="grid lg:grid-cols-[1fr_520px] gap-6">
          <div className="space-y-5">
            {activeTab === 'identidade' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-4">Identidade do site</h2><div className="grid md:grid-cols-2 gap-4"><label className="block"><span className="text-sm font-semibold">Nome da marca</span><input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">WhatsApp com DDI e DDD</span><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label></div><label className="mt-4 block"><span className="text-sm font-semibold flex items-center gap-2"><Upload className="h-4 w-4" /> Logo</span><div className="mt-1 rounded-xl border border-dashed p-4 bg-slate-50"><input type="file" accept="image/*" onChange={uploadLogo} /><p className="text-xs text-slate-500 mt-2">Use PNG, JPG ou SVG pequeno. A imagem será salva no commit.</p>{logoDataUrl && <img src={logoDataUrl} alt="Prévia" className="mt-3 h-16 w-16 object-contain rounded-xl bg-white border" />}</div></label></div>}

            {activeTab === 'hero' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-4">Seção principal</h2><div className="space-y-4"><label className="block"><span className="text-sm font-semibold">Selo</span><input value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><div className="grid md:grid-cols-3 gap-4"><label className="block"><span className="text-sm font-semibold">Título início</span><input value={heroTitleStart} onChange={(e) => setHeroTitleStart(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">Título destaque</span><input value={heroTitleHighlight} onChange={(e) => setHeroTitleHighlight(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">Título final</span><input value={heroTitleEnd} onChange={(e) => setHeroTitleEnd(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label></div><label className="block"><span className="text-sm font-semibold">Subtítulo</span><textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="mt-1 w-full rounded-xl border p-3 min-h-24" /></label><label className="block"><span className="text-sm font-semibold">Texto de apoio</span><input value={heroSupport} onChange={(e) => setHeroSupport(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><div className="grid md:grid-cols-2 gap-4"><label className="block"><span className="text-sm font-semibold">Botão principal</span><input value={primaryCta} onChange={(e) => setPrimaryCta(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">Botão secundário</span><input value={secondaryCta} onChange={(e) => setSecondaryCta(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label></div></div></div>}

            {activeTab !== 'identidade' && activeTab !== 'hero' && activeTab !== 'avancado' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2">Textos de {sectionTitle(activeTab)}</h2><p className="text-sm text-slate-500 mb-5">Altere os textos abaixo. A prévia visual ao lado muda na hora.</p><FieldList items={visibleTexts} onChange={updateTextEdit} /></div>}
            {activeTab === 'avancado' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Code2 className="h-5 w-5" /> Editor avançado do Home.tsx</h2><textarea value={source} onChange={(e) => setSource(e.target.value)} className="w-full min-h-[680px] rounded-xl border p-4 font-mono text-xs" /></div>}
          </div>

          <aside className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm h-fit sticky top-28">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="h-5 w-5" /> Prévia visual</h2>
            <div className="rounded-2xl border bg-slate-50 p-5 overflow-hidden">
              {activeTab === 'identidade' && <div className="space-y-4"><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-teal-700 text-white flex items-center justify-center font-black">{brandName.slice(0, 1)}</div><h3 className="text-2xl font-black text-teal-700">{brandName}</h3></div><p className="text-sm text-slate-600">WhatsApp principal: {whatsapp}</p>{logoDataUrl && <img src={logoDataUrl} alt="Logo" className="h-20 w-20 object-contain bg-white rounded-xl border" />}</div>}

              {activeTab === 'hero' && <div className="space-y-4 text-center"><p className="inline-block rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">{heroBadge}</p><h3 className="text-4xl font-black leading-tight">{heroTitleStart} <span className="text-emerald-700">{heroTitleHighlight}</span> {heroTitleEnd}</h3><p className="text-slate-600">{heroSubtitle}</p><p className="text-sm text-slate-500">{heroSupport}</p><span className="block rounded-xl bg-emerald-600 text-white px-4 py-3 font-bold">{primaryCta}</span><span className="block rounded-xl border bg-white px-4 py-3 font-semibold">{secondaryCta}</span></div>}

              {activeTab === 'cotacao' && <div className="grid gap-4"><div><p className="text-xs font-black tracking-widest text-teal-700 uppercase">{getText('cotacao-1', 'Cotação Gratuita')}</p><h3 className="text-4xl font-black leading-tight mt-2">{getText('cotacao-2', 'Receba sua cotação em minutos pelo WhatsApp.')}</h3><p className="mt-3 text-slate-600">{getText('cotacao-3', '')}</p><ul className="mt-4 space-y-2 text-sm text-slate-600"><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{getText('cotacao-4', '')}</li><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{getText('cotacao-5', '')}</li></ul></div><div className="rounded-2xl bg-white border p-4 shadow-sm"><h4 className="text-xl font-black">{getText('cotacao-6', 'Solicite sua cotação')}</h4><p className="text-sm text-slate-500 mb-4">{getText('cotacao-7', '')}</p><div className="space-y-3"><div className="rounded-xl border p-3 text-sm text-slate-500">{getText('cotacao-8', '')}</div><div className="rounded-xl border p-3 text-sm text-slate-500">{getText('cotacao-9', '')}</div><div className="grid grid-cols-3 gap-2"><span className="rounded-xl border p-2 text-xs text-center">Individual</span><span className="rounded-xl border p-2 text-xs text-center">Familiar</span><span className="rounded-xl border p-2 text-xs text-center">Empresarial</span></div><span className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white px-4 py-3 font-bold"><MessageCircle className="h-4 w-4" />{getText('cotacao-11', '')}</span></div></div></div>}

              {activeTab === 'planos' && <div className="space-y-4 text-center"><p className="text-xs font-black tracking-widest text-teal-700 uppercase">{getText('planos-1', '')}</p><h3 className="text-3xl font-black leading-tight">{getText('planos-2', '')}</h3><p className="text-slate-600">{getText('planos-3', '')}</p><div className="grid gap-3 text-left"><div className="rounded-2xl bg-white border p-4"><h4 className="font-black text-lg">{getText('planos-4', '')}</h4><p className="text-sm text-slate-500">Consultoria personalizada para quem busca proteção individual.</p></div><div className="rounded-2xl bg-white border-2 border-emerald-500 p-4"><span className="text-xs font-bold text-emerald-700">Mais Buscado</span><h4 className="font-black text-lg">{getText('planos-5', '')}</h4><p className="text-sm text-slate-500">{getText('planos-7', '')}</p><span className="mt-3 block rounded-xl bg-emerald-600 text-white text-center py-2 font-bold">{getText('planos-9', '')}</span></div><div className="rounded-2xl bg-white border p-4"><h4 className="font-black text-lg">{getText('planos-6', '')}</h4><p className="text-sm text-slate-500">{getText('planos-8', '')}</p><span className="mt-3 block rounded-xl bg-slate-100 text-center py-2 font-bold">{getText('planos-10', '')}</span></div></div></div>}

              {activeTab === 'coberturas' && <div className="space-y-4 text-center bg-slate-900 text-white rounded-2xl p-5"><p className="text-xs font-black tracking-widest text-emerald-400 uppercase">{getText('coberturas-1', '')}</p><h3 className="text-3xl font-black leading-tight">{getText('coberturas-2', '')}</h3><p className="text-slate-300">{getText('coberturas-3', '')}</p><div className="grid grid-cols-2 gap-3 text-left"><div className="rounded-xl bg-white/10 p-3"><h4 className="font-bold">{getText('coberturas-4', '')}</h4></div><div className="rounded-xl bg-white/10 p-3"><h4 className="font-bold">{getText('coberturas-5', '')}</h4></div><div className="rounded-xl bg-white/10 p-3"><h4 className="font-bold">{getText('coberturas-6', '')}</h4></div><div className="rounded-xl bg-white/10 p-3"><h4 className="font-bold">{getText('coberturas-7', '')}</h4></div></div><span className="block rounded-xl bg-emerald-500 text-white px-4 py-3 font-bold">{getText('coberturas-8', '')}</span></div>}

              {activeTab === 'diferenciais' && <div className="space-y-4"><p className="text-xs font-black tracking-widest text-teal-700 uppercase">{getText('diferenciais-1', '')}</p><h3 className="text-3xl font-black leading-tight">{getText('diferenciais-2', '')}</h3><p className="text-slate-600">{getText('diferenciais-3', '')}</p><div className="space-y-3"><div className="rounded-xl bg-white border p-3 font-bold">{getText('diferenciais-4', '')}</div><div className="rounded-xl bg-white border p-3 font-bold">{getText('diferenciais-5', '')}</div><div className="rounded-xl bg-white border p-3 font-bold">{getText('diferenciais-6', '')}</div><div className="rounded-xl bg-white border p-3 font-bold">{getText('diferenciais-7', '')}</div></div></div>}

              {activeTab === 'todos' && <div className="space-y-3">{visibleTexts.slice(0, 12).map((item) => <div key={item.id} className="rounded-xl bg-white border p-3"><p className="text-xs font-bold text-slate-400">{sectionTitle(item.section)}</p><p className="text-sm text-slate-700">{item.value}</p></div>)}</div>}
              {activeTab === 'avancado' && <p className="text-sm text-slate-600">Prévia visual desativada no modo código. Use as abas visuais para ver as alterações em tempo real.</p>}
            </div>
            {changedTexts.length > 0 && <p className="mt-4 text-xs text-emerald-700 font-bold">{changedTexts.length} texto(s) alterado(s) antes de salvar.</p>}
            <button onClick={() => loadHome()} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2 font-semibold">Recarregar arquivo</button>
          </aside>
        </div>
      </section>
    </main>
  );
}
