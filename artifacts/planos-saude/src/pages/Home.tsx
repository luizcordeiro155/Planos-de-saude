import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import {
  Shield, HeartPulse, Stethoscope, CheckCircle2, MessageCircle, Star,
  Phone, MapPin, Mail, ArrowRight, Menu, X, Users, Activity, Building2,
  Baby, Briefcase, Zap, Clock, Award, ThumbsUp, ChevronRight, Lock,
  FileText, Smile, UserCheck, Send
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const WHATSAPP_BASE = "https://wa.me/553193659875";
const WHATSAPP_URL = `${WHATSAPP_BASE}?text=Olá!%20Gostaria%20de%20conhecer%20os%20planos%20de%20saúde.`;

function buildWhatsAppUrl(nome: string, cidade: string, tipo: string, vidas: string): string {
  const tipoLabel = tipo === "individual" ? "Individual" : tipo === "familiar" ? "Familiar" : tipo === "empresarial" ? "Empresarial" : "";
  const lines = [
    "Olá! Gostaria de uma cotação de plano de saúde.",
    nome ? `*Nome:* ${nome}` : "",
    cidade ? `*Cidade:* ${cidade}` : "",
    tipoLabel ? `*Tipo de Plano:* ${tipoLabel}` : "",
    vidas && tipo !== "individual" ? `*Quantidade de Vidas:* ${vidas}` : "",
  ].filter(Boolean);
  const message = lines.join("\n");
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(value);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</span>;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipo, setTipo] = useState('');
  const [vidas, setVidas] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const heroY = useTransform(scrollYProgress, [0, 0.4], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#cotacao", label: "Cotação Rápida", highlight: true },
    { href: "#planos", label: "Planos" },
    { href: "#coberturas", label: "Coberturas" },
    { href: "#beneficios", label: "Diferenciais" },
    { href: "#como-funciona", label: "Como Funciona" },
    { href: "#depoimentos", label: "Depoimentos" },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden text-foreground">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-primary">Rota Seguros</span>
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              link.highlight ? (
                <a key={link.href} href={link.href} className="text-sm font-semibold text-secondary border border-secondary/40 px-3 py-1.5 rounded-full hover:bg-secondary/10 transition-all flex items-center gap-1.5">
                  <Send className="h-3 w-3" />
                  {link.label}
                </a>
              ) : (
                <a key={link.href} href={link.href} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                  {link.label}
                </a>
              )
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-nav-whatsapp"
              className="bg-secondary text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com Especialista
            </a>
          </nav>

          <button className="md:hidden text-foreground p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-background pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-5 text-lg font-medium">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`py-2 border-b border-border transition-colors flex items-center gap-2 ${link.highlight ? 'text-secondary font-semibold' : 'text-foreground/80 hover:text-primary'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.highlight && <Send className="h-4 w-4" />}
                  {link.label}
                </a>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-secondary text-white px-5 py-4 rounded-xl flex justify-center items-center gap-2 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5" />
                Falar com Especialista
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-[15%] -right-[10%] w-[55%] h-[65%] rounded-full bg-primary/10 blur-[140px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 70, 0] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", delay: 3 }}
            className="absolute -bottom-[5%] -left-[10%] w-[45%] h-[55%] rounded-full bg-secondary/10 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[40%] rounded-full bg-primary/5 blur-[100px]"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20">
              <Shield className="h-4 w-4" />
              Corretora de Saúde Especializada - Belo Horizonte, MG
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-display font-extrabold leading-[1.05] mb-6 text-foreground">
              O plano de saúde{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">certo para você</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-primary/10 rounded origin-left -z-0"
                />
              </span>{" "}
              sem complicação.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
              Somos especialistas em planos de saúde individuais, familiares e empresariais. Consultoria gratuita, imparcial e com as melhores operadoras do mercado.
            </motion.p>

            <motion.p variants={fadeUp} className="text-base text-muted-foreground/70 mb-10 max-w-xl mx-auto">
              Atendemos por WhatsApp rápido, sem burocracia e sem compromisso.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-hero-cta"
                className="w-full sm:w-auto bg-secondary text-white px-9 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-1 shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                Fazer Cotação Gratuita
              </a>
              <a
                href="#planos"
                data-testid="link-hero-plans"
                className="w-full sm:w-auto bg-card border border-border text-foreground px-9 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-accent transition-all hover:border-primary/30"
              >
                Conhecer os Planos
                <ArrowRight className="h-5 w-5" />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {["Consultoria 100% gratuita", "Sem compromisso", "Resposta em minutos", "Regulamentado pela ANS"].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 border-y border-border bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Clientes Atendidos", value: 12000, suffix: "+", icon: Users },
              { label: "Taxa de Satisfação", value: 98, suffix: "%", icon: ThumbsUp },
              { label: "Anos no Mercado", value: 15, suffix: "+", icon: Award },
              { label: "Operadoras Parceiras", value: 22, suffix: "+", icon: Shield },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
                data-testid={`stat-${i}`}
              >
                <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER TICKER ── */}
      <section className="py-14 overflow-hidden bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            Trabalhamos com as maiores operadoras de saúde do Brasil
          </p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex gap-16 items-center whitespace-nowrap px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          >
            {["Unimed", "Amil", "SulAmérica", "Bradesco Saúde", "NotreDame Intermédica", "Hapvida", "Porto Seguro Saúde", "Prevent Sênior",
              "Unimed", "Amil", "SulAmérica", "Bradesco Saúde", "NotreDame Intermédica", "Hapvida", "Porto Seguro Saúde", "Prevent Sênior"].map((partner, i) => (
              <span key={i} className="text-xl font-display font-bold text-muted-foreground/30 hover:text-primary transition-colors cursor-default select-none">
                {partner}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE FORM ── */}
      <section id="cotacao" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/5 pointer-events-none" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Cotação Gratuita</p>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 leading-tight">
                  Receba sua cotação em minutos pelo WhatsApp.
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Preencha os campos ao lado e clique no botão. Sua mensagem chegará já formatada para o nosso especialista sem precisar digitar nada.
                </p>
                <ul className="space-y-3">
                  {[
                    "Consultoria 100% gratuita e sem compromisso",
                    "Respondemos em até 5 minutos em horário comercial",
                    "Comparamos todas as operadoras para você",
                    "Sem burocracia, tudo pelo WhatsApp",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <Card className="p-8 border border-border shadow-xl bg-card relative overflow-hidden">
                  <motion.div
                    animate={{ x: [0, 60, 0], y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"
                  />
                  <AnimatePresence mode="wait">
                    {!formSubmitted ? (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 className="text-2xl font-display font-bold mb-2">Solicite sua cotação</h3>
                        <p className="text-muted-foreground text-sm mb-7">Preencha e envie simples assim.</p>
                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="form-nome">Seu nome completo</label>
                            <input
                              id="form-nome"
                              data-testid="input-nome"
                              type="text"
                              placeholder="Ex: João da Silva"
                              value={nome}
                              onChange={e => setNome(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="form-cidade">Cidade</label>
                            <input
                              id="form-cidade"
                              data-testid="input-cidade"
                              type="text"
                              placeholder="Ex: Belo Horizonte, MG"
                              value={cidade}
                              onChange={e => setCidade(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Tipo de plano</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { value: "individual", label: "Individual", icon: UserCheck },
                                { value: "familiar", label: "Familiar", icon: Baby },
                                { value: "empresarial", label: "Empresarial", icon: Briefcase },
                              ].map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  data-testid={`button-tipo-${opt.value}`}
                                  onClick={() => { setTipo(opt.value); if (opt.value === "individual") setVidas(""); }}
                                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${tipo === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
                                >
                                  <opt.icon className="h-5 w-5" />
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <AnimatePresence>
                            {tipo && tipo !== "individual" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="form-vidas">Quantidade de vidas</label>
                                <select
                                  id="form-vidas"
                                  data-testid="select-vidas"
                                  value={vidas}
                                  onChange={e => setVidas(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                                >
                                  <option value="">Selecione...</option>
                                  {tipo === "familiar" && (
                                    <>
                                      <option value="2 vidas (titular + 1 dependente)">2 vidas (titular + 1)</option>
                                      <option value="3 vidas (titular + 2 dependentes)">3 vidas (titular + 2)</option>
                                      <option value="4 vidas (titular + 3 dependentes)">4 vidas (titular + 3)</option>
                                      <option value="5 ou mais vidas">5 ou mais vidas</option>
                                    </>
                                  )}
                                  {tipo === "empresarial" && (
                                    <>
                                      <option value="2 a 5 vidas">2 a 5 vidas</option>
                                      <option value="6 a 10 vidas">6 a 10 vidas</option>
                                      <option value="11 a 29 vidas">11 a 29 vidas</option>
                                      <option value="30 a 99 vidas">30 a 99 vidas</option>
                                      <option value="100 ou mais vidas">100 ou mais vidas</option>
                                    </>
                                  )}
                                </select>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <a
                            href={buildWhatsAppUrl(nome, cidade, tipo, vidas)}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="button-form-submit"
                            onClick={() => { if (nome || cidade || tipo) setFormSubmitted(true); }}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all ${nome && tipo ? 'bg-secondary text-white hover:bg-secondary/90 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-0.5' : 'bg-secondary/60 text-white cursor-pointer'}`}
                          >
                            <Send className="h-4 w-4" />
                            Enviar Cotação pelo WhatsApp
                          </a>
                          <p className="text-xs text-muted-foreground text-center">
                            Ao clicar, você será direcionado ao WhatsApp com sua mensagem já preenchida.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 text-center flex flex-col items-center gap-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center"
                        >
                          <CheckCircle2 className="h-10 w-10 text-secondary" />
                        </motion.div>
                        <h3 className="text-2xl font-display font-bold">Mensagem enviada!</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                          Você foi direcionado ao WhatsApp. Nossa equipe responderá em breve. Obrigado, <strong>{nome || "cliente"}</strong>!
                        </p>
                        <button
                          onClick={() => { setFormSubmitted(false); setNome(''); setCidade(''); setTipo(''); setVidas(''); }}
                          className="mt-2 text-sm text-primary font-semibold hover:underline"
                        >
                          Fazer nova cotação
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="planos" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Nossos Planos</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">
              Uma solução para cada momento de vida
            </h2>
            <p className="text-lg text-muted-foreground">
              Seja para você, sua família ou sua empresa encontramos as melhores opções com as melhores condições do mercado. Consulte-nos gratuitamente pelo WhatsApp.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: UserCheck,
                title: "Plano Individual",
                badge: null,
                desc: "A proteção ideal para quem busca um plano com ampla cobertura, rede credenciada de qualidade e atendimento rápido.",
                features: [
                  "Consultas médicas e exames",
                  "Cobertura hospitalar completa",
                  "Acomodação em enfermaria ou apartamento",
                  "Cobertura regional ou nacional",
                  "Telemedicina 24 horas",
                  "Opções com e sem coparticipação",
                ],
                cta: "Cotar Plano Individual",
                whatsappUrl: `${WHATSAPP_BASE}?text=${encodeURIComponent("Oie, gostaria de conhecer os planos individuais de saúde disponíveis.")}`
              },
              {
                icon: Baby,
                title: "Plano Familiar",
                badge: "Mais Buscado",
                desc: "Proteção completa para toda a família com benefícios exclusivos para crianças, gestantes e idosos.",
                features: [
                  "Cobertura para titular e dependentes",
                  "Atendimento pediátrico prioritário",
                  "Acompanhamento pré-natal completo",
                  "Programas de saúde preventiva",
                  "Desconto em farmácias parceiras",
                  "Portabilidade de carências facilitada",
                ],
                cta: "Cotar Plano Familiar",
                whatsappUrl: `${WHATSAPP_BASE}?text=${encodeURIComponent("Oie, gostaria de conhecer os planos familiares de saúde disponíveis.")}`
              },
              {
                icon: Briefcase,
                title: "Plano Empresarial",
                badge: null,
                desc: "Planos corporativos acessíveis para MEIs, microempresas e grandes empresas. Valorize sua equipe com saúde de qualidade.",
                features: [
                  "A partir de 2 vidas (MEI aceito)",
                  "Gestão simplificada pela empresa",
                  "Isenção de carências (sujeito a análise)",
                  "Coparticipação opcional",
                  "Benefício fiscal para a empresa",
                  "Ampla rede credenciada em todo o Brasil",
                ],
                cta: "Cotar Plano Empresarial",
                whatsappUrl: `${WHATSAPP_BASE}?text=${encodeURIComponent("Oie, gostaria de conhecer os planos empresariais de saúde disponíveis.")}`
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                data-testid={`card-plan-${i}`}
              >
                <Card className={`relative h-full flex flex-col p-8 border group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl ${plan.badge ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${plan.badge ? 'bg-primary/20 text-primary' : 'bg-accent text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    <plan.icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-2xl font-display font-bold mb-3">{plan.title}</h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{plan.desc}</p>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`button-plan-cta-${i}`}
                    className={`w-full py-3.5 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5 ${plan.badge ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md' : 'bg-accent text-foreground hover:bg-primary hover:text-primary-foreground'}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {plan.cta}
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-10"
          >
            Todos os valores são personalizados de acordo com o seu perfil. Consulte-nos sem compromisso.
          </motion.p>
        </div>
      </section>

      {/* ── COBERTURAS ── */}
      <section id="coberturas" className="py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Coberturas</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">
              O que os planos podem cobrir
            </h2>
            <p className="text-background/60 text-lg">
              De acordo com a ANS, os planos de saúde oferecem cobertura obrigatória para diversos procedimentos. Conheça os principais:
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Stethoscope, title: "Consultas Médicas", desc: "Acesso a médicos de todas as especialidades reconhecidas pelo CFM, incluindo clínico geral e especialistas." },
              { icon: Activity, title: "Exames e Diagnósticos", desc: "Exames laboratoriais, de imagem como ressonância, tomografia, raio-x e ultrassonografia." },
              { icon: Building2, title: "Internação Hospitalar", desc: "Cobertura para internações clínicas e cirúrgicas com acomodação em enfermaria ou apartamento." },
              { icon: Baby, title: "Parto e Maternidade", desc: "Cobertura para parto normal e cesáreo, além de acompanhamento de toda a gestação." },
              { icon: Zap, title: "Urgência e Emergência", desc: "Atendimento de emergência 24 horas, inclusive durante o período de carência." },
              { icon: HeartPulse, title: "Saúde Mental", desc: "Consultas com psiquiatra e psicólogo, além de tratamentos em CAPS e clínicas especializadas." },
              { icon: Shield, title: "Tratamento Oncológico", desc: "Quimioterapia, radioterapia, imunoterapia e demais tratamentos para câncer cobertos pela ANS." },
              { icon: UserCheck, title: "Fisioterapia e Reabilitação", desc: "Sessões de fisioterapia, fonoaudiologia e terapia ocupacional conforme indicação médica." },
              { icon: FileText, title: "Odontológico (Opcional)", desc: "Planos odontológicos individuais e coletivos que podem ser contratados em conjunto ou separado." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-background/5 border border-background/10 rounded-2xl p-6 hover:bg-background/10 hover:border-primary/30 transition-all group"
                data-testid={`card-coverage-${i}`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-background">{item.title}</h4>
                <p className="text-background/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <p className="text-background/50 text-sm mb-6">Tem dúvida sobre alguma cobertura específica? Nosso time esclarece tudo gratuitamente.</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-coverage-cta"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary/90 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-1"
            >
              <MessageCircle className="h-5 w-5" />
              Tirar dúvidas no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS / DIFFERENTIALS ── */}
      <section id="beneficios" className="py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Por que a Rota Seguros</p>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 leading-tight">
                Mais do que um corretor um parceiro de saúde.
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Não somos representantes de uma única operadora. Trabalhamos com as principais do mercado e buscamos, de forma independente, o plano que realmente faz sentido para o seu perfil e orçamento.
              </p>

              <div className="space-y-7">
                {[
                  { icon: Lock, title: "Consultoria Imparcial e Gratuita", desc: "Analisamos todas as opções do mercado sem viés de vendas. Nossa missão é encontrar o melhor custo-benefício para você." },
                  { icon: Clock, title: "Atendimento Rápido pelo WhatsApp", desc: "Sem filas de espera, sem ligações inconvenientes. Responda no seu tempo e receba sua cotação em poucos minutos." },
                  { icon: Smile, title: "Suporte Completo Pós-Contratação", desc: "Estamos aqui mesmo após a contratação: autorizações, reembolsos, dúvidas sobre a rede credenciada — conte conosco." },
                  { icon: Award, title: "Especialistas em Regulamentação ANS", desc: "Nossa equipe é altamente treinada nas regras da ANS e nas particularidades de cada operadora e produto." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors text-primary group-hover:text-primary-foreground">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-3xl bg-gradient-to-tr from-primary/20 via-secondary/10 to-primary/5 border border-primary/10 overflow-hidden shadow-2xl p-8 min-h-[460px] flex flex-col justify-between relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none"
                />
                <div className="relative z-10 space-y-4">
                  {[
                    { label: "Consultoria", value: "Gratuita", color: "text-secondary" },
                    { label: "Operadoras disponíveis", value: "22+", color: "text-primary" },
                    { label: "Tempo médio de resposta", value: "5 min", color: "text-secondary" },
                    { label: "Satisfação dos clientes", value: "98%", color: "text-primary" },
                    { label: "Anos de experiência", value: "15+", color: "text-secondary" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-sm font-medium text-foreground/70">{item.label}</span>
                      <span className={`font-display font-extrabold text-xl ${item.color}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-5 bg-card border border-border shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-secondary fill-secondary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Nota 4.9 / 5</div>
                  <div className="text-xs text-muted-foreground">Avaliação dos clientes</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="py-28 bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-white/5 pointer-events-none"
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Processo Simples</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">Como funciona a nossa consultoria</h2>
            <p className="text-white/60 text-lg">Da primeira mensagem no WhatsApp até o seu plano ativo — simples assim.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-px bg-white/10" />

            {[
              { num: "01", icon: MessageCircle, title: "Fale com a Gente", desc: "Mande uma mensagem no WhatsApp. Sem formulários complicados, sem espera." },
              { num: "02", icon: UserCheck, title: "Análise do Perfil", desc: "Entendemos suas necessidades, rotina, cidade e orçamento em uma conversa rápida." },
              { num: "03", icon: FileText, title: "Cotação Personalizada", desc: "Apresentamos as melhores opções com comparativo de preços e coberturas." },
              { num: "04", icon: CheckCircle2, title: "Plano Ativo", desc: "Cuidamos de toda a burocracia. Você recebe sua carteirinha e começa a usar." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 text-center"
                data-testid={`card-step-${i}`}
              >
                <div className="w-20 h-20 mx-auto bg-white/10 border border-white/20 text-white rounded-2xl flex flex-col items-center justify-center mb-6 shadow-lg">
                  <step.icon className="h-8 w-8 mb-1" />
                  <span className="text-xs font-bold text-white/60">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-how-cta"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-9 py-4 rounded-xl font-bold text-lg hover:bg-secondary/90 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:-translate-y-1"
            >
              <MessageCircle className="h-5 w-5" />
              Começar Agora pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="depoimentos" className="py-28">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Depoimentos</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">O que nossos clientes dizem</h2>
            <p className="text-lg text-muted-foreground">A satisfação de quem confia a saúde da família e da empresa à Rota Seguros.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Carlos Eduardo Silva", role: "Empresário — Belo Horizonte", text: "Reduzi em mais de 30% os custos com o plano da minha empresa sem perder qualidade na cobertura. O atendimento foi excepcional do início ao fim.", stars: 5 },
              { name: "Mariana Costa", role: "Professora — Contagem, MG", text: "Me ajudaram a encontrar o plano perfeito na chegada do meu bebê. Tiraram todas as minhas dúvidas sobre carência de parto com muita paciência e clareza.", stars: 5 },
              { name: "Roberto Alves", role: "Autônomo / MEI — Betim, MG", text: "Como MEI, achei que não conseguiria um plano bom. A Rota Seguros me mostrou opções que eu nem sabia que existiam. Processo todo pelo WhatsApp, super prático.", stars: 5 },
              { name: "Fernanda Rodrigues", role: "Gerente de RH — Nova Lima, MG", text: "Implantamos o plano corporativo para 40 funcionários em tempo recorde. Todo o processo foi conduzido com muita profissionalismo e clareza.", stars: 5 },
              { name: "Paulo Mendes", role: "Aposentado — Belo Horizonte", text: "Tinha um plano há anos e nunca soube que podia fazer portabilidade. A equipe me orientou e hoje tenho uma cobertura muito melhor pagando menos.", stars: 5 },
              { name: "Ana Luiza Pereira", role: "Dentista — Vespasiano, MG", text: "Indico a Rota Seguros para todos os meus pacientes e amigos. Atendimento rápido, honesto e resultado garantido. É de confiar mesmo.", stars: 5 },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                data-testid={`card-testimonial-${i}`}
              >
                <Card className="p-7 h-full bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
                  <div className="flex gap-1 mb-5 text-secondary">
                    {Array.from({ length: testimonial.stars }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-6 leading-relaxed text-sm">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 mt-auto pt-5 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 bg-card border-t border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Dúvidas</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">Perguntas Frequentes</h2>
            <p className="text-muted-foreground text-lg">Respondemos as principais dúvidas sobre planos de saúde e nosso processo de consultoria.</p>
          </motion.div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {[
              {
                q: "A consultoria da Rota Seguros tem algum custo?",
                a: "Não. Nossa consultoria é 100% gratuita. Somos remunerados pelas operadoras de saúde, o que nos permite oferecer todo o suporte sem nenhum custo para você."
              },
              {
                q: "Como funciona o atendimento pelo WhatsApp?",
                a: "É simples: você envia uma mensagem, nossa equipe responde em até 5 minutos em horário comercial. Fazemos uma análise do seu perfil, apresentamos as melhores opções e você decide sem pressão."
              },
              {
                q: "Quais documentos são necessários para contratar?",
                a: "Geralmente RG, CPF, comprovante de residência e, em alguns casos, cartão do SUS. Para planos empresariais, o CNPJ e documentos da empresa. Nossa equipe orienta cada caso de forma personalizada."
              },
              {
                q: "Posso aproveitar as carências do meu plano atual?",
                a: "Sim! Se você já possui um plano ativo há mais de 2 anos, pode solicitar a portabilidade de carências para a nova operadora. Isso significa trocar de plano sem cumprir novamente os prazos de carência."
              },
              {
                q: "MEI pode contratar plano de saúde empresarial?",
                a: "Sim! Após 6 meses de abertura do MEI, você pode contratar planos empresariais a partir de 2 vidas (titular + 1 dependente), com condições geralmente mais vantajosas que os planos individuais."
              },
              {
                q: "Qual a diferença entre plano com e sem coparticipação?",
                a: "No plano com coparticipação, você paga uma parte do valor de cada procedimento realizado (consulta, exame), o que reduz o valor da mensalidade. No plano sem coparticipação, você paga uma mensalidade fixa e não tem custo adicional por uso. A escolha ideal depende da frequência com que você utiliza o plano."
              },
              {
                q: "Em quanto tempo o plano fica ativo após a contratação?",
                a: "O prazo varia de acordo com a operadora e o tipo de plano, geralmente entre 1 e 15 dias úteis após a assinatura e aprovação da proposta. Nossa equipe acompanha todo o processo para garantir a ativação mais rápida possível."
              },
              {
                q: "Vocês atendem fora de Belo Horizonte?",
                a: "Sim! Atuamos em todo o Brasil. Como o atendimento é feito pelo WhatsApp, conseguimos ajudar clientes de qualquer cidade com planos locais, regionais ou nacionais de acordo com a necessidade de cada um."
              },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-6 data-[state=open]:border-primary/40 data-[state=open]:shadow-sm transition-all" data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary transition-colors py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">Não encontrou sua dúvida aqui?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-faq-cta"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              Pergunte diretamente no WhatsApp
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Pronto para começar?</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight">
              Cuide da sua saúde com quem entende do assunto.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-10">
              Fale agora com um especialista da Rota Seguros e receba uma cotação personalizada, sem compromisso, em poucos minutos pelo WhatsApp.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-final-cta"
                className="inline-flex items-center justify-center gap-3 bg-secondary text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-secondary/90 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(34,197,94,0.6)]"
              >
                <MessageCircle className="h-6 w-6" />
                Solicitar Cotação Gratuita
              </a>
              <a
                href="tel:+5531936598​75"
                data-testid="link-final-phone"
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-5 rounded-xl font-semibold text-lg hover:border-primary hover:text-primary transition-all"
              >
                <Phone className="h-5 w-5" />
                (31) 9365-9875
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-5 text-primary">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight">Rota Seguros</span>
              </div>
              <p className="text-background/60 max-w-sm mb-6 leading-relaxed text-sm">
                Corretora de planos de saúde especializada em encontrar a melhor solução para você, sua família e sua empresa. Consultoria gratuita e sem compromisso.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-background/40 uppercase tracking-widest">Regulamentado pela</span>
                <span className="border border-background/20 rounded-lg px-3 py-1 text-xs font-bold text-background/50">ANS</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-background/90">Navegação</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "#planos", label: "Planos de Saúde" },
                  { href: "#coberturas", label: "Coberturas" },
                  { href: "#beneficios", label: "Nossos Diferenciais" },
                  { href: "#como-funciona", label: "Como Funciona" },
                  { href: "#depoimentos", label: "Depoimentos" },
                  { href: "#faq", label: "Dúvidas Frequentes" },
                ].map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-background/50 hover:text-primary transition-colors flex items-center gap-1.5">
                      <ChevronRight className="h-3 w-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base mb-6 text-background/90">Contato</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-background/50 hover:text-secondary transition-colors">
                    <MessageCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    WhatsApp: (31) 9365-9875
                  </a>
                </li>
                <li className="flex items-start gap-3 text-background/50">
                  <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>(31) 9365-9875</span>
                </li>
                <li className="flex items-start gap-3 text-background/50">
                  <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>contato@rotaseguros.com.br</span>
                </li>
                <li className="flex items-start gap-3 text-background/50">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Belo Horizonte, MG<br />Atendemos todo o Brasil</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/30">
            <span>© {new Date().getFullYear()} Rota Seguros. Todos os direitos reservados.</span>
            <span>Corretora de Planos de Saúde - Belo Horizonte, MG</span>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 18 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-secondary/90 transition-colors group"
        data-testid="button-floating-whatsapp"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 bg-secondary rounded-full"
        />
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
          className="absolute inset-0 bg-secondary rounded-full"
        />
        <MessageCircle className="h-7 w-7 relative z-10 group-hover:scale-110 transition-transform" />
      </motion.a>
    </div>
  );
}
