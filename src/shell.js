import { createAudioController } from "./audio-controller.js";
import { navigationPages } from "./site-pages.js";

function basePrefix() {
  return location.pathname.includes("/zhixing-immersive-homepage/")
    ? "/zhixing-immersive-homepage"
    : "";
}

export function pageHref(path) {
  return `${basePrefix()}${path === "/" ? "/" : `${path}/`}`;
}

export function createShell(currentPage) {
  const audio = document.querySelector("#soundtrack");
  const audioController = createAudioController(audio, { volume: 0.5 });
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="site-loader" id="site-loader">
      <div class="loader-grid" aria-hidden="true"></div>
      <div class="loader-top"><span>ZHIXING / KNOWING IS DOING</span><span id="load-percent">000%</span></div>
      <div class="loader-center">
        <div class="loader-cube" aria-hidden="true"><i></i><i></i><i></i></div>
        <p>LOADING COGNITION</p>
        <button class="loader-enter" id="loader-enter" type="button">进入认知坐标</button>
      </div>
      <div class="loader-bottom"><span>THOUGHT</span><span class="loader-track"><i></i></span><span>ACTION</span></div>
    </div>
    <header class="site-nav">
      <a class="site-logo" href="${pageHref("/")}">
        <span class="site-logo__mark">知</span>
        <span><b>知行合一</b><small>KNOWING IS DOING</small></span>
      </a>
      <div class="site-nav__right">
        <button class="sound-toggle" id="sound-toggle" type="button" aria-label="切换背景音乐">
          <span class="sound-wave"><i></i><i></i><i></i><i></i></span><span>SOUND ON</span>
        </button>
        <button class="menu-toggle" id="menu-toggle" type="button" aria-label="打开菜单"><span>MENU</span><i></i></button>
      </div>
    </header>
    <aside class="route-code"><span>${currentPage.code}</span><i></i><span>08</span></aside>
    <div class="menu-overlay" id="menu-overlay" aria-hidden="true">
      <div class="menu-orbit" aria-hidden="true"></div>
      <div class="menu-overlay__top"><span>COGNITION NETWORK</span><button id="menu-close" type="button">CLOSE ×</button></div>
      <nav class="menu-links">
        ${navigationPages
          .map(
            (page) => `
              <a href="${pageHref(page.path)}" class="${page.id === currentPage.id ? "is-current" : ""}">
                <span>${page.code}</span><b>${page.label}</b><i>↗</i>
              </a>`,
          )
          .join("")}
      </nav>
      <div class="menu-overlay__bottom"><span>100 COORDINATES</span><span>12 DISTRICTS</span><span>2026</span></div>
    </div>
    <main id="page-root"></main>
  `;

  const loader = document.querySelector("#site-loader");
  const enter = document.querySelector("#loader-enter");
  const percent = document.querySelector("#load-percent");
  const menu = document.querySelector("#menu-overlay");
  const soundToggle = document.querySelector("#sound-toggle");
  let value = 0;
  const timer = setInterval(() => {
    value = Math.min(100, value + Math.ceil((100 - value) * 0.16) + 1);
    percent.textContent = `${String(value).padStart(3, "0")}%`;
    if (value >= 100) {
      clearInterval(timer);
      loader.classList.add("is-ready");
    }
  }, 65);

  const enterSite = () => {
    loader.classList.add("is-hidden");
    document.body.classList.add("site-entered");
    audioController.start().catch(() => soundToggle.classList.add("is-muted"));
    setTimeout(() => loader.remove(), 900);
  };
  enter.addEventListener("click", enterSite);

  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
  };
  document.querySelector("#menu-toggle").addEventListener("click", () => setMenu(true));
  document.querySelector("#menu-close").addEventListener("click", () => setMenu(false));
  window.addEventListener("keydown", (event) => event.key === "Escape" && setMenu(false));

  audioController.subscribe(({ muted, started }) => {
    soundToggle.classList.toggle("is-muted", muted);
    soundToggle.classList.toggle("is-playing", started && !muted);
    soundToggle.lastElementChild.textContent = muted ? "SOUND OFF" : "SOUND ON";
  });
  soundToggle.addEventListener("click", async () => {
    if (!audioController.getState().started) {
      await audioController.start().catch(() => {});
    } else {
      audioController.toggleMute();
    }
  });

  return { root: document.querySelector("#page-root"), audioController };
}

