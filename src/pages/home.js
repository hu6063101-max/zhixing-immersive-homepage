import { pageHref } from "../shell.js";

const slides = [
  {
    label: "KNOWING / 知",
    title: ["听过不等于懂", "做到才是真的知道"],
    body: "知识从来不是听见的声音。它必须进入具体行动，才能拥有重量。",
    metric: "001 / ORIGIN",
  },
  {
    label: "ACTION / 行",
    title: ["用行动说话", "用作品说话"],
    body: "先做，上车再说。真实世界的反馈，会比想象更快地告诉你答案。",
    metric: "027 / ACTION",
  },
  {
    label: "COHERENCE / 自洽",
    title: ["各走各的路", "都不内耗"],
    body: "走在自己认为正确的路上，再累也不悔。求仁得仁，才是真满足。",
    metric: "020 / COHERENCE",
  },
  {
    label: "HONESTY / 诚实",
    title: ["颗粒度里", "全是不知道"],
    body: "你说你知道了，为什么没做到？不急着判断，先进入事情本身。",
    metric: "036 / HONESTY",
  },
  {
    label: "FOCUS / 定力",
    title: ["保护注意力", "最贵的资产"],
    body: "真正的自由，是有能力拒绝你不要的生活。注意力必须由自己决定。",
    metric: "069 / FOCUS",
  },
  {
    label: "REVISION / 希望",
    title: ["边走边修正", "所以不用怕"],
    body: "我做不到，是因为我不知道。那我就去知道，然后继续行动。",
    metric: "100 / BEGIN AGAIN",
  },
];

export function renderHome(root, scene) {
  root.innerHTML = `
    <section class="home-stage" aria-label="知行首页">
      <div class="home-hud">
        <span>COORDINATES <b id="home-coordinate">001 / ORIGIN</b></span>
        <span>SCROLL OR DRAG TO EXPLORE</span>
      </div>
      <div class="home-slides">
        ${slides
          .map(
            (slide, index) => `
              <article class="home-slide ${index === 0 ? "is-active" : ""}" data-slide="${index}">
                <p class="home-slide__label">${slide.label}</p>
                <h1>${slide.title.map((line) => `<span>${line}</span>`).join("")}</h1>
                <p class="home-slide__body">${slide.body}</p>
                ${index === slides.length - 1 ? `<a class="hud-link" href="${pageHref("/map")}">进入认知地图 <i>↗</i></a>` : ""}
              </article>`,
          )
          .join("")}
      </div>
      <div class="home-controls">
        <button id="home-prev" type="button">PREV.</button>
        <div class="home-progress"><span id="home-current">01</span><i><b id="home-progress-bar"></b></i><span>06</span></div>
        <button id="home-next" type="button">NEXT</button>
      </div>
      <a class="map-launch" href="${pageHref("/map")}"><span>EXPLORE</span><b>认知地图</b><i>↗</i></a>
    </section>
  `;

  let active = 0;
  let locked = false;
  const elements = [...document.querySelectorAll(".home-slide")];
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    elements.forEach((element, elementIndex) => element.classList.toggle("is-active", elementIndex === active));
    document.querySelector("#home-current").textContent = String(active + 1).padStart(2, "0");
    document.querySelector("#home-progress-bar").style.transform = `scaleX(${(active + 1) / slides.length})`;
    document.querySelector("#home-coordinate").textContent = slides[active].metric;
    scene.setProgress(active / (slides.length - 1));
  };
  document.querySelector("#home-prev").addEventListener("click", () => show(active - 1));
  document.querySelector("#home-next").addEventListener("click", () => show(active + 1));
  window.addEventListener(
    "wheel",
    (event) => {
      if (locked || Math.abs(event.deltaY) < 12) return;
      locked = true;
      show(active + (event.deltaY > 0 ? 1 : -1));
      setTimeout(() => (locked = false), 850);
    },
    { passive: true },
  );
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") show(active + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") show(active - 1);
  });
}

