import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Code2, Eye, Home, Lock, MessageCircle, Save, ShieldCheck, Upload } from 'lucide-react';

const HOME_PATH = 'artifacts/planos-saude/src/pages/Home.tsx';
const STORAGE_KEY = 'rota-seguros-admin-edits-v2';

type Status = 'idle' | 'loading' | 'ready' | 'saving' | 'error';
type Tab = 'identidade' | 'hero' | 'metricas' | 'operadoras' | 'cotacao' | 'planos' | 'coberturas' | 'diferenciais' | 'processo' | 'depoimentos' | 'faq' | 'cta' | 'rodape' | 'todos' | 'avancado';
type TextEdit = { id: string; section: Tab; original: string; value: string };

const tabs: { id: Tab; label: string }[] = [
  { id: 'identidade', label: 'Identidade' },
  { id: 'hero', label: 'Seção principal' },
  { id: 'metricas', label: 'Métricas' },
  { id: 'operadoras', label: 'Operadoras' },
  { id: 'cotacao', label: 'Cotação' },
  { id: 'planos', label: 'Planos' },
  { id: 'coberturas', label: 'Coberturas' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'processo', label: 'Como funciona' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'CTA Final' },
  { id: 'rodape', label: 'Rodapé' },
  { id: 'todos', label: 'Todos os textos' },
  { id: 'avancado', label: 'Código' },
];

