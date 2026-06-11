import { quotesForTheme, themes } from "../content.js";
import { contentPages } from "../site-pages.js";
import { pageHref } from "../shell.js";

export function renderContentPage(root, pageId) {
  const page = contentPages[pageId];
  const selectedThemes = page.themeIds.map((id) => themes.find((theme) => theme.id === id)).filter(Boolean);
  const selectedQuotes = selectedThemes.flatMap((theme) => quotesForTheme(theme.id)).slice(0, 18);

  root.innerHTML = `
    <div class="content-page">
      <section class="content-hero">
        <div class="content-hero__grid" aria-hidden="true"></div>
        <p>${page.eyebrow}</p>
        <h1>${page.title}</h1>
        <div class="content-hero__foot"><span>ZHIXING SYSTEM</span><b>${page.intro}</b><span>SCROLL ↓</span></div>
      </section>
      <section class="data-panel">
        <div class="section-kicker"><span>INFORMATION DATA</span><span>[${page.stats.length}]</span></div>
        <div class="data-panel__grid">${page.stats.map(([value, label]) => `<article><strong>${value}</strong><p>${label}</p></article>`).join("")}</div>
      </section>
      <section class="district-section">
        <div class="section-kicker"><span>THEME DISTRICTS</span><span>[${selectedThemes.length}]</span></div>
        ${selectedThemes
          .map(
            (theme, index) => `
              <article class="district-card" style="--theme:${theme.accent}">
                <span>${String(index + 1).padStart(3, "0")}</span>
                <h2>${theme.title}</h2>
                <p>${theme.statement}</p>
                <b>${theme.range[0]}—${theme.range[1]}</b>
              </article>`,
          )
          .join("")}
      </section>
      <section class="quote-ledger">
        <div class="section-kicker"><span>COGNITION LEDGER</span><span>[${selectedQuotes.length}]</span></div>
        ${selectedQuotes.map((quote) => `<article><span>${String(quote.number).padStart(3, "0")}</span><p>${quote.text}</p><i>↗</i></article>`).join("")}
      </section>
      <section class="page-cta"><p>从文字走向坐标</p><h2>进入认知地图，<br>打开具体的一句话。</h2><a href="${pageHref("/map")}">EXPLORE MAP <span>↗</span></a></section>
    </div>
  `;
}

