function initKanjiPage({ items, tableBodyId = "tableBody", toggleAllBtnId = "toggleAllBtn" }) {
  const tableBody = document.getElementById(tableBodyId);
  const toggleAllBtn = document.getElementById(toggleAllBtnId);

  function createRow(item, index){
    const c1 = document.createElement("div");
    c1.className = "cell";
    const k = document.createElement("div");
    k.className = "kanji";
    k.textContent = item.kanji;
    c1.appendChild(k);

    const c2 = document.createElement("div");
    c2.className = "cell";
    const y = document.createElement("div");
    y.className = "yomi";
    y.textContent = item.yomi;
    y.hidden = true; // 完全非表示
    y.dataset.index = String(index);
    c2.appendChild(y);

    const c3 = document.createElement("div");
    c3.className = "cell checkwrap";
    const label = document.createElement("label");
    label.className = "cb";
    label.setAttribute("aria-label", `${item.kanji} の読みを表示`);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.index = String(index);
    const knob = document.createElement("span");
    knob.className = "knob";
    label.appendChild(input);
    label.appendChild(knob);
    c3.appendChild(label);

    input.addEventListener("change", () => {
      const idx = input.dataset.index;
      const target = tableBody.querySelector(`.yomi[data-index="${idx}"]`);
      if (!target) return;
      target.hidden = !input.checked;
      syncToggleAllButton();
    });

    tableBody.appendChild(c1);
    tableBody.appendChild(c2);
    tableBody.appendChild(c3);
  }

  function render(){
    tableBody.innerHTML = "";
    items.forEach((item, i) => createRow(item, i));
    syncToggleAllButton();
  }

  function setAll(show){
    const inputs = tableBody.querySelectorAll('input[type="checkbox"]');
    inputs.forEach(input => {
      input.checked = show;
      const idx = input.dataset.index;
      const target = tableBody.querySelector(`.yomi[data-index="${idx}"]`);
      if (target) target.hidden = !show;
    });
    syncToggleAllButton();
  }

  function syncToggleAllButton(){
    const inputs = [...tableBody.querySelectorAll('input[type="checkbox"]')];
    const allChecked = inputs.length > 0 && inputs.every(i => i.checked);
    toggleAllBtn.textContent = allChecked ? "全部の読みを非表示" : "全部の読みを表示";
    toggleAllBtn.dataset.mode = allChecked ? "hide" : "show";
  }

  toggleAllBtn.addEventListener("click", () => {
    const mode = toggleAllBtn.dataset.mode || "show";
    if (mode === "show") setAll(true);
    else setAll(false);
  });

  render();
}
