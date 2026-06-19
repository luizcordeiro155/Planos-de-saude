import React, { useState } from 'react';
import { HeartPulse, MessageCircle, Menu, X, CheckCircle2, Star, Phone, Mail, MapPin, ChevronRight, Shield, Users, ThumbsUp, Award, Building2, Stethoscope, Activity, Baby, Briefcase, Zap, Smile, FileText, Clock, Send } from 'lucide-react';
import siteContent from '@/content/siteContent.json';

const content = siteContent as any;

function whatsappUrl(message = 'Olá! Gostaria de conhecer os planos de saúde.') {
  return `https://wa.me/${content.brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

function buildQuoteMessage(nome: string, cidade: string, tipo: string) {
  return [
    'Olá! Gostaria de uma cotação de plano de saúde.',
    nome ? `Nome: ${nome}` : '',
    cidade ? `Cidade: ${cidade}` : '',
    tipo ? `Tipo de plano: ${tipo}` : '',
  ].filter(Boolean).join('\n');
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center shadow-sm overflow-hidden">
        {content.brand.logoDataUrl ? <img src={content.brand.logoDataUrl} alt={content.brand.name} className="h-full w-full object-contain" /> : <HeartPulse className="h-6 w-6" />}
      </div>
      <span className="font-display font-extrabold text-xl text-primary">{content.brand.name}</span>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipo, setTipo] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const quoteUrl = whatsappUrl(buildQuoteMessage(nome, cidade, tipo));

  const navLinks = [
    ['#cotacao', content.nav[0]],
    ['#planos', content.nav[1]],
    ['#coberturas', content.nav[2]],
    ['#diferenciais', content.nav[3]],
    ['#como-funciona', content.nav[4]],
    ['#depoimentos', content.nav[5]],
    ['#faq', content.nav[6]],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <a href="#inicio"><Logo /></a>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
            {navLinks.map(([href, label], index) => <a key={href} href={href} className={index === 0 ? 'text-secondary border border-secondary/30 rounded-full px-4 py-2' : 'hover:text-primary'}>{label}</a>)}
          </nav>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 bg-secondary text-white px-5 py-3 rounded-full font-bold shadow-sm hover:shadow-lg transition"><MessageCircle className="h-5 w-5" />Falar com Especialista</a>
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="lg:hidden bg-white border-t p-4 flex flex-col gap-3">{navLinks.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="font-bold py-2">{label}</a>)}</div>}
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden py-28 md:py-36 bg-gradient-to-b from-white to-primary/5">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-5xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-bold mb-8"><Shield className="h-4 w-4" />{content.hero.badge}</p>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight tracking-tight mb-6">{content.hero.titleStart} <span className="text-primary">{content.hero.titleHighlight}</span> {content.hero.titleEnd}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">{content.hero.subtitle}</p>
            <p className="text-muted-foreground/80 mb-10">{content.hero.supportText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:-translate-y-1 transition inline-flex items-center justify-center gap-2"><MessageCircle />{content.hero.primaryButton}</a>
              <a href="#planos" className="bg-white border border-border px-8 py-4 rounded-xl font-bold text-lg hover:border-primary transition inline-flex items-center justify-center gap-2">{content.hero.secondaryButton}<ChevronRight /></a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary/5 border-y border-border">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.metrics.map((metric: any, index: number) => {
              const icons = [Users, ThumbsUp, Award, Shield]; const Icon = icons[index] || Award;
              return <div key={metric.label}><div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Icon /></div><div className="text-4xl font-display font-extrabold">{Number(metric.value).toLocaleString('pt-BR')}{metric.suffix}</div><p className="text-muted-foreground font-medium">{metric.label}</p></div>;
            })}
          </div>
        </section>

        <section className="py-12 bg-white overflow-hidden">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">{content.operators.title}</p>
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-5 px-4 text-2xl font-display font-extrabold text-slate-300">
            {content.operators.items.map((item: string) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section id="cotacao" className="py-28 bg-gradient-to-br from-primary/5 to-white">
          <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{content.quote.kicker}</p>
              <h2 className="text-5xl md:text-6xl font-display font-extrabold leading-tight mb-8">{content.quote.title}</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{content.quote.description}</p>
              <ul className="space-y-3">{content.quote.benefits.map((b: string) => <li key={b} className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-secondary" />{b}</li>)}</ul>
            </div>
            <div className="bg-white border border-border rounded-3xl p-8 shadow-2xl">
              <h3 className="text-3xl font-display font-extrabold mb-2">{content.quote.formTitle}</h3>
              <p className="text-muted-foreground mb-8">{content.quote.formSubtitle}</p>
              <div className="space-y-5">
                <label className="block font-bold text-sm">{content.quote.nameLabel}<input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={content.quote.namePlaceholder} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-4 outline-none focus:border-primary" /></label>
                <label className="block font-bold text-sm">{content.quote.cityLabel}<input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder={content.quote.cityPlaceholder} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-4 outline-none focus:border-primary" /></label>
                <div><p className="font-bold text-sm mb-2">{content.quote.typeLabel}</p><div className="grid grid-cols-3 gap-2">{content.quote.types.map((t: string) => <button key={t} onClick={() => setTipo(t)} className={`rounded-xl border p-3 text-sm font-bold ${tipo === t ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}>{t}</button>)}</div></div>
                <a href={quoteUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-secondary text-white rounded-xl py-4 font-bold text-lg"><Send className="h-5 w-5" />{content.quote.button}</a>
                <p className="text-xs text-center text-muted-foreground">{content.quote.note}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="planos" className="py-28 bg-white">
          <SectionHeader kicker={content.plans.kicker} title={content.plans.title} description={content.plans.description} />
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6 mt-14">
            {content.plans.items.map((plan: any) => <CardBox key={plan.title} highlight={plan.badge}><div className="flex justify-between items-start mb-4"><h3 className="text-2xl font-display font-extrabold">{plan.title}</h3>{plan.badge && <span className="bg-secondary text-white text-xs rounded-full px-3 py-1 font-bold">{plan.badge}</span>}</div><p className="text-muted-foreground mb-6">{plan.description}</p><ul className="space-y-2 mb-6">{plan.features.map((f: string) => <li key={f} className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-secondary" />{f}</li>)}</ul><a href={whatsappUrl(`Olá! Quero cotar: ${plan.title}`)} className="block text-center bg-primary text-white rounded-xl py-3 font-bold">{plan.button}</a></CardBox>)}
          </div>
        </section>

        <section id="coberturas" className="py-28 bg-slate-950 text-white">
          <SectionHeader dark kicker={content.coverages.kicker} title={content.coverages.title} description={content.coverages.description} />
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6 mt-14">
            {content.coverages.items.map((item: any, index: number) => { const icons = [Stethoscope, Activity, Building2, Baby, Zap, HeartPulse, Shield, Users, FileText]; const Icon = icons[index] || Shield; return <div key={item.title} className="rounded-2xl bg-white/5 border border-white/10 p-6"><div className="h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6"><Icon /></div><h3 className="text-xl font-bold mb-3">{item.title}</h3><p className="text-white/60 text-sm leading-relaxed">{item.description}</p></div>; })}
          </div>
          <div className="container mx-auto px-4 text-center mt-14"><p className="text-white/60 mb-6">{content.coverages.note}</p><a href={whatsappUrl()} className="inline-flex items-center gap-2 bg-secondary text-white rounded-xl px-8 py-4 font-bold"><MessageCircle />{content.coverages.button}</a></div>
        </section>

        <section id="diferenciais" className="py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div><p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{content.differentials.kicker}</p><h2 className="text-5xl font-display font-extrabold mb-6">{content.differentials.title}</h2><p className="text-lg text-muted-foreground mb-10">{content.differentials.description}</p><div className="space-y-8">{content.differentials.items.map((item: any, index: number) => { const icons = [Briefcase, Clock, Smile, Award]; const Icon = icons[index] || Award; return <div key={item.title} className="flex gap-5"><div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon /></div><div><h3 className="text-xl font-bold mb-2">{item.title}</h3><p className="text-muted-foreground">{item.description}</p></div></div>; })}</div></div>
            <div className="rounded-3xl bg-primary/10 border border-primary/10 p-8 relative"><div className="space-y-4">{content.differentials.stats.map((item: any) => <div key={item.label} className="flex justify-between bg-white/70 rounded-xl px-5 py-4 shadow-sm"><span>{item.label}</span><b className="text-xl text-primary">{item.value}</b></div>)}</div><div className="mt-6 bg-white rounded-2xl p-4 shadow-xl flex gap-3 items-center"><Star className="text-secondary fill-secondary" /><div><b>{content.differentials.ratingTitle}</b><p className="text-sm text-muted-foreground">{content.differentials.ratingSubtitle}</p></div></div></div>
          </div>
        </section>

        <section id="como-funciona" className="py-28 bg-primary text-white">
          <SectionHeader dark kicker={content.process.kicker} title={content.process.title} description={content.process.description} />
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-4 gap-8 mt-16 text-center">{content.process.steps.map((step: any) => <div key={step.number}><div className="mx-auto h-20 w-20 rounded-2xl border border-white/20 bg-white/10 flex flex-col items-center justify-center mb-6"><MessageCircle /><span className="text-xs font-bold text-white/60">{step.number}</span></div><h3 className="text-xl font-bold mb-3">{step.title}</h3><p className="text-white/60 text-sm">{step.description}</p></div>)}</div>
          <div className="text-center mt-16"><a href={whatsappUrl()} className="inline-flex items-center gap-2 bg-secondary text-white rounded-xl px-9 py-4 font-bold text-lg"><MessageCircle />{content.process.button}</a></div>
        </section>

        <section id="depoimentos" className="py-28 bg-background">
          <SectionHeader kicker={content.testimonials.kicker} title={content.testimonials.title} description={content.testimonials.description} />
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6 mt-14">{content.testimonials.items.map((item: any) => <div key={item.name} className="bg-white border border-border rounded-2xl p-7 shadow-sm"><div className="flex gap-1 text-secondary mb-5">{Array.from({ length: Number(item.stars) || 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="text-sm leading-relaxed mb-6">{item.text}</p><div className="border-t pt-5 flex gap-3 items-center"><div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{item.name?.[0]}</div><div><b>{item.name}</b><p className="text-xs text-muted-foreground">{item.role}</p></div></div></div>)}</div>
        </section>

        <section id="faq" className="py-28 bg-white border-t border-border">
          <SectionHeader kicker={content.faq.kicker} title={content.faq.title} description={content.faq.description} />
          <div className="container mx-auto px-4 md:px-6 max-w-4xl mt-14 space-y-3">{content.faq.items.map((item: any, index: number) => <button key={item.question} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className={`w-full text-left rounded-xl border p-5 ${openFaq === index ? 'border-primary' : 'border-border'}`}><div className="flex justify-between gap-4 font-bold text-lg"><span>{item.question}</span><ChevronRight className={openFaq === index ? 'rotate-90 transition' : 'transition'} /></div>{openFaq === index && <p className="mt-4 text-muted-foreground leading-relaxed">{item.answer}</p>}</button>)}<div className="text-center pt-10"><p className="text-muted-foreground mb-3">{content.faq.footerText}</p><a href={whatsappUrl()} className="font-bold text-primary inline-flex items-center gap-2"><MessageCircle />{content.faq.button}<ChevronRight /></a></div></div>
        </section>

        <section className="py-28 bg-background text-center">
          <div className="container mx-auto px-4 max-w-4xl"><p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{content.finalCta.kicker}</p><h2 className="text-5xl md:text-6xl font-display font-extrabold mb-8">{content.finalCta.title}</h2><p className="text-xl text-muted-foreground mb-10">{content.finalCta.description}</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><a href={whatsappUrl()} className="bg-secondary text-white rounded-xl px-9 py-4 font-bold text-lg inline-flex items-center justify-center gap-2"><MessageCircle />{content.finalCta.button}</a><a href={`tel:${content.brand.phoneDisplay}`} className="bg-white border rounded-xl px-9 py-4 font-bold text-lg inline-flex items-center justify-center gap-2"><Phone />{content.brand.phoneDisplay}</a></div></div>
        </section>
      </main>

      <footer className="bg-slate-950 text-white py-20">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-12">
          <div><Logo /><p className="mt-6 text-white/60 leading-relaxed">{content.footer.description}</p><p className="mt-8 uppercase text-xs tracking-widest text-white/40">{content.footer.regulatoryLabel} <span className="border border-white/20 rounded-full px-3 py-1 ml-2">{content.footer.regulatoryValue}</span></p></div>
          <div><h3 className="font-bold text-xl mb-6">{content.footer.navigationTitle}</h3><ul className="space-y-3 text-white/60">{navLinks.slice(1).map(([href, label]) => <li key={href}><a href={href} className="hover:text-white">› {label}</a></li>)}</ul></div>
          <div><h3 className="font-bold text-xl mb-6">{content.footer.contactTitle}</h3><ul className="space-y-4 text-white/60"><li className="flex gap-3"><MessageCircle className="text-primary" />WhatsApp: {content.brand.phoneDisplay}</li><li className="flex gap-3"><Phone className="text-primary" />{content.brand.phoneDisplay}</li><li className="flex gap-3"><Mail className="text-primary" />{content.brand.email}</li><li className="flex gap-3"><MapPin className="text-primary" />{content.brand.city}<br />{content.brand.coverage}</li></ul></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-white/40"><p>{content.footer.copyright}</p><p>{content.footer.bottomText}</p></div>
      </footer>
    </div>
  );
}

function SectionHeader({ kicker, title, description, dark = false }: { kicker: string; title: string; description: string; dark?: boolean }) {
  return <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl"><p className={`text-sm font-bold uppercase tracking-widest mb-4 ${dark ? 'text-white/60' : 'text-primary'}`}>{kicker}</p><h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">{title}</h2><p className={`text-lg leading-relaxed ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>{description}</p></div>;
}

function CardBox({ children, highlight }: { children: React.ReactNode; highlight?: string }) {
  return <div className={`rounded-3xl border p-7 bg-white shadow-sm ${highlight ? 'border-secondary ring-2 ring-secondary/10' : 'border-border'}`}>{children}</div>;
}
