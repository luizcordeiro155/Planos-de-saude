import React, { useMemo, useState } from 'react';
import { AlertCircle, Code2, Eye, Home, Lock, Save, ShieldCheck, Upload } from 'lucide-react';

const HOME_PATH = 'artifacts/planos-saude/src/pages/Home.tsx';
const STORAGE_KEY = 'planos-admin-cms-v3';

type Status = 'idle' | 'loading' | 'ready' | 'saving' | 'error';
type Section = 'identidade' | 'hero' | 'metricas' | 'operadoras' | 'cotacao' | 'planos' | 'coberturas' | 'diferenciais' | 'processo' | 'depoimentos' | 'faq' | 'cta' | 'rodape' | 'todos' | 'codigo';
type FieldType = 'text' | 'textarea' | 'number';
type Field = { id: string; section: Section; label: string; original: string; value: string; type?: FieldType; hint?: string };

const tabs: { id: Section; label: string }[] = [
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
  { id: 'cta', label: 'CTA final' },
  { id: 'rodape', label: 'Rodapé' },
  { id: 'todos', label: 'Tudo' },
  { id: 'codigo', label: 'Código' },
];

const baseFields: Field[] = [
  { id: 'metric-num-1', section: 'metricas', label: 'Número de clientes atendidos', original: '12000', value: '12000', type: 'number' },
  { id: 'metric-label-1', section: 'metricas', label: 'Rótulo de clientes atendidos', original: 'Clientes Atendidos', value: 'Clientes Atendidos' },
  { id: 'metric-num-2', section: 'metricas', label: 'Número da satisfação', original: '98', value: '98', type: 'number' },
  { id: 'metric-label-2', section: 'metricas', label: 'Rótulo da satisfação', original: 'Taxa de Satisfação', value: 'Taxa de Satisfação' },
  { id: 'metric-num-3', section: 'metricas', label: 'Número de anos no mercado', original: '15', value: '15', type: 'number' },
  { id: 'metric-label-3', section: 'metricas', label: 'Rótulo de anos no mercado', original: 'Anos no Mercado', value: 'Anos no Mercado' },
  { id: 'metric-num-4', section: 'metricas', label: 'Número de operadoras parceiras', original: '22', value: '22', type: 'number' },
  { id: 'metric-label-4', section: 'metricas', label: 'Rótulo de operadoras parceiras', original: 'Operadoras Parceiras', value: 'Operadoras Parceiras' },

  { id: 'oper-title', section: 'operadoras', label: 'Título das operadoras', original: 'Trabalhamos com as maiores operadoras de saúde do Brasil', value: 'Trabalhamos com as maiores operadoras de saúde do Brasil' },
  { id: 'oper-1', section: 'operadoras', label: 'Operadora 1', original: 'Unimed', value: 'Unimed' },
  { id: 'oper-2', section: 'operadoras', label: 'Operadora 2', original: 'Amil', value: 'Amil' },
  { id: 'oper-3', section: 'operadoras', label: 'Operadora 3', original: 'SulAmérica', value: 'SulAmérica' },
  { id: 'oper-4', section: 'operadoras', label: 'Operadora 4', original: 'Bradesco Saúde', value: 'Bradesco Saúde' },
  { id: 'oper-5', section: 'operadoras', label: 'Operadora 5', original: 'NotreDame Intermédica', value: 'NotreDame Intermédica' },
  { id: 'oper-6', section: 'operadoras', label: 'Operadora 6', original: 'Hapvida', value: 'Hapvida' },
  { id: 'oper-7', section: 'operadoras', label: 'Operadora 7', original: 'Porto Seguro Saúde', value: 'Porto Seguro Saúde' },
  { id: 'oper-8', section: 'operadoras', label: 'Operadora 8', original: 'Prevent Sênior', value: 'Prevent Sênior' },

  { id: 'hero-badge', section: 'hero', label: 'Selo', original: 'Corretora de Saúde Especializada - Belo Horizonte, MG', value: 'Corretora de Saúde Especializada - Belo Horizonte, MG' },
  { id: 'hero-title-a', section: 'hero', label: 'Título início', original: 'O plano de saúde', value: 'O plano de saúde' },
  { id: 'hero-title-b', section: 'hero', label: 'Título destaque', original: 'certo para você', value: 'certo para você' },
  { id: 'hero-title-c', section: 'hero', label: 'Título final', original: 'sem complicação.', value: 'sem complicação.' },
  { id: 'hero-sub', section: 'hero', label: 'Subtítulo', original: 'Somos especialistas em planos de saúde individuais, familiares e empresariais. Consultoria gratuita, imparcial e com as melhores operadoras do mercado.', value: 'Somos especialistas em planos de saúde individuais, familiares e empresariais. Consultoria gratuita, imparcial e com as melhores operadoras do mercado.', type: 'textarea' },
  { id: 'hero-support', section: 'hero', label: 'Texto de apoio', original: 'Atendemos por WhatsApp rápido, sem burocracia e sem compromisso.', value: 'Atendemos por WhatsApp rápido, sem burocracia e sem compromisso.', type: 'textarea' },
  { id: 'hero-btn-1', section: 'hero', label: 'Botão principal', original: 'Fazer Cotação Gratuita', value: 'Fazer Cotação Gratuita' },
  { id: 'hero-btn-2', section: 'hero', label: 'Botão secundário', original: 'Conhecer os Planos', value: 'Conhecer os Planos' },

  { id: 'quote-kicker', section: 'cotacao', label: 'Chamada pequena', original: 'Cotação Gratuita', value: 'Cotação Gratuita' },
  { id: 'quote-title', section: 'cotacao', label: 'Título da cotação', original: 'Receba sua cotação em minutos pelo WhatsApp.', value: 'Receba sua cotação em minutos pelo WhatsApp.' },
  { id: 'quote-desc', section: 'cotacao', label: 'Descrição da cotação', original: 'Preencha os campos ao lado e clique no botão. Sua mensagem chegará já formatada para o nosso especialista — sem precisar digitar nada.', value: 'Preencha os campos ao lado e clique no botão. Sua mensagem chegará já formatada para o nosso especialista — sem precisar digitar nada.', type: 'textarea' },
  { id: 'quote-card-title', section: 'cotacao', label: 'Título do formulário', original: 'Solicite sua cotação', value: 'Solicite sua cotação' },
  { id: 'quote-card-sub', section: 'cotacao', label: 'Subtítulo do formulário', original: 'Preencha e envie — simples assim.', value: 'Preencha e envie — simples assim.' },
  { id: 'quote-name', section: 'cotacao', label: 'Campo nome', original: 'Seu nome completo', value: 'Seu nome completo' },
  { id: 'quote-city', section: 'cotacao', label: 'Campo cidade', original: 'Cidade', value: 'Cidade' },
  { id: 'quote-type', section: 'cotacao', label: 'Campo tipo de plano', original: 'Tipo de plano', value: 'Tipo de plano' },
  { id: 'quote-send', section: 'cotacao', label: 'Botão enviar', original: 'Enviar Cotação pelo WhatsApp', value: 'Enviar Cotação pelo WhatsApp' },

  { id: 'plans-kicker', section: 'planos', label: 'Chamada pequena', original: 'Nossos Planos', value: 'Nossos Planos' },
  { id: 'plans-title', section: 'planos', label: 'Título', original: 'Uma solução para cada momento de vida', value: 'Uma solução para cada momento de vida' },
  { id: 'plans-desc', section: 'planos', label: 'Descrição', original: 'Seja para você, sua família ou sua empresa — encontramos as melhores opções com as melhores condições do mercado. Consulte-nos gratuitamente pelo WhatsApp.', value: 'Seja para você, sua família ou sua empresa — encontramos as melhores opções com as melhores condições do mercado. Consulte-nos gratuitamente pelo WhatsApp.', type: 'textarea' },
  { id: 'plan-1-title', section: 'planos', label: 'Plano 1 título', original: 'Plano Individual', value: 'Plano Individual' },
  { id: 'plan-2-title', section: 'planos', label: 'Plano 2 título', original: 'Plano Familiar', value: 'Plano Familiar' },
  { id: 'plan-2-badge', section: 'planos', label: 'Plano 2 selo', original: 'Mais Buscado', value: 'Mais Buscado' },
  { id: 'plan-2-desc', section: 'planos', label: 'Plano familiar descrição', original: 'Proteção completa para toda a família com benefícios exclusivos para crianças, gestantes e idosos.', value: 'Proteção completa para toda a família com benefícios exclusivos para crianças, gestantes e idosos.', type: 'textarea' },
  { id: 'plan-3-title', section: 'planos', label: 'Plano 3 título', original: 'Plano Empresarial', value: 'Plano Empresarial' },
  { id: 'plan-3-desc', section: 'planos', label: 'Plano empresarial descrição', original: 'Planos corporativos acessíveis para MEIs, microempresas e grandes empresas. Valorize sua equipe com saúde de qualidade.', value: 'Planos corporativos acessíveis para MEIs, microempresas e grandes empresas. Valorize sua equipe com saúde de qualidade.', type: 'textarea' },

  { id: 'cov-kicker', section: 'coberturas', label: 'Chamada pequena', original: 'Coberturas', value: 'Coberturas' },
  { id: 'cov-title', section: 'coberturas', label: 'Título', original: 'O que os planos podem cobrir', value: 'O que os planos podem cobrir' },
  { id: 'cov-desc', section: 'coberturas', label: 'Descrição', original: 'De acordo com a ANS, os planos de saúde oferecem cobertura obrigatória para diversos procedimentos. Conheça os principais:', value: 'De acordo com a ANS, os planos de saúde oferecem cobertura obrigatória para diversos procedimentos. Conheça os principais:', type: 'textarea' },
  { id: 'cov-1', section: 'coberturas', label: 'Cobertura 1', original: 'Consultas Médicas', value: 'Consultas Médicas' },
  { id: 'cov-2', section: 'coberturas', label: 'Cobertura 2', original: 'Exames e Diagnósticos', value: 'Exames e Diagnósticos' },
  { id: 'cov-3', section: 'coberturas', label: 'Cobertura 3', original: 'Internação Hospitalar', value: 'Internação Hospitalar' },
  { id: 'cov-4', section: 'coberturas', label: 'Cobertura 4', original: 'Parto e Maternidade', value: 'Parto e Maternidade' },
  { id: 'cov-5', section: 'coberturas', label: 'Cobertura 5', original: 'Urgência e Emergência', value: 'Urgência e Emergência' },
  { id: 'cov-6', section: 'coberturas', label: 'Cobertura 6', original: 'Saúde Mental', value: 'Saúde Mental' },
  { id: 'cov-cta', section: 'coberturas', label: 'Botão coberturas', original: 'Tirar dúvidas no WhatsApp', value: 'Tirar dúvidas no WhatsApp' },

  { id: 'dif-kicker', section: 'diferenciais', label: 'Chamada pequena', original: 'Por que a Rota Seguros', value: 'Por que a Rota Seguros' },
  { id: 'dif-title', section: 'diferenciais', label: 'Título', original: 'Mais do que um corretor — um parceiro de saúde.', value: 'Mais do que um corretor — um parceiro de saúde.' },
  { id: 'dif-desc', section: 'diferenciais', label: 'Descrição', original: 'Não somos representantes de uma única operadora. Trabalhamos com as principais do mercado e buscamos, de forma independente, o plano que realmente faz sentido para o seu perfil e orçamento.', value: 'Não somos representantes de uma única operadora. Trabalhamos com as principais do mercado e buscamos, de forma independente, o plano que realmente faz sentido para o seu perfil e orçamento.', type: 'textarea' },
  { id: 'dif-1', section: 'diferenciais', label: 'Diferencial 1', original: 'Consultoria Imparcial e Gratuita', value: 'Consultoria Imparcial e Gratuita' },
  { id: 'dif-2', section: 'diferenciais', label: 'Diferencial 2', original: 'Atendimento Rápido pelo WhatsApp', value: 'Atendimento Rápido pelo WhatsApp' },
  { id: 'dif-3', section: 'diferenciais', label: 'Diferencial 3', original: 'Suporte Completo Pós-Contratação', value: 'Suporte Completo Pós-Contratação' },
  { id: 'dif-4', section: 'diferenciais', label: 'Diferencial 4', original: 'Especialistas em Regulamentação ANS', value: 'Especialistas em Regulamentação ANS' },
  { id: 'dif-stat-1', section: 'diferenciais', label: 'Card estatística 1 valor', original: 'Gratuita', value: 'Gratuita' },
  { id: 'dif-stat-2', section: 'diferenciais', label: 'Card estatística 2 valor', original: '22+', value: '22+' },
  { id: 'dif-stat-3', section: 'diferenciais', label: 'Card estatística 3 valor', original: '5 min', value: '5 min' },
  { id: 'dif-stat-4', section: 'diferenciais', label: 'Card estatística 4 valor', original: '98%', value: '98%' },
  { id: 'dif-stat-5', section: 'diferenciais', label: 'Card estatística 5 valor', original: '15+', value: '15+' },

  { id: 'proc-kicker', section: 'processo', label: 'Chamada pequena', original: 'Processo Simples', value: 'Processo Simples' },
  { id: 'proc-title', section: 'processo', label: 'Título', original: 'Como funciona a nossa consultoria', value: 'Como funciona a nossa consultoria' },
  { id: 'proc-desc', section: 'processo', label: 'Descrição', original: 'Da primeira mensagem no WhatsApp até o seu plano ativo — simples assim.', value: 'Da primeira mensagem no WhatsApp até o seu plano ativo — simples assim.' },
  { id: 'proc-1-title', section: 'processo', label: 'Passo 1 título', original: 'Fale com a Gente', value: 'Fale com a Gente' },
  { id: 'proc-1-desc', section: 'processo', label: 'Passo 1 descrição', original: 'Mande uma mensagem no WhatsApp. Sem formulários complicados, sem espera.', value: 'Mande uma mensagem no WhatsApp. Sem formulários complicados, sem espera.', type: 'textarea' },
  { id: 'proc-2-title', section: 'processo', label: 'Passo 2 título', original: 'Análise do Perfil', value: 'Análise do Perfil' },
  { id: 'proc-2-desc', section: 'processo', label: 'Passo 2 descrição', original: 'Entendemos suas necessidades, rotina, cidade e orçamento em uma conversa rápida.', value: 'Entendemos suas necessidades, rotina, cidade e orçamento em uma conversa rápida.', type: 'textarea' },
  { id: 'proc-3-title', section: 'processo', label: 'Passo 3 título', original: 'Cotação Personalizada', value: 'Cotação Personalizada' },
  { id: 'proc-4-title', section: 'processo', label: 'Passo 4 título', original: 'Plano Ativo', value: 'Plano Ativo' },
  { id: 'proc-btn', section: 'processo', label: 'Botão', original: 'Começar Agora pelo WhatsApp', value: 'Começar Agora pelo WhatsApp' },

  { id: 'test-kicker', section: 'depoimentos', label: 'Chamada pequena', original: 'Depoimentos', value: 'Depoimentos' },
  { id: 'test-title', section: 'depoimentos', label: 'Título', original: 'O que nossos clientes dizem', value: 'O que nossos clientes dizem' },
  { id: 'test-desc', section: 'depoimentos', label: 'Descrição', original: 'A satisfação de quem confia a saúde da família e da empresa à Rota Seguros.', value: 'A satisfação de quem confia a saúde da família e da empresa à Rota Seguros.' },
  { id: 'test-1-name', section: 'depoimentos', label: 'Cliente 1 nome', original: 'Carlos Eduardo Silva', value: 'Carlos Eduardo Silva' },
  { id: 'test-1-role', section: 'depoimentos', label: 'Cliente 1 cargo/cidade', original: 'Empresário — Belo Horizonte', value: 'Empresário — Belo Horizonte' },
  { id: 'test-1-text', section: 'depoimentos', label: 'Cliente 1 comentário', original: 'Reduzi em mais de 30% os custos com o plano da minha empresa sem perder qualidade na cobertura. O atendimento foi excepcional do início ao fim.', value: 'Reduzi em mais de 30% os custos com o plano da minha empresa sem perder qualidade na cobertura. O atendimento foi excepcional do início ao fim.', type: 'textarea' },
  { id: 'test-2-name', section: 'depoimentos', label: 'Cliente 2 nome', original: 'Mariana Costa', value: 'Mariana Costa' },
  { id: 'test-2-role', section: 'depoimentos', label: 'Cliente 2 cargo/cidade', original: 'Professora — Contagem, MG', value: 'Professora — Contagem, MG' },
  { id: 'test-2-text', section: 'depoimentos', label: 'Cliente 2 comentário', original: 'Me ajudaram a encontrar o plano perfeito na chegada do meu bebê. Tiraram todas as minhas dúvidas sobre carência de parto com muita paciência e clareza.', value: 'Me ajudaram a encontrar o plano perfeito na chegada do meu bebê. Tiraram todas as minhas dúvidas sobre carência de parto com muita paciência e clareza.', type: 'textarea' },
  { id: 'test-3-name', section: 'depoimentos', label: 'Cliente 3 nome', original: 'Roberto Alves', value: 'Roberto Alves' },
  { id: 'test-3-role', section: 'depoimentos', label: 'Cliente 3 cargo/cidade', original: 'Autônomo / MEI — Betim, MG', value: 'Autônomo / MEI — Betim, MG' },
  { id: 'test-3-text', section: 'depoimentos', label: 'Cliente 3 comentário', original: 'Como MEI, achei que não conseguiria um plano bom. A Rota Seguros me mostrou opções que eu nem sabia que existiam. Processo todo pelo WhatsApp, super prático.', value: 'Como MEI, achei que não conseguiria um plano bom. A Rota Seguros me mostrou opções que eu nem sabia que existiam. Processo todo pelo WhatsApp, super prático.', type: 'textarea' },
  { id: 'test-4-name', section: 'depoimentos', label: 'Cliente 4 nome', original: 'Fernanda Rodrigues', value: 'Fernanda Rodrigues' },
  { id: 'test-4-text', section: 'depoimentos', label: 'Cliente 4 comentário', original: 'Implantamos o plano corporativo para 40 funcionários em tempo recorde. Todo o processo foi conduzido com muita profissionalismo e clareza.', value: 'Implantamos o plano corporativo para 40 funcionários em tempo recorde. Todo o processo foi conduzido com muita profissionalismo e clareza.', type: 'textarea' },
  { id: 'test-5-name', section: 'depoimentos', label: 'Cliente 5 nome', original: 'Paulo Mendes', value: 'Paulo Mendes' },
  { id: 'test-5-text', section: 'depoimentos', label: 'Cliente 5 comentário', original: 'Tinha um plano há anos e nunca soube que podia fazer portabilidade. A equipe me orientou e hoje tenho uma cobertura muito melhor pagando menos.', value: 'Tinha um plano há anos e nunca soube que podia fazer portabilidade. A equipe me orientou e hoje tenho uma cobertura muito melhor pagando menos.', type: 'textarea' },
  { id: 'test-6-name', section: 'depoimentos', label: 'Cliente 6 nome', original: 'Ana Luiza Pereira', value: 'Ana Luiza Pereira' },
  { id: 'test-6-text', section: 'depoimentos', label: 'Cliente 6 comentário', original: 'Indico a Rota Seguros para todos os meus pacientes e amigos. Atendimento rápido, honesto e resultado garantido. É de confiar mesmo.', value: 'Indico a Rota Seguros para todos os meus pacientes e amigos. Atendimento rápido, honesto e resultado garantido. É de confiar mesmo.', type: 'textarea' },

  { id: 'faq-kicker', section: 'faq', label: 'Chamada pequena', original: 'Dúvidas', value: 'Dúvidas' },
  { id: 'faq-title', section: 'faq', label: 'Título', original: 'Perguntas Frequentes', value: 'Perguntas Frequentes' },
  { id: 'faq-desc', section: 'faq', label: 'Descrição', original: 'Respondemos as principais dúvidas sobre planos de saúde e nosso processo de consultoria.', value: 'Respondemos as principais dúvidas sobre planos de saúde e nosso processo de consultoria.' },
  { id: 'faq-1-q', section: 'faq', label: 'Pergunta 1', original: 'A consultoria da Rota Seguros tem algum custo?', value: 'A consultoria da Rota Seguros tem algum custo?' },
  { id: 'faq-1-a', section: 'faq', label: 'Resposta 1', original: 'Não. Nossa consultoria é 100% gratuita. Somos remunerados pelas operadoras de saúde, o que nos permite oferecer todo o suporte sem nenhum custo para você.', value: 'Não. Nossa consultoria é 100% gratuita. Somos remunerados pelas operadoras de saúde, o que nos permite oferecer todo o suporte sem nenhum custo para você.', type: 'textarea' },
  { id: 'faq-2-q', section: 'faq', label: 'Pergunta 2', original: 'Como funciona o atendimento pelo WhatsApp?', value: 'Como funciona o atendimento pelo WhatsApp?' },
  { id: 'faq-2-a', section: 'faq', label: 'Resposta 2', original: 'É simples: você envia uma mensagem, nossa equipe responde em até 5 minutos em horário comercial. Fazemos uma análise do seu perfil, apresentamos as melhores opções e você decide sem pressão.', value: 'É simples: você envia uma mensagem, nossa equipe responde em até 5 minutos em horário comercial. Fazemos uma análise do seu perfil, apresentamos as melhores opções e você decide sem pressão.', type: 'textarea' },
  { id: 'faq-3-q', section: 'faq', label: 'Pergunta 3', original: 'Quais documentos são necessários para contratar?', value: 'Quais documentos são necessários para contratar?' },
  { id: 'faq-3-a', section: 'faq', label: 'Resposta 3', original: 'Geralmente RG, CPF, comprovante de residência e, em alguns casos, cartão do SUS. Para planos empresariais, o CNPJ e documentos da empresa. Nossa equipe orienta cada caso de forma personalizada.', value: 'Geralmente RG, CPF, comprovante de residência e, em alguns casos, cartão do SUS. Para planos empresariais, o CNPJ e documentos da empresa. Nossa equipe orienta cada caso de forma personalizada.', type: 'textarea' },
  { id: 'faq-4-q', section: 'faq', label: 'Pergunta 4', original: 'Posso aproveitar as carências do meu plano atual?', value: 'Posso aproveitar as carências do meu plano atual?' },
  { id: 'faq-5-q', section: 'faq', label: 'Pergunta 5', original: 'MEI pode contratar plano de saúde empresarial?', value: 'MEI pode contratar plano de saúde empresarial?' },
  { id: 'faq-6-q', section: 'faq', label: 'Pergunta 6', original: 'Qual a diferença entre plano com e sem coparticipação?', value: 'Qual a diferença entre plano com e sem coparticipação?' },

  { id: 'cta-kicker', section: 'cta', label: 'Chamada pequena', original: 'Pronto para começar?', value: 'Pronto para começar?' },
  { id: 'cta-title', section: 'cta', label: 'Título CTA', original: 'Cuide da sua saúde com quem entende do assunto.', value: 'Cuide da sua saúde com quem entende do assunto.' },
  { id: 'cta-desc', section: 'cta', label: 'Descrição CTA', original: 'Fale agora com um especialista da Rota Seguros e receba uma cotação personalizada, sem compromisso, em poucos minutos pelo WhatsApp.', value: 'Fale agora com um especialista da Rota Seguros e receba uma cotação personalizada, sem compromisso, em poucos minutos pelo WhatsApp.', type: 'textarea' },
  { id: 'cta-btn', section: 'cta', label: 'Botão CTA', original: 'Solicitar Cotação Gratuita', value: 'Solicitar Cotação Gratuita' },

  { id: 'footer-desc', section: 'rodape', label: 'Descrição do rodapé', original: 'Corretora de planos de saúde especializada em encontrar a melhor solução para você, sua família e sua empresa. Consultoria gratuita e sem compromisso.', value: 'Corretora de planos de saúde especializada em encontrar a melhor solução para você, sua família e sua empresa. Consultoria gratuita e sem compromisso.', type: 'textarea' },
  { id: 'footer-nav', section: 'rodape', label: 'Título navegação', original: 'Navegação', value: 'Navegação' },
  { id: 'footer-contact', section: 'rodape', label: 'Título contato', original: 'Contato', value: 'Contato' },
  { id: 'footer-email', section: 'rodape', label: 'E-mail', original: 'contato@rotaseguros.com.br', value: 'contato@rotaseguros.com.br' },
  { id: 'footer-city', section: 'rodape', label: 'Cidade', original: 'Belo Horizonte, MG', value: 'Belo Horizonte, MG' },
  { id: 'footer-country', section: 'rodape', label: 'Abrangência', original: 'Atendemos todo o Brasil', value: 'Atendemos todo o Brasil' },
];

