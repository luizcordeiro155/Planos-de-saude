import siteContent from '@/content/siteContent.json';

const content = siteContent as any;

export default function Privacy() {
  const brand = content.brand?.name || 'SW Seguros';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <a href="/" className="mb-8 inline-flex rounded-full border border-border px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5">← Voltar ao site</a>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">Privacidade</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">Política de Privacidade</h1>
          <p className="mt-4 text-muted-foreground">Última atualização: 19/06/2026</p>

          <div className="mt-10 space-y-8 leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">1. Compromisso com a privacidade</h2>
              <p>A {brand} respeita a sua privacidade e se compromete a tratar seus dados pessoais com segurança, transparência e responsabilidade, conforme a legislação aplicável, incluindo a Lei Geral de Proteção de Dados, LGPD.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">2. Dados que podemos coletar</h2>
              <p>Podemos coletar informações fornecidas voluntariamente pelo usuário, como nome, telefone, cidade, tipo de plano desejado e demais dados enviados por formulário, WhatsApp, telefone ou e-mail para fins de atendimento e cotação.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">3. Como usamos seus dados</h2>
              <p>Os dados são utilizados para entrar em contato, compreender seu perfil, preparar cotações, apresentar opções de planos, prestar suporte comercial e melhorar a experiência de atendimento.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">4. Compartilhamento de dados</h2>
              <p>Quando necessário para a cotação ou contratação, informações podem ser compartilhadas com operadoras de saúde, plataformas de atendimento ou prestadores necessários à execução do serviço. Não vendemos dados pessoais.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">5. Segurança das informações</h2>
              <p>Adotamos medidas razoáveis para proteger os dados contra acesso não autorizado, perda, alteração ou divulgação indevida. Apesar disso, nenhum sistema é totalmente imune a riscos, especialmente em comunicações realizadas pela internet.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">6. Cookies e tecnologias similares</h2>
              <p>O site pode utilizar cookies e tecnologias similares para funcionamento, análise de navegação, melhoria de desempenho e experiência do usuário. O visitante pode ajustar as permissões de cookies diretamente no navegador.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">7. Direitos do titular</h2>
              <p>Você pode solicitar confirmação de tratamento, acesso, correção, exclusão, portabilidade ou informações sobre seus dados pessoais, conforme os direitos previstos na LGPD.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">8. Retenção dos dados</h2>
              <p>Os dados são mantidos pelo tempo necessário para atendimento, cumprimento de obrigações legais, exercício regular de direitos ou continuidade do relacionamento comercial, quando aplicável.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">9. Contato</h2>
              <p>Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelo e-mail {content.brand?.email || 'contato@swseguros.com.br'} ou pelo telefone {content.brand?.phoneDisplay || '(31) 9365-9875'}.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
