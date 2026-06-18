export default function App() {
  return (
    <main className="page">
      <section className="hero">
        <div className="eyebrow">Consultoria em planos de saude</div>
        <h1>Encontre o plano de saude ideal para voce, sua familia ou sua empresa</h1>
        <p>
          Compare opcoes de cobertura com atendimento profissional, orientacao clara e suporte durante a contratacao.
        </p>
        <div className="actions">
          <a className="button primary" href="#contato">Solicitar cotacao</a>
          <a className="button secondary" href="/admin">Acessar admin</a>
        </div>
      </section>

      <section className="grid" aria-label="Beneficios">
        <article>
          <h2>Atendimento consultivo</h2>
          <p>Entenda coberturas, redes credenciadas, carencias e condicoes antes de contratar.</p>
        </article>
        <article>
          <h2>Planos para diferentes perfis</h2>
          <p>Opcoes individuais, familiares, MEI e empresariais conforme sua necessidade.</p>
        </article>
        <article>
          <h2>Processo simples</h2>
          <p>Receba orientacao desde a cotacao ate a finalizacao da proposta.</p>
        </article>
      </section>

      <section id="contato" className="contact">
        <h2>Solicite uma cotacao personalizada</h2>
        <p>Fale com um consultor e receba alternativas adequadas ao seu perfil.</p>
        <a className="button primary" href="https://wa.me/5511999999999" target="_blank" rel="noreferrer">
          Falar pelo WhatsApp
        </a>
      </section>

      <footer>
        <a href="/termos-e-condicoes">Termos e Condicoes</a>
        <a href="/politica-de-privacidade">Politica de Privacidade</a>
      </footer>
    </main>
  );
}
