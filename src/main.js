import "./styles.css";
import { createScene } from "./scene.js";
import { createShell } from "./shell.js";
import { resolvePage } from "./site-pages.js";
import { renderHome } from "./pages/home.js";
import { renderMap } from "./pages/map.js";
import { renderContentPage } from "./pages/content-page.js";
import { renderCommitment } from "./pages/commitment.js";

const currentPage = resolvePage(location.pathname);
document.title = `${currentPage.label} | 知行合一`;
document.body.dataset.page = currentPage.id;
const shell = createShell(currentPage);
const scene = createScene(document.querySelector("#webgl"), currentPage.id === "home" ? "home" : currentPage.id === "map" ? "map" : "content");

if (currentPage.id === "home") {
  renderHome(shell.root, scene);
} else if (currentPage.id === "map") {
  renderMap(shell.root, scene);
} else if (currentPage.id === "commitment") {
  renderCommitment(shell.root);
} else {
  renderContentPage(shell.root, currentPage.id);
}
