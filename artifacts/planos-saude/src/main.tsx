import { createRoot } from "react-dom/client";
import App from "./App";
import siteContent from "./content/siteContent.json";
import "./index.css";
import "./logo-fix.css";

createRoot(document.getElementById("root")!).render(<App />);

function uniqueByName(items: any[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const name = typeof item === "string" ? item : String(item?.name || "");
    const key = name.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function operatorName(item: any) {
  return typeof item === "string" ? item : String(item?.name || "Operadora");
}

function operatorLogo(item: any) {
  return typeof item === "string" ? "" : String(item?.logoUrl || item?.imageDataUrl || "");
}

function operatorInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function ensureOperatorCarouselStyle() {
  if (document.querySelector("#operator-carousel-style")) return;
  const style = document.createElement("style");
  style.id = "operator-carousel-style";
  style.textContent = `
    @keyframes swOperatorMarquee {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
    .sw-operator-section {
      padding: 48px 0;
      overflow: hidden;
      border-bottom: 1px solid hsl(var(--border));
      background: hsl(var(--background));
    }
    .sw-operator-marquee {
      position: relative;
      overflow: hidden;
      width: 100%;
      margin-top: 22px;
      mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
    }
    .sw-operator-track {
      display: flex;
      align-items: center;
      gap: clamp(28px, 5vw, 72px);
      width: max-content;
      animation: swOperatorMarquee 32s linear infinite;
      will-change: transform;
      padding: 8px 0;
    }
    .sw-operator-marquee:hover .sw-operator-track {
      animation-play-state: paused;
    }
    .sw-operator-item {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-width: max-content;
      color: hsl(var(--muted-foreground));
      opacity: .45;
      font-family: var(--font-display, inherit);
      font-size: clamp(1.15rem, 1rem + 1vw, 1.75rem);
      font-weight: 900;
      letter-spacing: -0.02em;
      transition: opacity .25s ease, transform .25s ease, color .25s ease;
    }
    .sw-operator-item:hover {
      opacity: .95;
      transform: translateY(-2px);
      color: hsl(var(--primary));
    }
    .sw-operator-logo {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      object-fit: contain;
      background: white;
      padding: 6px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, .08);
      border: 1px solid hsl(var(--border));
    }
    .sw-operator-initials {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: hsl(var(--primary) / .08);
      color: hsl(var(--primary));
      font-size: .8rem;
      font-weight: 900;
      border: 1px solid hsl(var(--primary) / .14);
    }
    @media (max-width: 640px) {
      .sw-operator-section { padding: 34px 0; }
      .sw-operator-marquee { margin-top: 18px; mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent); }
      .sw-operator-track { gap: 26px; animation-duration: 24s; }
      .sw-operator-item { font-size: 1.1rem; gap: 9px; }
      .sw-operator-logo, .sw-operator-initials { width: 32px; height: 32px; border-radius: 10px; }
    }
  `;
  document.head.appendChild(style);
}

function renderOperatorBrandCarousel() {
  const content = siteContent as any;
  const rawItems = Array.isArray(content?.operators?.commercialized) && content.operators.commercialized.length > 0
    ? content.operators.commercialized
    : content?.operators?.items || [];
  const items = uniqueByName(rawItems);
  if (items.length === 0) return;

  ensureOperatorCarouselStyle();

  const title = String(content?.operators?.title || "").trim();
  const titleNode = Array.from(document.querySelectorAll("section p")).find((node) => node.textContent?.trim() === title);
  const section = titleNode?.closest("section") as HTMLElement | null;
  if (!section || !titleNode) return;

  section.className = "sw-operator-section";
  section.innerHTML = `
    <div class="container mx-auto px-4 md:px-6">
      <p class="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">${title || "Trabalhamos com as maiores operadoras de saúde do Brasil"}</p>
      <div class="sw-operator-marquee" aria-label="Operadoras comercializadas">
        <div class="sw-operator-track">
          ${items.map((item) => {
            const name = operatorName(item);
            const logo = operatorLogo(item);
            return `
              <span class="sw-operator-item">
                ${logo ? `<img src="${logo}" alt="${name}" class="sw-operator-logo" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />` : ""}
                <span class="sw-operator-initials" style="${logo ? "display:none" : ""}">${operatorInitials(name)}</span>
                <span>${name}</span>
              </span>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderCommercializedOperators() {
  // Mantido por compatibilidade, mas agora a faixa principal ja exibe o carrossel funcional.
  renderOperatorBrandCarousel();
}

function renderLegalFooterLinks() {
  if (document.querySelector("[data-legal-footer-links]")) return;
  const footer = document.querySelector("footer");
  if (!footer) return;

  const bottom = footer.querySelector(".border-t");
  if (!bottom) return;

  const links = document.createElement("div");
  links.setAttribute("data-legal-footer-links", "true");
  links.className = "flex flex-wrap gap-4 text-sm font-semibold text-white/60";
  links.innerHTML = `
    <a href="/termos-e-condicoes" class="hover:text-white transition-colors">Termos e Condições</a>
    <span class="text-white/20">|</span>
    <a href="/politica-de-privacidade" class="hover:text-white transition-colors">Política de Privacidade</a>
  `;

  bottom.appendChild(links);
}

setTimeout(renderCommercializedOperators, 250);
setTimeout(renderCommercializedOperators, 900);
setTimeout(renderCommercializedOperators, 1800);
setTimeout(renderLegalFooterLinks, 500);
setTimeout(renderLegalFooterLinks, 1400);
