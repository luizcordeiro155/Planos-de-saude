import siteContent from '@/content/siteContent.json';

const content = siteContent as any;

export default function Terms() {
  const brand = content.brand?.name || 'SW Seguros';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <a href="/" className="mb-8 inline-flex rounded-full border border-border px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5">← Voltar ao site</a>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">Termos legais</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">Termos e Condições</h1>
          <p className="mt-4 text-muted-foreground">Última atualização: 19/06/2026</p>

          <div className="mt-10 space-y-8 leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">1. Aceitação dos termos</h2>
              <p>Ao acessar e utilizar este site, você concorda com estes Termos e Condições. Caso não concorde com algum ponto, recomendamos que interrompa o uso do site.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">2. Finalidade do site</h2>
              <p>O site da {brand} tem finalidade informativa e comercial, permitindo que visitantes conheçam serviços de consultoria e solicitem cotação de planos de saúde por meio de canais de atendimento, como WhatsApp, telefone ou e-mail.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">3. Informações e cotações</h2>
              <p>As informações apresentadas no site são fornecidas para orientação inicial. Valores, coberturas, prazos, carências, condições de contratação e disponibilidade podem variar conforme operadora, região, perfil do cliente, tipo de plano e regras vigentes no momento da contratação.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">4. Responsabilidades do usuário</h2>
              <p>O usuário se compromete a fornecer informações verdadeiras, completas e atualizadas ao solicitar contato, cotação ou atendimento. Dados incorretos podem comprometer a análise e a apresentação de opções adequadas.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">5. Responsabilidade da corretora</h2>
              <p>A {brand} atua como intermediadora e consultora na busca por opções de planos de saúde. A contratação final, aprovação cadastral, cobrança, rede credenciada, cobertura e execução dos serviços são de responsabilidade da operadora escolhida, conforme contrato próprio.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">6. Propriedade intelectual</h2>
              <p>Textos, identidade visual, layout, elementos gráficos e demais conteúdos deste site são protegidos por direitos autorais e não podem ser copiados, reproduzidos ou distribuídos sem autorização prévia.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">7. Alterações nos termos</h2>
              <p>Estes Termos e Condições podem ser atualizados a qualquer momento para refletir melhorias no site, mudanças operacionais ou adequações legais. A versão publicada nesta página será sempre a versão vigente.</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">8. Contato</h2>
              <p>Para dúvidas sobre estes termos, entre em contato pelo e-mail {content.brand?.email || 'contato@swseguros.com.br'} ou pelo telefone {content.brand?.phoneDisplay || '(31) 9365-9875'}.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
