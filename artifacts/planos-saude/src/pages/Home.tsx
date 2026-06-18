import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, HeartPulse, Stethoscope, ChevronDown, CheckCircle2, MessageCircle, Star, Phone, MapPin, Mail, ArrowRight, Menu, X, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const WHATSAPP_URL = "https://wa.me/553193659875?text=Olá!%20Gostaria%20de%20conhecer%20os%20planos%20de%20saúde.";

function AnimatedNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    let startTime: number | null = null;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count}{suffix}</span>;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden text-foreground">
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="font-display font-bold text-xl tracking-tight text-primary">Rota Seguros</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#planos" className="text-sm font-medium hover:text-primary transition-colors">Planos</a>
            <a href="#beneficios" className="text-sm font-medium hover:text-primary transition-colors">Benefícios</a>
            <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">Como Funciona</a>
            <a href="#depoimentos" className="text-sm font-medium hover:text-primary transition-colors">Depoimentos</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-secondary text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-secondary/90 transition-all hover:shadow-lg hover:-translate-y-0.5">
              <MessageCircle className="h-4 w-4" />
              Falar com Especialista
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-foreground p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-background pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              <a href="#planos" onClick={() => setMobileMenuOpen(false)}>Planos</a>
              <a href="#beneficios" onClick={() => setMobileMenuOpen(false)}>Benefícios</a>
              <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)}>Como Funciona</a>
              <a href="#depoimentos" onClick={() => setMobileMenuOpen(false)}>Depoimentos</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-secondary text-white px-5 py-3 rounded-xl flex justify-center items-center gap-2 mt-4">
                <MessageCircle className="h-5 w-5" />
                Falar com Especialista
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Meshes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-[10%] -right-[10%] w-[50%] h-[60%] rounded-full bg-primary/10 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            className="absolute bottom-[0%] -left-[10%] w-[40%] h-[50%] rounded-full bg-secondary/10 blur-[100px]"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            style={{ y: heroY, opacity }}
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <Shield className="h-4 w-4" />
              Proteção para você e sua família
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-foreground">
              Sua saúde nas mãos de quem <span className="text-primary">realmente entende</span>.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Encontramos o plano de saúde ideal para o seu perfil e bolso. Consultoria gratuita, rápida e sem complicação.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:-translate-y-1">
                <MessageCircle className="h-5 w-5" />
                Fazer Cotação Gratuita
              </a>
              <a href="#planos" className="w-full sm:w-auto bg-card border border-border text-foreground px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-accent transition-all">
                Conhecer Planos
                <ArrowRight className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Clientes Satisfeitos", value: 10000, suffix: "+", icon: Users },
              { label: "Índice de Aprovação", value: 98, suffix: "%", icon: Star },
              { label: "Anos de Experiência", value: 15, suffix: "+", icon: Activity },
              { label: "Operadoras Parceiras", value: 20, suffix: "+", icon: Shield },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trabalhamos com as melhores operadoras do Brasil</p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <motion.div 
            className="flex gap-16 items-center whitespace-nowrap px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            {["Unimed", "Amil", "SulAmérica", "Bradesco Saúde", "NotreDame", "Hapvida", "Unimed", "Amil", "SulAmérica", "Bradesco Saúde", "NotreDame", "Hapvida"].map((partner, i) => (
              <span key={i} className="text-2xl font-display font-bold text-muted-foreground/40 hover:text-primary transition-colors cursor-default">
                {partner}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-24 bg-accent/30 relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Planos para todas as necessidades</h2>
            <p className="text-lg text-muted-foreground">Oferecemos uma variedade de opções para garantir que você tenha a melhor cobertura possível, de acordo com o seu momento de vida.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Individual",
                desc: "Proteção completa para você, com foco em prevenção e atendimento rápido.",
                price: "A partir de R$ 149",
                features: ["Acomodação em enfermaria ou apartamento", "Cobertura regional ou nacional", "Telemedicina 24h", "Rede credenciada ampla"],
                popular: false
              },
              {
                title: "Familiar",
                desc: "Segurança para quem você mais ama, com benefícios estendidos e descontos progressivos.",
                price: "A partir de R$ 299",
                features: ["Inclusão de dependentes", "Programas de saúde preventiva", "Descontos em farmácias", "Atendimento pediátrico exclusivo"],
                popular: true
              },
              {
                title: "Empresarial",
                desc: "Planos corporativos que atraem e retêm talentos, com gestão simplificada.",
                price: "A partir de R$ 99/vida",
                features: ["A partir de 2 vidas (MEI aceito)", "Gestão de saúde populacional", "Coparticipação opcional", "Isenção de carência (consultar)"],
                popular: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className={`relative h-full flex flex-col p-8 backdrop-blur-sm bg-card/80 border overflow-hidden group hover:-translate-y-2 transition-all duration-300 ${plan.popular ? 'border-primary shadow-xl shadow-primary/10' : 'border-border'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MAIS BUSCADO
                    </div>
                  )}
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.title}</h3>
                  <p className="text-muted-foreground mb-6 h-16">{plan.desc}</p>
                  <div className="text-2xl font-bold text-primary mb-8">{plan.price}<span className="text-sm text-muted-foreground font-normal">/mês</span></div>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`w-full py-3 rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-2 ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-accent text-foreground hover:bg-accent/80'}`}>
                    Cotar {plan.title}
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Por que escolher a Rota Seguros?</h2>
              <p className="text-lg text-muted-foreground mb-10">Não vendemos apenas planos de saúde. Entregamos tranquilidade e suporte continuo. Nossa equipe está sempre pronta para ajudar você a navegar pelas complexidades da saúde suplementar.</p>
              
              <div className="space-y-8">
                {[
                  { icon: Shield, title: "Consultoria Imparcial", desc: "Avaliamos todas as opções do mercado para encontrar o plano que faz sentido para você, sem viés." },
                  { icon: HeartPulse, title: "Suporte Pós-Venda", desc: "Ajudamos com autorizações, reembolsos e dúvidas mesmo após a contratação." },
                  { icon: Stethoscope, title: "Especialistas em Saúde", desc: "Corretores altamente treinados nas regulamentações da ANS e coberturas." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square md:aspect-[4/5] rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 border border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center p-8">
                {/* Abstract Glassmorphism Design instead of an image */}
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full">
                  <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col justify-end transform -translate-y-4">
                     <HeartPulse className="h-8 w-8 text-primary mb-4" />
                     <div className="h-2 w-1/2 bg-primary/20 rounded mb-2"></div>
                     <div className="h-2 w-3/4 bg-primary/10 rounded"></div>
                  </div>
                  <div className="bg-primary/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 flex flex-col justify-end transform translate-y-8">
                     <Shield className="h-8 w-8 text-white mb-4" />
                     <div className="h-2 w-2/3 bg-white/30 rounded mb-2"></div>
                     <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                  </div>
                  <div className="bg-secondary/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 flex flex-col justify-end transform -translate-y-2 col-span-2">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 rounded-full bg-white/20"></div>
                       <div>
                         <div className="h-2 w-24 bg-white/30 rounded mb-2"></div>
                         <div className="h-2 w-16 bg-white/20 rounded"></div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-card border border-border shadow-xl rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-secondary fill-secondary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Nota 4.9/5</div>
                  <div className="text-xs text-muted-foreground">no Reclame Aqui</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Como funciona</h2>
            <p className="text-lg text-muted-foreground/80">Três passos simples separam você da melhor cobertura de saúde.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-background/20" />
            
            {[
              { num: "01", title: "Análise de Perfil", desc: "Entendemos suas necessidades, rotina e orçamento através de uma breve conversa." },
              { num: "02", title: "Cotação Personalizada", desc: "Apresentamos as melhores opções do mercado que se encaixam exatamente no que você precisa." },
              { num: "03", title: "Contratação Ágil", desc: "Cuidamos de toda a burocracia e papelada para você ter seu plano ativo o mais rápido possível." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 text-center"
              >
                <div className="w-24 h-24 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground/80">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-secondary/90 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1">
              Começar Agora
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">O que dizem nossos clientes</h2>
            <p className="text-lg text-muted-foreground">A satisfação de quem confia a saúde da sua família e empresa à Rota Seguros.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Carlos Silva", role: "Empresário", text: "Reduzi em 30% os custos com o plano da minha empresa sem perder qualidade. Atendimento excepcional da equipe." },
              { name: "Mariana Costa", role: "Mãe de 2 filhos", text: "Me ajudaram a encontrar um plano perfeito para a chegada do meu bebê. Tiraram todas as minhas dúvidas com muita paciência." },
              { name: "Roberto Alves", role: "Profissional Liberal", text: "Como MEI, achava que não conseguiria um plano bom. A Rota Seguros me mostrou opções que eu nem sabia que existiam." }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 h-full bg-accent/30 border-none hover:bg-accent/50 transition-colors">
                  <div className="flex gap-1 mb-6 text-secondary">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-5 w-5 fill-current" />)}
                  </div>
                  <p className="text-lg mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Dúvidas Frequentes</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "A consultoria tem algum custo?", a: "Não, nosso serviço de consultoria é 100% gratuito. Somos remunerados pelas operadoras de saúde, garantindo imparcialidade e zero custo para você." },
              { q: "Quais os documentos necessários para contratar?", a: "Geralmente RG, CPF, comprovante de residência e cartão do SUS. Para planos empresariais, é necessário o CNPJ e contrato social. Nossa equipe orienta sobre todos os detalhes." },
              { q: "Posso aproveitar as carências do meu plano atual?", a: "Sim! Na maioria dos casos, se você tem um plano ativo há mais de 1 ano, podemos fazer a portabilidade de carências para a nova operadora." },
              { q: "MEI pode contratar plano de saúde empresarial?", a: "Sim, a partir de 6 meses de abertura do MEI, você já pode contratar planos empresariais a partir de 2 vidas (titular + dependente), geralmente com preços muito mais atrativos." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10"
        />
        
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Pronto para cuidar melhor da sua saúde?</h2>
          <p className="text-xl text-muted-foreground mb-10">Fale com um de nossos especialistas agora mesmo e receba uma cotação sem compromisso em poucos minutos.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-secondary text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-secondary/90 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]">
            <MessageCircle className="h-6 w-6" />
            Solicitar Cotação no WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <HeartPulse className="h-8 w-8" />
                <span className="font-display font-bold text-2xl tracking-tight">Rota Seguros</span>
              </div>
              <p className="text-background/70 max-w-sm mb-6">
                Ajudamos famílias e empresas a encontrarem os melhores planos de saúde do Brasil com transparência e agilidade.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
              <ul className="space-y-4">
                <li><a href="#planos" className="text-background/70 hover:text-primary transition-colors">Planos</a></li>
                <li><a href="#beneficios" className="text-background/70 hover:text-primary transition-colors">Benefícios</a></li>
                <li><a href="#como-funciona" className="text-background/70 hover:text-primary transition-colors">Como Funciona</a></li>
                <li><a href="#depoimentos" className="text-background/70 hover:text-primary transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-background/70">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>(31) 9365-9875</span>
                </li>
                <li className="flex items-start gap-3 text-background/70">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>contato@rotaseguros.com.br</span>
                </li>
                <li className="flex items-start gap-3 text-background/70">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Belo Horizonte, MG</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-background/20 text-center text-background/50 text-sm">
            © {new Date().getFullYear()} Rota Seguros. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a 
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-secondary/90 transition-colors group"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-secondary/40 rounded-full -z-10"
        />
        <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform" />
      </motion.a>
    </div>
  );
}
