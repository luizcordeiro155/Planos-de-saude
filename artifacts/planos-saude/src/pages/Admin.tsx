import React, { useMemo, useState } from 'react';
import { AlertCircle, Code2, Eye, Home, Lock, Save, ShieldCheck } from 'lucide-react';

const CONTENT_PATH = 'artifacts/planos-saude/src/content/siteContent.json';

type Status = 'idle' | 'loading' | 'ready' | 'saving' | 'error';
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type Section = {
  id: string;
  label: string;
  path: string;
};

const sections: Section[] = [
  { id: 'brand', label: 'Identidade', path: 'brand' },
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
  { id: 'json', label: 'JSON completo', path: '' },
];

const labels: Record<string, string> = {
  brand: 'Identidade', name: 'Nome', logoDataUrl: 'Logo em Base64 ou URL', whatsapp: 'WhatsApp com DDI e DDD', phoneDisplay: 'Telefone exibido', email: 'E-mail', city: 'Cidade', coverage: 'Área de atendimento',
  nav: 'Menu', hero: 'Seção principal', badge: 'Selo', titleStart: 'Título início', titleHighlight: 'Título destaque', titleEnd: 'Título final', subtitle: 'Subtítulo', supportText: 'Texto de apoio', primaryButton: 'Botão principal', secondaryButton: 'Botão secundário',
  metrics: 'Métricas', value: 'Valor', suffix: 'Sufixo', label: 'Rótulo', operators: 'Operadoras', items: 'Itens', title: 'Título', description: 'Descrição',
  quote: 'Cotação', kicker: 'Chamada pequena', benefits: 'Benefícios', formTitle: 'Título do formulário', formSubtitle: 'Subtítulo do formulário', nameLabel: 'Campo nome', namePlaceholder: 'Placeholder nome', cityLabel: 'Campo cidade', cityPlaceholder: 'Placeholder cidade', typeLabel: 'Campo tipo', types: 'Tipos de plano', button: 'Botão', note: 'Observação',
  plans: 'Planos', badge: 'Selo', features: 'Características', coverages: 'Coberturas', differentials: 'Diferenciais', stats: 'Estatísticas', ratingTitle: 'Nota', ratingSubtitle: 'Texto da nota', process: 'Como funciona', steps: 'Passos', number: 'Número', testimonials: 'Depoimentos', role: 'Cargo/cidade', text: 'Comentário', stars: 'Estrelas', faq: 'FAQ', question: 'Pergunta', answer: 'Resposta', footerText: 'Texto final', finalCta: 'CTA final', footer: 'Rodapé', regulatoryLabel: 'Texto regulatório', regulatoryValue: 'Valor regulatório', navigationTitle: 'Título navegação', contactTitle: 'Título contato', copyright: 'Copyright', bottomText: 'Texto final do rodapé'
};

function getAtPath(obj: any, path: string) {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
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
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Senha inválida.');
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
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível carregar o conteúdo.');
      const parsed = JSON.parse(data.content);
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
      const nextContent = activeSection === 'json' ? JSON.parse(rawJson) : content;
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(CONTENT_PATH)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ content: JSON.stringify(nextContent, null, 2) + '\n' }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível salvar.');
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
    return <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 p-8 shadow-2xl"><div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6"><Lock className="h-7 w-7" /></div><h1 className="text-3xl font-bold mb-2">Admin do site</h1><p className="text-slate-300 mb-6">Edite tudo do site a partir da fonte oficial de conteúdo.</p><label className="block text-sm font-semibold mb-2">Senha secreta</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-emerald-400" /><button type="submit" className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-bold hover:bg-emerald-400">Entrar</button>{message && <p className="mt-4 text-sm text-amber-200">{message}</p>}</form></main>;
  }

  return <main className="min-h-screen bg-slate-100 text-slate-950"><header className="bg-white border-b border-slate-200 sticky top-0 z-20"><div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-emerald-700 font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Painel protegido</p><h1 className="text-2xl font-black">Editar site completo</h1></div><div className="flex gap-2"><a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold flex items-center gap-2"><Home className="h-4 w-4" /> Ver site</a><button onClick={() => loadContent()} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold">Recarregar</button><button onClick={save} disabled={!content || status === 'saving'} className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-bold flex items-center gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> Salvar e publicar</button></div></div></header><section className="max-w-7xl mx-auto px-4 py-6">{message && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2"><AlertCircle className="h-5 w-5 shrink-0" /><span>{message}</span></div>}<div className="mb-5 flex gap-2 overflow-x-auto pb-2">{sections.map((tab) => <button key={tab.id} onClick={() => setActiveSection(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2 font-bold border ${activeSection === tab.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'}`}>{tab.label}</button>)}</div>{!content ? <div className="rounded-3xl bg-white p-8 border">Carregando...</div> : <div className="grid lg:grid-cols-[1fr_520px] gap-6"><div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2">Editar {section.label}</h2><p className="text-sm text-slate-500 mb-5">Tudo aqui é a fonte oficial do site. Ao salvar, o site e o admin ficam sincronizados.</p>{activeSection === 'json' ? <textarea value={rawJson} onChange={(event) => setRawJson(event.target.value)} className="w-full min-h-[720px] rounded-xl border p-4 font-mono text-xs" /> : <JsonEditor value={sectionData} path={section.path} onChange={updateValue} />}</div><aside className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm h-fit sticky top-28"><h2 className="text-xl font-bold mb-4 flex gap-2"><Eye className="h-5 w-5" /> Prévia da seção</h2><div className="rounded-2xl border bg-slate-50 p-5 max-h-[760px] overflow-auto"><Preview content={content} section={activeSection} /></div></aside></div>}</section></main>;
}

