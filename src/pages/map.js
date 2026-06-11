import { quotes, themes } from "../content.js";
import { createMapPoints } from "../map-data.js";
import { createMapState } from "../map-state.js";

export function renderMap(root, scene) {
  const points = createMapPoints(quotes, themes);
  let state = createMapState(quotes);

  root.innerHTML = `
    <section class="cognition-map">
      <div class="map-topbar">
        <div><span>COGNITION MAP</span><b>100 条认知坐标</b></div>
        <label class="map-search"><span>SEARCH</span><input id="map-search" type="search" placeholder="搜索完整句子"></label>
      </div>
      <aside class="map-districts">
        <p>THEME DISTRICTS <span>[12]</span></p>
        <button class="is-active" data-theme="all" type="button"><i></i>全部坐标 <span>100</span></button>
        ${themes
          .map(
            (theme) => `<button data-theme="${theme.id}" type="button" style="--theme:${theme.accent}"><i></i>${theme.title}<span>${theme.range[1] - theme.range[0] + 1}</span></button>`,
          )
          .join("")}
      </aside>
      <div class="map-surface" id="map-surface">
        <div class="map-grid" aria-hidden="true"></div>
        ${themes
          .map(
            (theme, index) => `<div class="district-label" style="--x:${14 + (index % 4) * 24}%;--y:${19 + Math.floor(index / 4) * 30}%;--theme:${theme.accent}"><span>${theme.index}</span><b>${theme.title}</b></div>`,
          )
          .join("")}
        <div class="map-points" id="map-points"></div>
        <div class="map-note" id="map-note" aria-live="polite"></div>
      </div>
      <div class="map-footer">
        <span>CLICK COORDINATES TO EXPLORE</span>
        <div><span>ZOOM</span><b>1.0×</b><span>100 KM</span></div>
        <span id="map-result">100 COORDINATES</span>
      </div>
      <button class="map-list-toggle" id="map-list-toggle" type="button">PROJECT LIST <span>[100]</span></button>
      <aside class="map-list" id="map-list"><div class="map-list__head"><b>金句坐标目录</b><button id="map-list-close" type="button">CLOSE ×</button></div><div id="map-list-body"></div></aside>
    </section>
  `;

  const pointsRoot = document.querySelector("#map-points");
  const note = document.querySelector("#map-note");
  const list = document.querySelector("#map-list");
  const listBody = document.querySelector("#map-list-body");
  const pointByNumber = new Map(points.map((point) => [point.number, point]));

  const renderNote = () => {
    if (!state.current) {
      note.classList.remove("is-open");
      note.innerHTML = "";
      return;
    }
    const point = pointByNumber.get(state.current.number);
    const theme = themes.find((item) => item.id === state.current.theme);
    note.style.setProperty("--x", `${point.x}%`);
    note.style.setProperty("--y", `${point.y}%`);
    note.style.setProperty("--theme", theme.accent);
    note.innerHTML = `
      <div class="map-note__top"><span>${String(state.current.number).padStart(3, "0")} / ${theme.title}</span><button data-note="close" type="button">×</button></div>
      <p>${state.current.text}</p>
      <div class="map-note__bottom"><button data-note="prev" type="button">PREV.</button><span>知 / 行</span><button data-note="next" type="button">NEXT</button></div>`;
    note.classList.add("is-open");
  };

  const render = () => {
    const visibleNumbers = new Set(state.visible.map((quote) => quote.number));
    pointsRoot.innerHTML = points
      .filter((point) => visibleNumbers.has(point.number))
      .map((point) => {
        const theme = themes.find((item) => item.id === point.theme);
        return `<button class="map-point ${state.current?.number === point.number ? "is-active" : ""}" data-number="${point.number}" aria-label="打开第 ${point.number} 条金句" style="--x:${point.x}%;--y:${point.y}%;--z:${point.elevation};--theme:${theme.accent}"><i></i><span>${String(point.number).padStart(3, "0")}</span></button>`;
      })
      .join("");
    listBody.innerHTML = state.visible
      .map((quote) => `<button data-number="${quote.number}" type="button"><span>${String(quote.number).padStart(3, "0")}</span><p>${quote.text}</p></button>`)
      .join("");
    document.querySelector("#map-result").textContent = `${String(state.visible.length).padStart(3, "0")} COORDINATES`;
    renderNote();
  };

  pointsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-number]");
    if (!button) return;
    state = state.open(Number(button.dataset.number));
    render();
  });
  listBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-number]");
    if (!button) return;
    state = state.open(Number(button.dataset.number));
    list.classList.remove("is-open");
    render();
  });
  note.addEventListener("click", (event) => {
    const action = event.target.closest("[data-note]")?.dataset.note;
    if (!action) return;
    state = action === "close" ? state.close() : action === "next" ? state.next() : state.previous();
    render();
  });
  document.querySelector(".map-districts").addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme]");
    if (!button) return;
    document.querySelectorAll(".map-districts button").forEach((item) => item.classList.toggle("is-active", item === button));
    state = state.filterTheme(button.dataset.theme);
    render();
    scene.setProgress(Math.max(0, themes.findIndex((theme) => theme.id === button.dataset.theme)) / 11);
  });
  document.querySelector("#map-search").addEventListener("input", (event) => {
    state = state.search(event.target.value);
    render();
  });
  document.querySelector("#map-list-toggle").addEventListener("click", () => list.classList.add("is-open"));
  document.querySelector("#map-list-close").addEventListener("click", () => list.classList.remove("is-open"));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      state = state.close();
      list.classList.remove("is-open");
      render();
    }
  });
  render();
}