const defaultTexts: TextEdit[] = [
  { id: 'metricas-1', section: 'metricas', original: 'Clientes Atendidos', value: 'Clientes Atendidos' },
  { id: 'metricas-2', section: 'metricas', original: 'Taxa de Satisfação', value: 'Taxa de Satisfação' },
  { id: 'metricas-3', section: 'metricas', original: 'Anos no Mercado', value: 'Anos no Mercado' },
  { id: 'metricas-4', section: 'metricas', original: 'Operadoras Parceiras', value: 'Operadoras Parceiras' },
  { id: 'operadoras-1', section: 'operadoras', original: 'Trabalhamos com as maiores operadoras de saúde do Brasil', value: 'Trabalhamos com as maiores operadoras de saúde do Brasil' },
  { id: 'operadoras-2', section: 'operadoras', original: 'Unimed', value: 'Unimed' },
  { id: 'operadoras-3', section: 'operadoras', original: 'Amil', value: 'Amil' },
  { id: 'operadoras-4', section: 'operadoras', original: 'SulAmérica', value: 'SulAmérica' },
  { id: 'operadoras-5', section: 'operadoras', original: 'Bradesco Saúde', value: 'Bradesco Saúde' },
  { id: 'operadoras-6', section: 'operadoras', original: 'NotreDame Intermédica', value: 'NotreDame Intermédica' },
  { id: 'cotacao-1', section: 'cotacao', original: 'Cotação Gratuita', value: 'Cotação Gratuita' },
  { id: 'cotacao-2', section: 'cotacao', original: 'Receba sua cotação em minutos pelo WhatsApp.', value: 'Receba sua cotação em minutos pelo WhatsApp.' },
  { id: 'cotacao-3', section: 'cotacao', original: 'Preencha os campos ao lado e clique no botão. Sua mensagem chegará já formatada para o nosso especialista — sem precisar digitar nada.', value: 'Preencha os campos ao lado e clique no botão. Sua mensagem chegará já formatada para o nosso especialista — sem precisar digitar nada.' },
  { id: 'cotacao-4', section: 'cotacao', original: 'Consultoria 100% gratuita e sem compromisso', value: 'Consultoria 100% gratuita e sem compromisso' },
  { id: 'cotacao-5', section: 'cotacao', original: 'Respondemos em até 5 minutos em horário comercial', value: 'Respondemos em até 5 minutos em horário comercial' },
  { id: 'cotacao-6', section: 'cotacao', original: 'Solicite sua cotação', value: 'Solicite sua cotação' },
  { id: 'cotacao-7', section: 'cotacao', original: 'Preencha e envie — simples assim.', value: 'Preencha e envie — simples assim.' },
  { id: 'cotacao-8', section: 'cotacao', original: 'Enviar Cotação pelo WhatsApp', value: 'Enviar Cotação pelo WhatsApp' },
  { id: 'planos-1', section: 'planos', original: 'Nossos Planos', value: 'Nossos Planos' },
  { id: 'planos-2', section: 'planos', original: 'Uma solução para cada momento de vida', value: 'Uma solução para cada momento de vida' },
  { id: 'planos-3', section: 'planos', original: 'Seja para você, sua família ou sua empresa — encontramos as melhores opções com as melhores condições do mercado. Consulte-nos gratuitamente pelo WhatsApp.', value: 'Seja para você, sua família ou sua empresa — encontramos as melhores opções com as melhores condições do mercado. Consulte-nos gratuitamente pelo WhatsApp.' },
  { id: 'planos-4', section: 'planos', original: 'Plano Individual', value: 'Plano Individual' },
  { id: 'planos-5', section: 'planos', original: 'Plano Familiar', value: 'Plano Familiar' },
  { id: 'planos-6', section: 'planos', original: 'Plano Empresarial', value: 'Plano Empresarial' },
  { id: 'coberturas-1', section: 'coberturas', original: 'Coberturas', value: 'Coberturas' },
  { id: 'coberturas-2', section: 'coberturas', original: 'O que os planos podem cobrir', value: 'O que os planos podem cobrir' },
  { id: 'coberturas-3', section: 'coberturas', original: 'De acordo com a ANS, os planos de saúde oferecem cobertura obrigatória para diversos procedimentos. Conheça os principais:', value: 'De acordo com a ANS, os planos de saúde oferecem cobertura obrigatória para diversos procedimentos. Conheça os principais:' },
  { id: 'coberturas-4', section: 'coberturas', original: 'Consultas Médicas', value: 'Consultas Médicas' },
  { id: 'coberturas-5', section: 'coberturas', original: 'Exames e Diagnósticos', value: 'Exames e Diagnósticos' },
  { id: 'coberturas-6', section: 'coberturas', original: 'Internação Hospitalar', value: 'Internação Hospitalar' },
  { id: 'diferenciais-1', section: 'diferenciais', original: 'Por que a Rota Seguros', value: 'Por que a Rota Seguros' },
  { id: 'diferenciais-2', section: 'diferenciais', original: 'Mais do que um corretor — um parceiro de saúde.', value: 'Mais do que um corretor — um parceiro de saúde.' },
  { id: 'diferenciais-3', section: 'diferenciais', original: 'Não somos representantes de uma única operadora. Trabalhamos com as principais do mercado e buscamos, de forma independente, o plano que realmente faz sentido para o seu perfil e orçamento.', value: 'Não somos representantes de uma única operadora. Trabalhamos com as principais do mercado e buscamos, de forma independente, o plano que realmente faz sentido para o seu perfil e orçamento.' },
  { id: 'diferenciais-4', section: 'diferenciais', original: 'Consultoria Imparcial e Gratuita', value: 'Consultoria Imparcial e Gratuita' },
  { id: 'diferenciais-5', section: 'diferenciais', original: 'Atendimento Rápido pelo WhatsApp', value: 'Atendimento Rápido pelo WhatsApp' },
  { id: 'diferenciais-6', section: 'diferenciais', original: 'Suporte Completo Pós-Contratação', value: 'Suporte Completo Pós-Contratação' },
  { id: 'processo-1', section: 'processo', original: 'Processo Simples', value: 'Processo Simples' },
  { id: 'processo-2', section: 'processo', original: 'Como funciona a nossa consultoria', value: 'Como funciona a nossa consultoria' },
  { id: 'processo-3', section: 'processo', original: 'Da primeira mensagem no WhatsApp até o seu plano ativo — simples assim.', value: 'Da primeira mensagem no WhatsApp até o seu plano ativo — simples assim.' },
  { id: 'processo-4', section: 'processo', original: 'Fale com a Gente', value: 'Fale com a Gente' },
  { id: 'processo-5', section: 'processo', original: 'Análise do Perfil', value: 'Análise do Perfil' },
  { id: 'processo-6', section: 'processo', original: 'Cotação Personalizada', value: 'Cotação Personalizada' },
  { id: 'processo-7', section: 'processo', original: 'Plano Ativo', value: 'Plano Ativo' },
  { id: 'processo-8', section: 'processo', original: 'Começar Agora pelo WhatsApp', value: 'Começar Agora pelo WhatsApp' },
  { id: 'depoimentos-1', section: 'depoimentos', original: 'Depoimentos', value: 'Depoimentos' },
  { id: 'depoimentos-2', section: 'depoimentos', original: 'O que nossos clientes dizem', value: 'O que nossos clientes dizem' },
  { id: 'depoimentos-3', section: 'depoimentos', original: 'A satisfação de quem confia a saúde da família e da empresa à Rota Seguros.', value: 'A satisfação de quem confia a saúde da família e da empresa à Rota Seguros.' },
  { id: 'depoimentos-4', section: 'depoimentos', original: 'Carlos Eduardo Silva', value: 'Carlos Eduardo Silva' },
  { id: 'depoimentos-5', section: 'depoimentos', original: 'Mariana Costa', value: 'Mariana Costa' },
  { id: 'depoimentos-6', section: 'depoimentos', original: 'Roberto Alves', value: 'Roberto Alves' },
  { id: 'faq-1', section: 'faq', original: 'Dúvidas', value: 'Dúvidas' },
  { id: 'faq-2', section: 'faq', original: 'Perguntas Frequentes', value: 'Perguntas Frequentes' },
  { id: 'faq-3', section: 'faq', original: 'Respondemos as principais dúvidas sobre planos de saúde e nosso processo de consultoria.', value: 'Respondemos as principais dúvidas sobre planos de saúde e nosso processo de consultoria.' },
  { id: 'faq-4', section: 'faq', original: 'A consultoria da Rota Seguros tem algum custo?', value: 'A consultoria da Rota Seguros tem algum custo?' },
  { id: 'faq-5', section: 'faq', original: 'Como funciona o atendimento pelo WhatsApp?', value: 'Como funciona o atendimento pelo WhatsApp?' },
  { id: 'faq-6', section: 'faq', original: 'Quais documentos são necessários para contratar?', value: 'Quais documentos são necessários para contratar?' },
  { id: 'cta-1', section: 'cta', original: 'Pronto para começar?', value: 'Pronto para começar?' },
  { id: 'cta-2', section: 'cta', original: 'Cuide da sua saúde com quem entende do assunto.', value: 'Cuide da sua saúde com quem entende do assunto.' },
  { id: 'cta-3', section: 'cta', original: 'Fale agora com um especialista da Rota Seguros e receba uma cotação personalizada, sem compromisso, em poucos minutos pelo WhatsApp.', value: 'Fale agora com um especialista da Rota Seguros e receba uma cotação personalizada, sem compromisso, em poucos minutos pelo WhatsApp.' },
  { id: 'cta-4', section: 'cta', original: 'Solicitar Cotação Gratuita', value: 'Solicitar Cotação Gratuita' },
  { id: 'rodape-1', section: 'rodape', original: 'Corretora de planos de saúde especializada em encontrar a melhor solução para você, sua família e sua empresa. Consultoria gratuita e sem compromisso.', value: 'Corretora de planos de saúde especializada em encontrar a melhor solução para você, sua família e sua empresa. Consultoria gratuita e sem compromisso.' },
  { id: 'rodape-2', section: 'rodape', original: 'Navegação', value: 'Navegação' },
  { id: 'rodape-3', section: 'rodape', original: 'Contato', value: 'Contato' },
  { id: 'rodape-4', section: 'rodape', original: 'Belo Horizonte, MG', value: 'Belo Horizonte, MG' },
  { id: 'rodape-5', section: 'rodape', original: 'Atendemos todo o Brasil', value: 'Atendemos todo o Brasil' },
];

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {} as Record<string, string>;
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
};