function JsonEditor({ value, path, onChange }: { value: JsonValue; path: string; onChange: (path: string, value: JsonValue) => void }) {
  if (Array.isArray(value)) {
    return <div className="space-y-5">{value.map((item, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="mb-3 text-sm font-black text-emerald-700">Item {index + 1}</div><JsonEditor value={item} path={path ? `${path}.${index}` : String(index)} onChange={onChange} /></div>)}</div>;
  }
  if (value && typeof value === 'object') {
    return <div className="space-y-4">{Object.entries(value).map(([key, child]) => <div key={key}><div className="mb-2 text-sm font-bold text-slate-700">{labelFor(key)}</div><JsonEditor value={child} path={path ? `${path}.${key}` : key} onChange={onChange} /></div>)}</div>;
  }
  if (typeof value === 'boolean') return <select value={value ? 'true' : 'false'} onChange={(event) => onChange(path, event.target.value === 'true')} className="w-full rounded-xl border bg-white p-3"><option value="true">Sim</option><option value="false">Não</option></select>;
  if (typeof value === 'number') return <input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} className="w-full rounded-xl border bg-white p-3" />;
  const text = value === null ? '' : String(value);
  if (isLongText(text)) return <textarea value={text} onChange={(event) => onChange(path, event.target.value)} className="w-full min-h-24 rounded-xl border bg-white p-3" />;
  return <input value={text} onChange={(event) => onChange(path, event.target.value)} className="w-full rounded-xl border bg-white p-3" />;
}

