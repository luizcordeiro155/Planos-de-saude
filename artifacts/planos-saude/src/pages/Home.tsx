import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Activity, Award, Baby, Briefcase, Building2, CheckCircle2, ChevronRight, FileText, HeartPulse, Mail, MapPin, Menu, MessageCircle, Phone, Send, Shield, Smile, Star, Stethoscope, ThumbsUp, Users, X, Zap, Clock } from 'lucide-react';
import siteContent from '@/content/siteContent.json';

const content = siteContent as any;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

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

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 75;
    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / total, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</span>;
}

function Logo() {
  return (
    <div className="flex items-center gap-3 group">
      <motion.div whileHover={{ scale: 1.08, rotate: -4 }} className="h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center shadow-sm overflow-hidden">
        {content.brand.logoDataUrl ? <img src={content.brand.logoDataUrl} alt={content.brand.name} className="h-full w-full object-contain" /> : <HeartPulse className="h-6 w-6" />}
      </motion.div>
      <span className="font-display font-extrabold text-xl text-primary tracking-tight">{content.brand.name}</span>
    </div>
  );
}

function SectionHeader({ kicker, title, description, dark = false }: { kicker: string; title: string; description: string; dark?: boolean }) {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-120px' }} className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
      <motion.p variants={fadeUp} className={`text-sm font-bold uppercase tracking-widest mb-4 ${dark ? 'text-white/60' : 'text-primary'}`}>{kicker}</motion.p>
      <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-extrabold mb-6 leading-tight">{title}</motion.h2>
      <motion.p variants={fadeUp} className={`text-lg leading-relaxed ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>{description}</motion.p>
    </motion.div>
  );
}

function FloatingBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div animate={{ scale: [1, 1.16, 1], x: [0, 58, 0], y: [0, -38, 0] }} transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse' }} className="absolute -top-[15%] -right-[12%] w-[55%] h-[65%] rounded-full bg-primary/10 blur-[140px]" />
      <motion.div animate={{ scale: [1, 1.22, 1], x: [0, -42, 0], y: [0, 70, 0] }} transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', delay: 2 }} className="absolute -bottom-[10%] -left-[10%] w-[45%] h-[55%] rounded-full bg-secondary/10 blur-[120px]" />
      <motion.div animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', delay: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[35%] rounded-full bg-primary/5 blur-[100px]" />
    </div>
  );
}

function MotionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -8, scale: 1.015 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipo, setTipo] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const heroY = useTransform(scrollYProgress, [0, 0.38], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const quoteUrl = whatsappUrl(buildQuoteMessage(nome, cidade, tipo));
  const navLinks = [
    ['#cotacao', content.nav[0], true],
    ['#planos', content.nav[1], false],
    ['#coberturas', content.nav[2], false],
    ['#diferenciais', content.nav[3], false],
    ['#como-funciona', content.nav[4], false],
    ['#depoimentos', content.nav[5], false],
    ['#faq', content.nav[6], false],
  ] as const;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden text-foreground">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-[60] origin-left" style={{ scaleX: scrollYProgress }} />

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <a href="#inicio"><Logo /></a>
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(([href, label, highlight]) => highlight ? <a key={href} href={href} className="text-sm font-semibold text-secondary border border-secondary/40 px-3 py-1.5 rounded-full hover:bg-secondary/10 transition-all flex items-center gap-1.5"><Send className="h-3 w-3" />{label}</a> : <a key={href} href={href} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">{label}</a>)}
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="bg-secondary text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-lg hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" />Falar com Especialista</a>
          </nav>
          <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -22 }} className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden">
            <div className="flex flex-col gap-5 text-lg font-medium">
              {navLinks.map(([href, label, highlight]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className={`py-2 border-b border-border flex items-center gap-2 ${highlight ? 'text-secondary font-bold' : 'text-foreground/80'}`}>{highlight && <Send className="h-4 w-4" />}{label}</a>)}
              <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="mt-4 bg-secondary text-white px-5 py-4 rounded-xl flex justify-center items-center gap-2 font-semibold"><MessageCircle />Falar com Especialista</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="inicio" className="relative pt-36 pb-24 md:pt-52 md:pb-40 overflow-hidden">
          <FloatingBlobs />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div style={{ y: heroY, opacity: heroOpacity }} initial="hidden" animate="show" variants={stagger} className="max-w-4xl mx-auto text-center">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20"><Shield className="h-4 w-4" />{content.hero.badge}</motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-display font-extrabold leading-[1.05] mb-6 text-foreground">
                {content.hero.titleStart} <span className="relative inline-block"><span className="relative z-10 text-primary">{content.hero.titleHighlight}</span><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }} className="absolute bottom-1 left-0 right-0 h-3 bg-primary/10 rounded origin-left -z-0" /></span> {content.hero.titleEnd}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">{content.hero.subtitle}</motion.p>
              <motion.p variants={fadeUp} className="text-base text-muted-foreground/70 mb-10 max-w-xl mx-auto">{content.hero.supportText}</motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-secondary text-white px-9 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-1 shadow-lg"><MessageCircle />{content.hero.primaryButton}</a>
                <a href="#planos" className="w-full sm:w-auto bg-card border border-border text-foreground px-9 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-accent transition-all hover:border-primary/30">{content.hero.secondaryButton}<ChevronRight /></a>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                {content.quote.benefits.slice(0, 4).map((item: string) => <span key={item} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-secondary" />{item}</span>)}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-card/50 border-y border-border">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.metrics.map((metric: any, index: number) => { const icons = [Users, ThumbsUp, Award, Shield]; const Icon = icons[index] || Award; return <MotionCard key={metric.label} className="text-center group"><div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors"><Icon className="h-7 w-7 text-primary group-hover:text-white" /></div><div className="font-display font-extrabold text-4xl mb-1"><AnimatedNumber value={Number(metric.value)} suffix={metric.suffix} /></div><div className="text-muted-foreground font-medium">{metric.label}</div></MotionCard>; })}
          </motion.div>
        </section>

        <section className="py-12 bg-background overflow-hidden border-b border-border">
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">{content.operators.title}</motion.p>
          <motion.div initial={{ x: 0 }} animate={{ x: ['0%', '-8%', '0%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-wrap justify-center gap-x-14 gap-y-5 px-4 text-2xl font-display font-extrabold text-muted-foreground/25">
            {content.operators.items.concat(content.operators.items.slice(0, 3)).map((item: string, index: number) => <span key={`${item}-${index}`}>{item}</span>)}
          </motion.div>
        </section>

        <section id="cotacao" className="py-28 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
          <FloatingBlobs />
          <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}>
              <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{content.quote.kicker}</motion.p>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-display font-extrabold leading-tight mb-8">{content.quote.title}</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8 leading-relaxed">{content.quote.description}</motion.p>
              <motion.ul variants={stagger} className="space-y-3">{content.quote.benefits.map((b: string) => <motion.li variants={fadeUp} key={b} className="flex items-center gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 text-secondary" />{b}</motion.li>)}</motion.ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }} className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
              <div className="relative z-10"><h3 className="text-3xl font-display font-extrabold mb-2">{content.quote.formTitle}</h3><p className="text-muted-foreground mb-8">{content.quote.formSubtitle}</p><div className="space-y-5"><label className="block font-bold text-sm">{content.quote.nameLabel}<input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={content.quote.namePlaceholder} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-4 outline-none focus:border-primary" /></label><label className="block font-bold text-sm">{content.quote.cityLabel}<input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder={content.quote.cityPlaceholder} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-4 outline-none focus:border-primary" /></label><div><p className="font-bold text-sm mb-2">{content.quote.typeLabel}</p><div className="grid grid-cols-3 gap-2">{content.quote.types.map((t: string) => <button key={t} onClick={() => setTipo(t)} className={`rounded-xl border p-3 text-sm font-bold transition-all ${tipo === t ? 'border-primary bg-primary/10 text-primary scale-[1.02]' : 'border-border hover:border-primary/30'}`}>{t}</button>)}</div></div><a href={quoteUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-secondary text-white rounded-xl py-4 font-bold text-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"><Send className="h-5 w-5" />{content.quote.button}</a><p className="text-xs text-center text-muted-foreground">{content.quote.note}</p></div></div>
            </motion.div>
          </div>
        </section>

        <section id="planos" className="py-28 bg-background">
          <SectionHeader kicker={content.plans.kicker} title={content.plans.title} description={content.plans.description} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6 mt-14">
            {content.plans.items.map((plan: any) => <MotionCard key={plan.title} className={`rounded-3xl border p-7 bg-card shadow-sm relative overflow-hidden ${plan.badge ? 'border-secondary ring-2 ring-secondary/10' : 'border-border'}`}><div className="flex justify-between items-start mb-4"><h3 className="text-2xl font-display font-extrabold">{plan.title}</h3>{plan.badge && <span className="bg-secondary text-white text-xs rounded-full px-3 py-1 font-bold">{plan.badge}</span>}</div><p className="text-muted-foreground mb-6">{plan.description}</p><ul className="space-y-2 mb-6">{plan.features.map((f: string) => <li key={f} className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-secondary" />{f}</li>)}</ul><a href={whatsappUrl(`Olá! Quero cotar: ${plan.title}`)} className="block text-center bg-primary text-white rounded-xl py-3 font-bold hover:bg-primary/90 transition">{plan.button}</a></MotionCard>)}
          </motion.div>
        </section>

        <section id="coberturas" className="py-28 bg-slate-950 text-white relative overflow-hidden">
          <motion.div animate={{ opacity: [0.3, 0.65, 0.3], scale: [1, 1.08, 1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute inset-x-0 top-0 mx-auto w-[70%] h-[40%] bg-primary/20 blur-[140px] rounded-full" />
          <SectionHeader dark kicker={content.coverages.kicker} title={content.coverages.title} description={content.coverages.description} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6 mt-14 relative z-10">
            {content.coverages.items.map((item: any, index: number) => { const icons = [Stethoscope, Activity, Building2, Baby, Zap, HeartPulse, Shield, Users, FileText]; const Icon = icons[index] || Shield; return <MotionCard key={item.title} className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"><div className="h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6"><Icon /></div><h3 className="text-xl font-bold mb-3">{item.title}</h3><p className="text-white/60 text-sm leading-relaxed">{item.description}</p></MotionCard>; })}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto px-4 text-center mt-14 relative z-10"><p className="text-white/60 mb-6">{content.coverages.note}</p><a href={whatsappUrl()} className="inline-flex items-center gap-2 bg-secondary text-white rounded-xl px-8 py-4 font-bold hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"><MessageCircle />{content.coverages.button}</a></motion.div>
        </section>

        <section id="diferenciais" className="py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}><motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{content.differentials.kicker}</motion.p><motion.h2 variants={fadeUp} className="text-5xl font-display font-extrabold mb-6 leading-tight">{content.differentials.title}</motion.h2><motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-10">{content.differentials.description}</motion.p><div className="space-y-8">{content.differentials.items.map((item: any, index: number) => { const icons = [Briefcase, Clock, Smile, Award]; const Icon = icons[index] || Award; return <motion.div variants={fadeUp} key={item.title} className="flex gap-5"><div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon /></div><div><h3 className="text-xl font-bold mb-2">{item.title}</h3><p className="text-muted-foreground">{item.description}</p></div></motion.div>; })}</div></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.92, x: 30 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }} className="rounded-3xl bg-primary/10 border border-primary/10 p-8 relative shadow-2xl"><div className="space-y-4">{content.differentials.stats.map((item: any) => <motion.div whileHover={{ x: 6 }} key={item.label} className="flex justify-between bg-white/70 rounded-xl px-5 py-4 shadow-sm"><span>{item.label}</span><b className="text-xl text-primary">{item.value}</b></motion.div>)}</div><motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mt-6 bg-white rounded-2xl p-4 shadow-xl flex gap-3 items-center"><Star className="text-secondary fill-secondary" /><div><b>{content.differentials.ratingTitle}</b><p className="text-sm text-muted-foreground">{content.differentials.ratingSubtitle}</p></div></motion.div></motion.div>
          </div>
        </section>

        <section id="como-funciona" className="py-28 bg-primary text-white relative overflow-hidden">
          <motion.div animate={{ x: ['-10%', '10%', '-10%'] }} transition={{ duration: 18, repeat: Infinity }} className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
          <SectionHeader dark kicker={content.process.kicker} title={content.process.title} description={content.process.description} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="container mx-auto px-4 md:px-6 grid md:grid-cols-4 gap-8 mt-16 text-center relative z-10">{content.process.steps.map((step: any) => <motion.div variants={fadeUp} key={step.number}><motion.div whileHover={{ scale: 1.08, rotate: 2 }} className="mx-auto h-20 w-20 rounded-2xl border border-white/20 bg-white/10 flex flex-col items-center justify-center mb-6"><MessageCircle /><span className="text-xs font-bold text-white/60">{step.number}</span></motion.div><h3 className="text-xl font-bold mb-3">{step.title}</h3><p className="text-white/60 text-sm">{step.description}</p></motion.div>)}</motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-16"><a href={whatsappUrl()} className="inline-flex items-center gap-2 bg-secondary text-white rounded-xl px-9 py-4 font-bold text-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"><MessageCircle />{content.process.button}</a></motion.div>
        </section>

        <section id="depoimentos" className="py-28 bg-background">
          <SectionHeader kicker={content.testimonials.kicker} title={content.testimonials.title} description={content.testimonials.description} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6 mt-14">{content.testimonials.items.map((item: any) => <MotionCard key={item.name} className="bg-card border border-border rounded-2xl p-7 shadow-sm"><div className="flex gap-1 text-secondary mb-5">{Array.from({ length: Number(item.stars) || 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="text-sm leading-relaxed mb-6">{item.text}</p><div className="border-t pt-5 flex gap-3 items-center"><div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{item.name?.[0]}</div><div><b>{item.name}</b><p className="text-xs text-muted-foreground">{item.role}</p></div></div></MotionCard>)}</motion.div>
        </section>

        <section id="faq" className="py-28 bg-white border-t border-border">
          <SectionHeader kicker={content.faq.kicker} title={content.faq.title} description={content.faq.description} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="container mx-auto px-4 md:px-6 max-w-4xl mt-14 space-y-3">{content.faq.items.map((item: any, index: number) => <motion.button variants={fadeUp} key={item.question} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className={`w-full text-left rounded-xl border p-5 transition-all ${openFaq === index ? 'border-primary shadow-lg' : 'border-border hover:border-primary/40'}`}><div className="flex justify-between gap-4 font-bold text-lg"><span>{item.question}</span><ChevronRight className={openFaq === index ? 'rotate-90 transition' : 'transition'} /></div><AnimatePresence>{openFaq === index && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 text-muted-foreground leading-relaxed overflow-hidden">{item.answer}</motion.p>}</AnimatePresence></motion.button>)}<motion.div variants={fadeUp} className="text-center pt-10"><p className="text-muted-foreground mb-3">{content.faq.footerText}</p><a href={whatsappUrl()} className="font-bold text-primary inline-flex items-center gap-2"><MessageCircle />{content.faq.button}<ChevronRight /></a></motion.div></motion.div>
        </section>

        <section className="py-28 bg-background text-center relative overflow-hidden">
          <FloatingBlobs />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="container mx-auto px-4 max-w-4xl relative z-10"><motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{content.finalCta.kicker}</motion.p><motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-display font-extrabold mb-8 leading-tight">{content.finalCta.title}</motion.h2><motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-10">{content.finalCta.description}</motion.p><motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center"><a href={whatsappUrl()} className="bg-secondary text-white rounded-xl px-9 py-4 font-bold text-lg inline-flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"><MessageCircle />{content.finalCta.button}</a><a href={`tel:${content.brand.phoneDisplay}`} className="bg-white border rounded-xl px-9 py-4 font-bold text-lg inline-flex items-center justify-center gap-2"><Phone />{content.brand.phoneDisplay}</a></motion.div></motion.div>
        </section>
      </main>

      <footer className="bg-slate-950 text-white py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-12">
          <motion.div variants={fadeUp}><Logo /><p className="mt-6 text-white/60 leading-relaxed">{content.footer.description}</p><p className="mt-8 uppercase text-xs tracking-widest text-white/40">{content.footer.regulatoryLabel} <span className="border border-white/20 rounded-full px-3 py-1 ml-2">{content.footer.regulatoryValue}</span></p></motion.div>
          <motion.div variants={fadeUp}><h3 className="font-bold text-xl mb-6">{content.footer.navigationTitle}</h3><ul className="space-y-3 text-white/60">{navLinks.slice(1).map(([href, label]) => <li key={href}><a href={href} className="hover:text-white">› {label}</a></li>)}</ul></motion.div>
          <motion.div variants={fadeUp}><h3 className="font-bold text-xl mb-6">{content.footer.contactTitle}</h3><ul className="space-y-4 text-white/60"><li className="flex gap-3"><MessageCircle className="text-primary" />WhatsApp: {content.brand.phoneDisplay}</li><li className="flex gap-3"><Phone className="text-primary" />{content.brand.phoneDisplay}</li><li className="flex gap-3"><Mail className="text-primary" />{content.brand.email}</li><li className="flex gap-3"><MapPin className="text-primary" />{content.brand.city}<br />{content.brand.coverage}</li></ul></motion.div>
        </motion.div>
        <div className="container mx-auto px-4 md:px-6 border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-white/40"><p>{content.footer.copyright}</p><p>{content.footer.bottomText}</p></div>
      </footer>
    </div>
  );
}
