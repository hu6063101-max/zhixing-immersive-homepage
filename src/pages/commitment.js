import { createCommitmentStore } from "../commitment-store.js";
import { pageHref } from "../shell.js";

export function renderCommitment(root) {
  const store = createCommitmentStore(localStorage);
  root.innerHTML = `
    <section class="commitment-page">
      <div class="commitment-page__intro">
        <p>THE COMMITMENT / 行动承诺</p>
        <h1>把想法写下来，<br>然后让它发生。</h1>
        <span>你的承诺只保存在当前浏览器，不会发送到任何地方。</span>
      </div>
      <form class="commitment-form" id="commitment-form">
        <label><span>01 / 我真正想完成什么？</span><textarea id="commitment-input" required maxlength="240" placeholder="写下一件具体、可验证、有日期的事情">${store.read()}</textarea></label>
        <div><span id="commitment-status">LOCAL STORAGE / PRIVATE</span><button type="submit">保存行动承诺 <i>↗</i></button></div>
      </form>
      <div class="commitment-principle"><span>092</span><p>说话有代价，所以才有分量。</p><a href="${pageHref("/principles")}">原则与边界 ↗</a></div>
    </section>
  `;
  document.querySelector("#commitment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = store.save(document.querySelector("#commitment-input").value);
    document.querySelector("#commitment-status").textContent = value ? "SAVED / 说到做到" : "请输入承诺";
  });
}