function readStored() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, string>; } catch { return {}; } }
function persist(items: Field[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(items.map((item) => [item.id, item.value])))); }
function withStored(items: Field[]) { const stored = readStored(); return items.map((item) => ({ ...item, value: stored[item.id] || item.value })); }
function replaceAll(source: string, from: string, to: string) { return from && from !== to ? source.split(from).join(to) : source; }
function getLabel(section: Section) { return tabs.find((tab) => tab.id === section)?.label || section; }

function FieldList({ fields, onChange }: { fields: Field[]; onChange: (id: string, value: string) => void }) {
  return <div className="space-y-4">{fields.map((field) => <label key={field.id} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-bold text-slate-700">{field.label}</span>{field.type === 'textarea' ? <textarea value={field.value} onChange={(event) => onChange(field.id, event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border bg-white p-3" /> : <input type={field.type === 'number' ? 'number' : 'text'} value={field.value} onChange={(event) => onChange(field.id, event.target.value)} className="mt-2 w-full rounded-xl border bg-white p-3" />}{field.value !== field.original && <span className="mt-2 block text-xs font-bold text-emerald-700">Alterado</span>}</label>)}</div>;
}

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin-password') || '');
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin-auth') === 'true');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [activeTab, setActiveTab] = useState<Section>('identidade');
  const [fields, setFields] = useState<Field[]>(() => withStored(baseFields));
  const [brandName, setBrandName] = useState(() => readStored().brandName || 'Rota Seguros');
  const [whatsapp, setWhatsapp] = useState(() => readStored().whatsapp || '553193659875');
  const [logoDataUrl, setLogoDataUrl] = useState('');

  const field = (id: string, fallback = '') => fields.find((item) => item.id === id)?.value || fallback;
  const visibleFields = fields.filter((item) => activeTab === 'todos' ? true : item.section === activeTab);
  const changedFields = fields.filter((item) => item.value !== item.original);

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
    setMessage('Carregando conteúdo do GitHub...');
    try {
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(HOME_PATH)}`, { headers: { 'x-admin-password': activePassword } });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível carregar o site.');
      setSource(String(data.content || ''));
      setFields(withStored(baseFields));
      setStatus('ready');
      setMessage('Conteúdo carregado.');
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Erro ao carregar conteúdo.'); }
  }

  function updateField(id: string, value: string) {
    setFields((items) => { const next = items.map((item) => item.id === id ? { ...item, value } : item); persist(next); return next; });
  }

  function saveIdentity(nextBrand = brandName, nextWhatsapp = whatsapp) {
    const stored = readStored();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, brandName: nextBrand, whatsapp: nextWhatsapp }));
  }

  const updatedSource = useMemo(() => {
    let next = source;
    next = next.replace(/const WHATSAPP_BASE = "https:\/\/wa\.me\/[^\"]*";/, `const WHATSAPP_BASE = "https://wa.me/${whatsapp.replace(/\D/g, '')}";`);
    next = replaceAll(next, 'Rota Seguros', brandName);
    fields.forEach((item) => { next = replaceAll(next, item.original, item.value); });
    next = next.replace(/\{ label: "Clientes Atendidos", value: \d+, suffix:/, `{ label: "${field('metric-label-1')}", value: ${field('metric-num-1') || 0}, suffix:`);
    next = next.replace(/\{ label: "Taxa de Satisfação", value: \d+, suffix:/, `{ label: "${field('metric-label-2')}", value: ${field('metric-num-2') || 0}, suffix:`);
    next = next.replace(/\{ label: "Anos no Mercado", value: \d+, suffix:/, `{ label: "${field('metric-label-3')}", value: ${field('metric-num-3') || 0}, suffix:`);
    next = next.replace(/\{ label: "Operadoras Parceiras", value: \d+, suffix:/, `{ label: "${field('metric-label-4')}", value: ${field('metric-num-4') || 0}, suffix:`);
    if (logoDataUrl) {
      const imgTag = `<img src="${logoDataUrl}" alt="Logo" className="admin-logo-data-url h-7 w-7 rounded-lg object-contain" />`;
      next = next.includes('admin-logo-data-url') ? next.replace(/<img src="[^"]*" alt="Logo" className="admin-logo-data-url h-7 w-7 rounded-lg object-contain" \/>/, imgTag) : next.replace('<HeartPulse className="h-5 w-5 text-white" />', imgTag);
    }
    return next;
  }, [source, fields, brandName, whatsapp, logoDataUrl]);

  async function save() {
    setStatus('saving');
    setMessage('Salvando no GitHub e criando commit...');
    persist(fields);
    saveIdentity();
    try {
      const content = activeTab === 'codigo' ? source : updatedSource;
      const response = await fetch(`/api/admin-file?path=${encodeURIComponent(HOME_PATH)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ content }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Não foi possível salvar.');
      setSource(content);
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

  if (!authenticated) return <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 p-8 shadow-2xl"><div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6"><Lock className="h-7 w-7" /></div><h1 className="text-3xl font-bold mb-2">Admin do site</h1><p className="text-slate-300 mb-6">Página secreta para editar tudo do site e publicar no GitHub.</p><label className="block text-sm font-semibold mb-2">Senha secreta</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none focus:border-emerald-400" /><button type="submit" className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-bold hover:bg-emerald-400">Entrar</button>{message && <p className="mt-4 text-sm text-amber-200">{message}</p>}</form></main>;

  return <main className="min-h-screen bg-slate-100 text-slate-950"><header className="bg-white border-b border-slate-200 sticky top-0 z-20"><div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-emerald-700 font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Painel protegido</p><h1 className="text-2xl font-black">Editar site completo</h1></div><div className="flex gap-2"><a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 font-semibold flex items-center gap-2"><Home className="h-4 w-4" /> Ver site</a><button onClick={save} disabled={!source || status === 'saving'} className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-bold flex items-center gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> Salvar e publicar</button></div></div></header><section className="max-w-7xl mx-auto px-4 py-6">{message && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2"><AlertCircle className="h-5 w-5 shrink-0" /><span>{message}</span></div>}<div className="mb-5 flex gap-2 overflow-x-auto pb-2">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2 font-bold border ${activeTab === tab.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'}`}>{tab.label}</button>)}</div><div className="grid lg:grid-cols-[1fr_520px] gap-6"><div className="space-y-5">{activeTab === 'identidade' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-4">Identidade</h2><div className="grid md:grid-cols-2 gap-4"><label><span className="text-sm font-bold">Nome da marca</span><input value={brandName} onChange={(e) => { setBrandName(e.target.value); saveIdentity(e.target.value, whatsapp); }} className="mt-2 w-full rounded-xl border bg-white p-3" /></label><label><span className="text-sm font-bold">WhatsApp com DDI e DDD</span><input value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value); saveIdentity(brandName, e.target.value); }} className="mt-2 w-full rounded-xl border bg-white p-3" /></label></div><label className="mt-4 block"><span className="text-sm font-bold flex gap-2"><Upload className="h-4 w-4" />Logo</span><div className="mt-2 rounded-xl border border-dashed p-4 bg-slate-50"><input type="file" accept="image/*" onChange={uploadLogo} />{logoDataUrl && <img src={logoDataUrl} className="mt-3 h-16 w-16 object-contain rounded-xl bg-white border" />}</div></label></div>}{activeTab !== 'identidade' && activeTab !== 'codigo' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2">Editar {getLabel(activeTab)}</h2><p className="text-sm text-slate-500 mb-5">Tudo que aparece aqui altera o site e a prévia muda enquanto você digita.</p><FieldList fields={visibleFields} onChange={updateField} /></div>}{activeTab === 'codigo' && <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"><h2 className="text-xl font-bold mb-2 flex gap-2"><Code2 className="h-5 w-5" /> Código completo</h2><textarea value={source} onChange={(e) => setSource(e.target.value)} className="w-full min-h-[720px] rounded-xl border p-4 font-mono text-xs" /></div>}</div><aside className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm h-fit sticky top-28"><h2 className="text-xl font-bold mb-4 flex gap-2"><Eye className="h-5 w-5" /> Prévia visual</h2><div className="rounded-2xl border bg-slate-50 p-5 space-y-4 max-h-[720px] overflow-auto"><Preview activeTab={activeTab} brandName={brandName} whatsapp={whatsapp} logoDataUrl={logoDataUrl} field={field} fields={visibleFields} /></div>{changedFields.length > 0 && <p className="mt-4 text-xs text-emerald-700 font-bold">{changedFields.length} campo(s) alterado(s) antes de salvar.</p>}<button onClick={() => loadHome()} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2 font-semibold">Recarregar arquivo</button></aside></div></section></main>;
}

function Preview({ activeTab, brandName, whatsapp, logoDataUrl, field, fields }: { activeTab: Section; brandName: string; whatsapp: string; logoDataUrl: string; field: (id: string, fallback?: string) => string; fields: Field[] }) {
  if (activeTab === 'identidade') return <div className="space-y-4"><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-teal-700 text-white flex items-center justify-center font-black">{brandName.slice(0,1)}</div><h3 className="text-2xl font-black text-teal-700">{brandName}</h3></div><p>WhatsApp: {whatsapp}</p>{logoDataUrl && <img src={logoDataUrl} className="h-20 w-20 object-contain bg-white rounded-xl border" />}</div>;
  if (activeTab === 'metricas') return <div className="grid grid-cols-2 gap-4 text-center"><div><b className="text-3xl">{Number(field('metric-num-1')).toLocaleString('pt-BR')}+</b><p>{field('metric-label-1')}</p></div><div><b className="text-3xl">{field('metric-num-2')}%</b><p>{field('metric-label-2')}</p></div><div><b className="text-3xl">{field('metric-num-3')}+</b><p>{field('metric-label-3')}</p></div><div><b className="text-3xl">{field('metric-num-4')}+</b><p>{field('metric-label-4')}</p></div></div>;
  if (activeTab === 'hero') return <div className="text-center space-y-4"><p className="inline-block rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">{field('hero-badge')}</p><h3 className="text-4xl font-black">{field('hero-title-a')} <span className="text-emerald-700">{field('hero-title-b')}</span> {field('hero-title-c')}</h3><p>{field('hero-sub')}</p><p className="text-sm text-slate-500">{field('hero-support')}</p><span className="block bg-emerald-600 text-white rounded-xl py-3 font-bold">{field('hero-btn-1')}</span><span className="block bg-white border rounded-xl py-3 font-bold">{field('hero-btn-2')}</span></div>;
  if (activeTab === 'operadoras') return <div className="text-center space-y-4"><p className="uppercase text-xs font-bold text-slate-500">{field('oper-title')}</p><div className="flex flex-wrap justify-center gap-3 text-lg font-black text-slate-400">{['oper-1','oper-2','oper-3','oper-4','oper-5','oper-6','oper-7','oper-8'].map(id => <span key={id}>{field(id)}</span>)}</div></div>;
  if (activeTab === 'cotacao') return <div className="space-y-4"><p className="uppercase text-xs font-black text-teal-700">{field('quote-kicker')}</p><h3 className="text-4xl font-black">{field('quote-title')}</h3><p>{field('quote-desc')}</p><div className="bg-white rounded-2xl border p-4"><h4 className="text-xl font-black">{field('quote-card-title')}</h4><p className="text-sm text-slate-500">{field('quote-card-sub')}</p><span className="mt-3 block bg-emerald-500 text-white text-center rounded-xl py-3 font-bold">{field('quote-send')}</span></div></div>;
  if (activeTab === 'planos') return <div className="text-center space-y-4"><p className="uppercase text-xs font-black text-teal-700">{field('plans-kicker')}</p><h3 className="text-3xl font-black">{field('plans-title')}</h3><p>{field('plans-desc')}</p>{['plan-1-title','plan-2-title','plan-3-title'].map(id => <div key={id} className="bg-white border rounded-xl p-3 font-bold text-left">{field(id)}</div>)}</div>;
  if (activeTab === 'coberturas') return <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 text-center"><p className="uppercase text-xs text-emerald-400 font-bold">{field('cov-kicker')}</p><h3 className="text-3xl font-black">{field('cov-title')}</h3><p>{field('cov-desc')}</p><div className="grid grid-cols-2 gap-2 text-left">{['cov-1','cov-2','cov-3','cov-4','cov-5','cov-6'].map(id => <div key={id} className="bg-white/10 rounded-xl p-3">{field(id)}</div>)}</div></div>;
  if (activeTab === 'diferenciais') return <div className="space-y-4"><p className="uppercase text-xs font-bold text-teal-700">{field('dif-kicker')}</p><h3 className="text-3xl font-black">{field('dif-title')}</h3><p>{field('dif-desc')}</p>{['dif-1','dif-2','dif-3','dif-4'].map(id => <div key={id} className="bg-white border rounded-xl p-3 font-bold">{field(id)}</div>)}</div>;
  if (activeTab === 'processo') return <div className="bg-teal-700 text-white rounded-2xl p-5 space-y-4 text-center"><p className="uppercase text-xs text-teal-200 font-bold">{field('proc-kicker')}</p><h3 className="text-3xl font-black">{field('proc-title')}</h3><p>{field('proc-desc')}</p><div className="grid grid-cols-2 gap-2">{['proc-1-title','proc-2-title','proc-3-title','proc-4-title'].map(id => <div key={id} className="bg-white/10 rounded-xl p-3">{field(id)}</div>)}</div><span className="block bg-emerald-500 rounded-xl py-3 font-bold">{field('proc-btn')}</span></div>;
  if (activeTab === 'depoimentos') return <div className="space-y-4 text-center"><p className="uppercase text-xs font-bold text-teal-700">{field('test-kicker')}</p><h3 className="text-3xl font-black">{field('test-title')}</h3><p>{field('test-desc')}</p>{[1,2,3,4,5,6].map(n => <div key={n} className="bg-white border rounded-xl p-4 text-left"><p className="text-emerald-600">★★★★★</p><p className="text-sm">{field(`test-${n}-text`)}</p><b>{field(`test-${n}-name`)}</b><p className="text-xs text-slate-500">{field(`test-${n}-role`)}</p></div>)}</div>;
  if (activeTab === 'faq') return <div className="text-center space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{field('faq-kicker')}</p><h3 className="text-3xl font-black">{field('faq-title')}</h3><p>{field('faq-desc')}</p>{[1,2,3,4,5,6].map(n => <div key={n} className="bg-white border rounded-xl p-3 text-left"><b>{field(`faq-${n}-q`)}</b>{field(`faq-${n}-a`) && <p className="text-sm text-slate-600 mt-2">{field(`faq-${n}-a`)}</p>}</div>)}</div>;
  if (activeTab === 'cta') return <div className="text-center space-y-4"><p className="uppercase text-xs text-teal-700 font-bold">{field('cta-kicker')}</p><h3 className="text-4xl font-black">{field('cta-title')}</h3><p>{field('cta-desc')}</p><span className="block bg-emerald-500 text-white rounded-xl py-3 font-bold">{field('cta-btn')}</span></div>;
  if (activeTab === 'rodape') return <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4"><h3 className="text-2xl font-black text-teal-400">{brandName}</h3><p>{field('footer-desc')}</p><div className="grid grid-cols-2 gap-4"><div><b>{field('footer-nav')}</b><p>Planos<br/>Coberturas<br/>Diferenciais</p></div><div><b>{field('footer-contact')}</b><p>{field('footer-email')}<br/>{field('footer-city')}<br/>{field('footer-country')}</p></div></div></div>;
  if (activeTab === 'codigo') return <p className="text-sm text-slate-600">No modo Código, edite o arquivo completo no painel à esquerda.</p>;
  return <div className="space-y-3">{fields.slice(0, 60).map(item => <div key={item.id} className="bg-white border rounded-xl p-3"><p className="text-xs font-bold text-slate-400">{getLabel(item.section)}</p><p>{item.value}</p></div>)}</div>;
}
