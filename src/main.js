import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";
import { createAudioController } from "./audio-controller.js";
import { quotes, quotesForTheme, themes } from "./content.js";
import { enterExperience } from "./enter-experience.js";
import { createScene } from "./scene.js";

gsap.registerPlugin(ScrollTrigger);

const chapters = document.querySelector("#chapters");
const archiveGrid = document.querySelector("#archive-grid");
const loader = document.querySelector("#loader");
const enterButton = document.querySelector("#enter-button");
const soundButton = document.querySelector("#sound-button");
const progressLine = document.querySelector("#progress-line");
const progressNumber = document.querySelector("#progress-number");
const audio = document.querySelector("#soundtrack");
const scene = createScene(document.querySelector("#webgl"));
const audioController = createAudioController(audio, { volume: 0.55 });

function chapterTemplate(theme, index) {
  const themeQuotes = quotesForTheme(theme.id);
  const lead = themeQuotes[0];
  const quoteCards = themeQuotes
    .map(
      (quote, quoteIndex) => `
        <article class="quote-card reveal ${quoteIndex === 0 ? "quote-card--lead" : ""}">
          <span class="quote-card__number">${String(quote.number).padStart(3, "0")}</span>
          <p>${quote.text}</p>
          <span class="quote-card__mark">知 / 行</span>
        </article>
      `,
    )
    .join("");

  return `
    <section class="chapter" id="${theme.id}" data-chapter="${index + 1}" style="--accent:${theme.accent}">
      <div class="chapter__glow" aria-hidden="true"></div>
      <div class="chapter__intro">
        <div class="chapter__meta reveal">
          <span>${theme.eyebrow}</span>
          <span>${theme.index} / 12</span>
        </div>
        <p class="chapter__range reveal">${String(theme.range[0]).padStart(3, "0")} — ${String(theme.range[1]).padStart(3, "0")}</p>
        <h2 class="chapter__title reveal">${theme.title}</h2>
        <p class="chapter__statement reveal">${theme.statement}</p>
        <div class="chapter__lead reveal">
          <span>${String(lead.number).padStart(2, "0")}</span>
          <p>${lead.text}</p>
        </div>
      </div>
      <div class="quote-grid">${quoteCards}</div>
    </section>
  `;
}

chapters.innerHTML = themes.map(chapterTemplate).join("");

archiveGrid.innerHTML = themes
  .map(
    (theme) => `
      <a class="archive-theme reveal" href="#${theme.id}" style="--accent:${theme.accent}">
        <span class="archive-theme__index">${theme.index}</span>
        <span class="archive-theme__title">${theme.title}</span>
        <span class="archive-theme__range">${theme.range[0]}—${theme.range[1]}</span>
      </a>
    `,
  )
  .join("");

function initializeAnimations() {
  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true,
        },
      },
    );
  });

  gsap.utils.toArray(".chapter").forEach((chapter) => {
    const intro = chapter.querySelector(".chapter__intro");
    gsap.to(intro, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: chapter,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });
  });
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  progressLine.style.transform = `scaleY(${progress})`;

  const chapterElements = [...document.querySelectorAll("[data-chapter]")];
  const current = chapterElements.reduce((active, chapter) => {
    return chapter.getBoundingClientRect().top < window.innerHeight * 0.55 ? chapter : active;
  }, chapterElements[0]);
  progressNumber.textContent = String(current?.dataset.chapter ?? 1).padStart(2, "0");
}

audioController.subscribe(({ started, muted }) => {
  soundButton.classList.toggle("is-muted", muted);
  soundButton.classList.toggle("is-playing", started && !muted);
  soundButton.querySelector(".sound-button__label").textContent = muted ? "SOUND OFF" : "SOUND ON";
});

enterButton.addEventListener("click", () => {
  enterExperience({
    startAudio: () => audioController.start(),
    onAudioError: () => soundButton.classList.add("is-muted"),
    onEnter: () => {
      document.body.classList.add("is-entered");
      scene.setEntered(true);
      gsap.to(loader, {
        opacity: 0,
        duration: 1.1,
        ease: "power3.inOut",
        onComplete: () => loader.remove(),
      });
    },
  });
});

soundButton.addEventListener("click", async () => {
  if (!audioController.getState().started) {
    try {
      await audioController.start();
    } catch {
      return;
    }
  } else {
    audioController.toggleMute();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
  initializeAnimations();
  updateProgress();
});

const cursor = document.querySelector(".cursor-orbit");
window.addEventListener(
  "pointermove",
  (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  },
  { passive: true },
);

console.info(`知行合一：已载入 ${quotes.length} 条文字。`);