function applyStored(items: TextEdit[]) {
  const stored = readStored();
  return items.map((item) => ({ ...item, value: stored[item.id] || item.value }));
}

function persist(items: TextEdit[]) {
  const data = Object.fromEntries(items.map((item) => [item.id, item.value]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

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

function buildTextEdits(source: string) {
  const stored = readStored();
  return defaultTexts.map((item) => ({ ...item, value: stored[item.id] || (source.includes(item.original) ? item.original : item.value) }));
}

function FieldList({ items, onChange }: { items: TextEdit[]; onChange: (id: string, value: string) => void }) {
  return <div className="space-y-4">{items.map((item, index) => <label key={item.id} className="block rounded-2xl border border-slate-200 p-4 bg-slate-50"><span className="text-xs font-bold text-slate-500">Texto {index + 1}</span><textarea value={item.value} onChange={(e) => onChange(item.id, e.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3 min-h-20" />{item.value !== item.original && <span className="mt-2 block text-xs text-emerald-700 font-semibold">Alterado</span>}</label>)}</div>;
}

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin-password') || '');
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin-auth') === 'true');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('identidade');
  const [textEdits, setTextEdits] = useState<TextEdit[]>(() => applyStored(defaultTexts));
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
    setTextEdits(buildTextEdits(content));
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
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Erro ao autenticar.'); }
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
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Erro ao carregar conteúdo.'); }
  }

  function updateTextEdit(id: string, value: string) {
    setTextEdits((items) => {
      const next = items.map((item) => item.id === id ? { ...item, value } : item);
      persist(next);
      return next;
    });
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
    persist(textEdits);
    try {
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(HOME_PATH)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ content: activeTab === 'avancado' ? source : updatedSource }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível salvar.');
      const savedContent = activeTab === 'avancado' ? source : updatedSource;
      setSource(savedContent);
      setStatus('ready');
      setMessage(`Salvo com sucesso. Commit: ${data.commit || 'criado'}. A Vercel deve iniciar novo deploy.`);
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Erro ao salvar.'); }
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
    return <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 p-8 shadow-2xl"><div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6"><Lock className="h-7 w-7" /></div><h1 className="text-3xl font-bold mb-2">Admin do site</h1><p className="text-slate-300 mb-6">Página secreta para editar conteúdo, logo e publicar com commit no GitHub.</p><label className="block text-sm font-semibold mb-2">Senha secreta</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-emerald-400" placeholder="Digite a senha" /><button type="submit" className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-bold hover:bg-emerald-400 transition">Entrar</button>{message && <p className="mt-4 text-sm text-amber-200">{message}</p>}</form></main>;
  }

  return <main className="min-h-screen bg-slate-100 text-slate-950"><header className="bg-white border-b border-slate-200 sticky top-0 z-20"><div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-emerald-700 font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Painel protegido</p><h1 className="text-2xl font-black">Editar site completo</h1></div><div className="flex gap-2"><a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold flex items-center gap-2"><Home className="h-4 w-4" /> Ver site</a><button onClick={save} disabled={!source || status === 'saving'} className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-bold flex items-center gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> Salvar e publicar</button></div></div></header><section className="max-w-7xl mx-auto px-4 py-6">{message && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2"><AlertCircle className="h-5 w-5 shrink-0" /> <span>{message}</span></div>}<div className="mb-5 flex gap-2 overflow-x-auto pb-2">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2 font-bold border ${activeTab === tab.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'}`}>{tab.label}</button>)}</div><div className="grid lg:grid-cols-[1fr_540px] gap-6"><div className="space-y-5">{activeTab === 'identidade' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-4">Identidade do site</h2><div className="grid md:grid-cols-2 gap-4"><label className="block"><span className="text-sm font-semibold">Nome da marca</span><input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">WhatsApp com DDI e DDD</span><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label></div><label className="mt-4 block"><span className="text-sm font-semibold flex items-center gap-2"><Upload className="h-4 w-4" /> Logo</span><div className="mt-1 rounded-xl border border-dashed p-4 bg-slate-50"><input type="file" accept="image/*" onChange={uploadLogo} /><p className="text-xs text-slate-500 mt-2">Use PNG, JPG ou SVG pequeno. A imagem será salva no commit.</p>{logoDataUrl && <img src={logoDataUrl} alt="Prévia" className="mt-3 h-16 w-16 object-contain rounded-xl bg-white border" />}</div></label></div>}{activeTab === 'hero' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-4">Seção principal</h2><div className="space-y-4"><label className="block"><span className="text-sm font-semibold">Selo</span><input value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><div className="grid md:grid-cols-3 gap-4"><label className="block"><span className="text-sm font-semibold">Título início</span><input value={heroTitleStart} onChange={(e) => setHeroTitleStart(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">Título destaque</span><input value={heroTitleHighlight} onChange={(e) => setHeroTitleHighlight(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">Título final</span><input value={heroTitleEnd} onChange={(e) => setHeroTitleEnd(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label></div><label className="block"><span className="text-sm font-semibold">Subtítulo</span><textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="mt-1 w-full rounded-xl border p-3 min-h-24" /></label><label className="block"><span className="text-sm font-semibold">Texto de apoio</span><input value={heroSupport} onChange={(e) => setHeroSupport(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><div className="grid md:grid-cols-2 gap-4"><label className="block"><span className="text-sm font-semibold">Botão principal</span><input value={primaryCta} onChange={(e) => setPrimaryCta(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="block"><span className="text-sm font-semibold">Botão secundário</span><input value={secondaryCta} onChange={(e) => setSecondaryCta(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label></div></div></div>}{activeTab !== 'identidade' && activeTab !== 'hero' && activeTab !== 'avancado' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2">Textos de {sectionTitle(activeTab)}</h2><p className="text-sm text-slate-500 mb-5">Digite e veja a prévia mudar na hora. Depois clique em Salvar e publicar.</p><FieldList items={visibleTexts} onChange={updateTextEdit} /></div>}{activeTab === 'avancado' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Code2 className="h-5 w-5" /> Editor avançado do Home.tsx</h2><textarea value={source} onChange={(e) => setSource(e.target.value)} className="w-full min-h-[680px] rounded-xl border p-4 font-mono text-xs" /></div>}</div><aside className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm h-fit sticky top-28"><h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="h-5 w-5" /> Prévia visual</h2><div className="rounded-2xl border bg-slate-50 p-5 overflow-hidden">{activeTab === 'identidade' && <div className="space-y-4"><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-teal-700 text-white flex items-center justify-center font-black">{brandName.slice(0, 1)}</div><h3 className="text-2xl font-black text-teal-700">{brandName}</h3></div><p className="text-sm text-slate-600">WhatsApp principal: {whatsapp}</p>{logoDataUrl && <img src={logoDataUrl} alt="Logo" className="h-20 w-20 object-contain bg-white rounded-xl border" />}</div>}{activeTab === 'hero' && <div className="space-y-4 text-center"><p className="inline-block rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">{heroBadge}</p><h3 className="text-4xl font-black leading-tight">{heroTitleStart} <span className="text-emerald-700">{heroTitleHighlight}</span> {heroTitleEnd}</h3><p className="text-slate-600">{heroSubtitle}</p><p className="text-sm text-slate-500">{heroSupport}</p><span className="block rounded-xl bg-emerald-600 text-white px-4 py-3 font-bold">{primaryCta}</span><span className="block rounded-xl border bg-white px-4 py-3 font-semibold">{secondaryCta}</span></div>}{activeTab === 'metricas' && <div className="grid grid-cols-2 gap-4 text-center"><div><strong className="text-2xl">12.000+</strong><p>{getText('metricas-1','')}</p></div><div><strong className="text-2xl">98%</strong><p>{getText('metricas-2','')}</p></div><div><strong className="text-2xl">15+</strong><p>{getText('metricas-3','')}</p></div><div><strong className="text-2xl">22+</strong><p>{getText('metricas-4','')}</p></div></div>}{activeTab === 'operadoras' && <div className="space-y-4 text-center"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{getText('operadoras-1','')}</p><div className="flex flex-wrap gap-3 justify-center text-lg font-black text-slate-400">{['operadoras-2','operadoras-3','operadoras-4','operadoras-5','operadoras-6'].map(id => <span key={id}>{getText(id,'')}</span>)}</div></div>}{activeTab === 'cotacao' && <div className="grid gap-4"><p className="text-xs font-black tracking-widest text-teal-700 uppercase">{getText('cotacao-1','')}</p><h3 className="text-4xl font-black leading-tight">{getText('cotacao-2','')}</h3><p className="text-slate-600">{getText('cotacao-3','')}</p><div className="rounded-2xl bg-white border p-4 shadow-sm"><h4 className="text-xl font-black">{getText('cotacao-6','')}</h4><p className="text-sm text-slate-500 mb-4">{getText('cotacao-7','')}</p><span className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white px-4 py-3 font-bold"><MessageCircle className="h-4 w-4" />{getText('cotacao-8','')}</span></div></div>}{activeTab === 'planos' && <div className="space-y-4 text-center"><p className="text-xs font-black tracking-widest text-teal-700 uppercase">{getText('planos-1','')}</p><h3 className="text-3xl font-black leading-tight">{getText('planos-2','')}</h3><p className="text-slate-600">{getText('planos-3','')}</p><div className="grid gap-3 text-left"><div className="rounded-2xl bg-white border p-4"><h4 className="font-black text-lg">{getText('planos-4','')}</h4></div><div className="rounded-2xl bg-white border-2 border-emerald-500 p-4"><h4 className="font-black text-lg">{getText('planos-5','')}</h4></div><div className="rounded-2xl bg-white border p-4"><h4 className="font-black text-lg">{getText('planos-6','')}</h4></div></div></div>}{activeTab === 'coberturas' && <div className="space-y-4 text-center bg-slate-900 text-white rounded-2xl p-5"><p className="text-xs font-black tracking-widest text-emerald-400 uppercase">{getText('coberturas-1','')}</p><h3 className="text-3xl font-black leading-tight">{getText('coberturas-2','')}</h3><p className="text-slate-300">{getText('coberturas-3','')}</p><div className="grid grid-cols-2 gap-3 text-left"><div className="rounded-xl bg-white/10 p-3">{getText('coberturas-4','')}</div><div className="rounded-xl bg-white/10 p-3">{getText('coberturas-5','')}</div><div className="rounded-xl bg-white/10 p-3">{getText('coberturas-6','')}</div></div></div>}{activeTab === 'diferenciais' && <div className="space-y-4"><p className="text-xs font-black tracking-widest text-teal-700 uppercase">{getText('diferenciais-1','')}</p><h3 className="text-3xl font-black leading-tight">{getText('diferenciais-2','')}</h3><p className="text-slate-600">{getText('diferenciais-3','')}</p><div className="space-y-3"><div className="rounded-xl bg-white border p-3 font-bold">{getText('diferenciais-4','')}</div><div className="rounded-xl bg-white border p-3 font-bold">{getText('diferenciais-5','')}</div><div className="rounded-xl bg-white border p-3 font-bold">{getText('diferenciais-6','')}</div></div></div>}{activeTab === 'processo' && <div className="space-y-4 text-center bg-teal-700 text-white rounded-2xl p-5"><p className="uppercase tracking-widest text-xs font-bold text-teal-200">{getText('processo-1','')}</p><h3 className="text-3xl font-black">{getText('processo-2','')}</h3><p className="text-teal-100">{getText('processo-3','')}</p><div className="grid grid-cols-2 gap-3"><span>{getText('processo-4','')}</span><span>{getText('processo-5','')}</span><span>{getText('processo-6','')}</span><span>{getText('processo-7','')}</span></div><span className="block rounded-xl bg-emerald-500 py-3 font-bold">{getText('processo-8','')}</span></div>}{activeTab === 'depoimentos' && <div className="space-y-4 text-center"><p className="text-xs font-bold uppercase text-teal-700">{getText('depoimentos-1','')}</p><h3 className="text-3xl font-black">{getText('depoimentos-2','')}</h3><p>{getText('depoimentos-3','')}</p><div className="grid gap-3 text-left"><div className="rounded-xl bg-white border p-3">★★★★★<br />{getText('depoimentos-4','')}</div><div className="rounded-xl bg-white border p-3">★★★★★<br />{getText('depoimentos-5','')}</div><div className="rounded-xl bg-white border p-3">★★★★★<br />{getText('depoimentos-6','')}</div></div></div>}{activeTab === 'faq' && <div className="space-y-4 text-center"><p className="text-xs font-bold uppercase text-teal-700">{getText('faq-1','')}</p><h3 className="text-3xl font-black">{getText('faq-2','')}</h3><p>{getText('faq-3','')}</p><div className="space-y-2 text-left"><div className="rounded-xl bg-white border p-3 font-bold">{getText('faq-4','')}</div><div className="rounded-xl bg-white border p-3 font-bold">{getText('faq-5','')}</div><div className="rounded-xl bg-white border p-3 font-bold">{getText('faq-6','')}</div></div></div>}{activeTab === 'cta' && <div className="space-y-4 text-center"><p className="text-xs font-bold uppercase text-teal-700">{getText('cta-1','')}</p><h3 className="text-4xl font-black">{getText('cta-2','')}</h3><p>{getText('cta-3','')}</p><span className="block bg-emerald-500 text-white rounded-xl py-3 font-bold">{getText('cta-4','')}</span></div>}{activeTab === 'rodape' && <div className="space-y-4 bg-slate-900 text-white rounded-2xl p-5"><h3 className="text-2xl font-black text-teal-400">{brandName}</h3><p className="text-slate-300">{getText('rodape-1','')}</p><div className="grid grid-cols-2 gap-4"><div><h4 className="font-bold">{getText('rodape-2','')}</h4><p>Planos de Saúde<br />Coberturas<br />Diferenciais</p></div><div><h4 className="font-bold">{getText('rodape-3','')}</h4><p>{getText('rodape-4','')}<br />{getText('rodape-5','')}</p></div></div></div>}{activeTab === 'todos' && <div className="space-y-3 max-h-[620px] overflow-auto">{visibleTexts.map((item) => <div key={item.id} className="rounded-xl bg-white border p-3"><p className="text-xs font-bold text-slate-400">{sectionTitle(item.section)}</p><p className="text-sm text-slate-700">{item.value}</p></div>)}</div>}{activeTab === 'avancado' && <p className="text-sm text-slate-600">Prévia visual desativada no modo código.</p>}</div>{changedTexts.length > 0 && <p className="mt-4 text-xs text-emerald-700 font-bold">{changedTexts.length} texto(s) alterado(s). O painel manterá estes textos para não confundir o usuário após salvar.</p>}<button onClick={() => loadHome()} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2 font-semibold">Recarregar arquivo</button></aside></div></section></main>;
}
