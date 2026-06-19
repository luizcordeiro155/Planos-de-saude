import { createRoot } from "react-dom/client";
import App from "./App";
import siteContent from "./content/siteContent.json";
import "./index.css";
import "./logo-fix.css";

createRoot(document.getElementById("root")!).render(<App />);

function renderCommercializedOperators() {
  const content = siteContent as any;
  const operators = content?.operators?.commercialized || [];
  if (!Array.isArray(operators) || operators.length === 0) return;
  if (document.querySelector("[data-commercialized-operators]")) return;

  const title = String(content?.operators?.title || "").trim();
  const titleNode = Array.from(document.querySelectorAll("section p")).find((node) => node.textContent?.trim() === title);
  const section = titleNode?.closest("section");
  if (!section || !titleNode) return;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-commercialized-operators", "true");
  wrapper.className = "container mx-auto px-4 md:px-6 mb-10";
  wrapper.innerHTML = `
    <div class="mx-auto max-w-6xl rounded-3xl border border-border bg-card/80 p-5 md:p-7 shadow-sm backdrop-blur">
      <p class="mb-5 text-center text-xs font-black uppercase tracking-[0.18em] text-primary">${content.operators.commercializedTitle || "Operadoras Comercializadas"}</p>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
        ${operators.map((operator: any) => {
          const name = String(operator?.name || "Operadora");
          const logoUrl = String(operator?.logoUrl || "");
          const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
          return `
            <div class="group flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-border bg-white px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
              <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                ${logoUrl ? `<img src="${logoUrl}" alt="${name}" class="h-10 w-10 object-contain" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : ""}
                <span class="${logoUrl ? "hidden" : "flex"} h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">${initials}</span>
              </div>
              <span class="text-xs font-black leading-tight text-foreground/80">${name}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  titleNode.insertAdjacentElement("afterend", wrapper);
}

setTimeout(renderCommercializedOperators, 400);
setTimeout(renderCommercializedOperators, 1200);