function Preview({ content, section }: { content: any; section: string }) {
  if (section === 'brand') return <div className="space-y-3"><h3 className="text-2xl font-black text-teal-700">{content.brand.name}</h3><p>WhatsApp: {content.brand.whatsapp}</p><p>Telefone: {content.brand.phoneDisplay}</p><p>E-mail: {content.brand.email}</p><p>{content.brand.city}</p><p>{content.brand.coverage}</p>{content.brand.logoDataUrl && <img src={content.brand.logoDataUrl} className="h-20 w-20 object-contain rounded-xl bg-white border" />}</div>;
  if (section === 'hero') return <div className="space-y-4 text-center"><p className="inline-block rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">{content.hero.badge}</p><h3 className="text-4xl font-black">{content.hero.titleStart} <span className="text-emerald-700">{content.hero.titleHighlight}</span> {content.hero.titleEnd}</h3><p>{content.hero.subtitle}</p><p className="text-slate-500">{content.hero.supportText}</p><span className="block rounded-xl bg-emerald-600 text-white py-3 font-bold">{content.hero.primaryButton}</span></div>;
  if (section === 'metrics') return <div className="grid grid-cols-2 gap-4 text-center">{content.metrics.map((m: any) => <div key={m.label}><b className="text-3xl">{Number(m.value).toLocaleString('pt-BR')}{m.suffix}</b><p>{m.label}</p></div>)}</div>;
  if (section === 'operators') return <div className="text-center space-y-4"><p className="uppercase text-xs font-bold text-slate-500">{content.operators.title}</p><div className="flex flex-wrap gap-3 justify-center font-black text-slate-400">{content.operators.items.map((item: string) => <span key={item}>{item}</span>)}</div></div>;
  if (section === 'quote') return <div className="space-y-4"><p className="uppercase text-xs font-black text-teal-700">{content.quote.kicker}</p><h3 className="text-4xl font-black">{content.quote.title}</h3><p>{content.quote.description}</p><div className="bg-white border rounded-2xl p-4"><h4 className="text-xl font-black">{content.quote.formTitle}</h4><p>{content.quote.formSubtitle}</p><span className="mt-3 block bg-emerald-500 text-white text-center rounded-xl py-3 font-bold">{content.quote.button}</span></div></div>;
  if (section === 'plans') return <div className="text-center space-y-4"><p className="uppercase text-xs font-black text-teal-700">{content.plans.kicker}</p><h3 className="text-3xl font-black">{content.plans.title}</h3><p>{content.plans.description}</p>{content.plans.items.map((p: any) => <div key={p.title} className="bg-white border rounded-xl p-3 text-left"><b>{p.title}</b><p className="text-sm text-slate-500">{p.description}</p></div>)}</div>;
  if (section === 'coverages') return <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 text-center"><p className="uppercase text-xs text-emerald-400 font-bold">{content.coverages.kicker}</p><h3 className="text-3xl font-black">{content.coverages.title}</h3><p>{content.coverages.description}</p><div className="grid grid-cols-2 gap-2 text-left">{content.coverages.items.map((i: any) => <div key={i.title} className="bg-white/10 rounded-xl p-3"><b>{i.title}</b><p className="text-xs text-white/60">{i.description}</p></div>)}</div></div>;
  if (section === 'differentials') return <div className="space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{content.differentials.kicker}</p><h3 className="text-3xl font-black">{content.differentials.title}</h3><p>{content.differentials.description}</p>{content.differentials.items.map((i: any) => <div key={i.title} className="bg-white border rounded-xl p-3"><b>{i.title}</b><p className="text-sm text-slate-500">{i.description}</p></div>)}</div>;
  if (section === 'process') return <div className="bg-teal-700 text-white rounded-2xl p-5 text-center space-y-4"><p className="uppercase text-xs text-teal-200 font-bold">{content.process.kicker}</p><h3 className="text-3xl font-black">{content.process.title}</h3><p>{content.process.description}</p>{content.process.steps.map((s: any) => <div key={s.number} className="bg-white/10 rounded-xl p-3"><b>{s.number} - {s.title}</b><p className="text-sm text-white/70">{s.description}</p></div>)}</div>;
  if (section === 'testimonials') return <div className="space-y-4 text-center"><p className="uppercase text-xs text-teal-700 font-bold">{content.testimonials.kicker}</p><h3 className="text-3xl font-black">{content.testimonials.title}</h3><p>{content.testimonials.description}</p>{content.testimonials.items.map((t: any) => <div key={t.name} className="bg-white border rounded-xl p-4 text-left"><p className="text-emerald-600">★★★★★</p><p className="text-sm">{t.text}</p><b>{t.name}</b><p className="text-xs text-slate-500">{t.role}</p></div>)}</div>;
  if (section === 'faq') return <div className="text-center space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{content.faq.kicker}</p><h3 className="text-3xl font-black">{content.faq.title}</h3><p>{content.faq.description}</p>{content.faq.items.map((f: any) => <div key={f.question} className="bg-white border rounded-xl p-3 text-left"><b>{f.question}</b><p className="text-sm text-slate-500 mt-2">{f.answer}</p></div>)}</div>;
  if (section === 'finalCta') return <div className="text-center space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{content.finalCta.kicker}</p><h3 className="text-4xl font-black">{content.finalCta.title}</h3><p>{content.finalCta.description}</p><span className="block bg-emerald-500 text-white rounded-xl py-3 font-bold">{content.finalCta.button}</span></div>;
  if (section === 'footer') return <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4"><h3 className="text-2xl font-black text-teal-400">{content.brand.name}</h3><p>{content.footer.description}</p><div className="grid grid-cols-2 gap-4"><div><b>{content.footer.navigationTitle}</b></div><div><b>{content.footer.contactTitle}</b><p>{content.brand.email}<br />{content.brand.city}<br />{content.brand.coverage}</p></div></div></div>;
  return <div className="space-y-3"><p className="text-sm text-slate-500">Prévia resumida. Use os campos à esquerda para editar.</p><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(content[section] || content, null, 2)}</pre></div>;
}
