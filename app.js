function initKanjiPage({
  items,
  tableBodyId = "tableBody",
  toggleAllBtnId = "toggleAllBtn",
  shuffleBtnId = "shuffleBtn"
}) {
  const tableBody = document.getElementById(tableBodyId);
  const toggleAllBtn = document.getElementById(toggleAllBtnId);
  const shuffleBtn = document.getElementById(shuffleBtnId);

  // 表示状態（チェック）を「元のindex」で保持（シャッフルしても維持）
  const checkedById = new Array(items.length).fill(false);

  // 現在の表示順（items の index の並び）
  let order = items.map((_, i) => i);

  function shuffleArray(arr) {
    // Fisher–Yates
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createRow(itemIndex){
    const item = items[itemIndex];

    // 1列目: 漢字
    const c1 = document.createElement("div");
    c1.className = "cell";
    const k = document.createElement("div");
    k.className = "kanji";
    k.textContent = item.kanji;
    c1.appendChild(k);

    // 2列目: 読み（デフォルト完全非表示）
    const c2 = document.createElement("div");
    c2.className = "cell";
    const y = document.createElement("div");
    y.className = "yomi";
    y.textContent = item.yomi;

    // 元のID（itemIndex）で管理
    y.hidden = !checkedById[itemIndex];
    y.dataset.id = String(itemIndex);

    c2.appendChild(y);

    // 3列目: チェックボックス
    const c3 = document.createElement("div");
    c3.className = "cell checkwrap";
    const label = document.createElement("label");
    label.className = "cb";
    label.setAttribute("aria-label", `${item.kanji} の読みを表示`);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checkedById[itemIndex];
    input.dataset.id = String(itemIndex);
    const knob = document.createElement("span");
    knob.className = "knob";
    label.appendChild(input);
    label.appendChild(knob);
    c3.appendChild(label);

    input.addEventListener("change", () => {
      const id = Number(input.dataset.id);
      checkedById[id] = input.checked;

      const target = tableBody.querySelector(`.yomi[data-id="${id}"]`);
      if (target) target.hidden = !input.checked;

      syncToggleAllButton();
    });

    tableBody.appendChild(c1);
    tableBody.appendChild(c2);
    tableBody.appendChild(c3);
  }

  function render(){
    tableBody.innerHTML = "";
    order.forEach((id) => createRow(id));
    syncToggleAllButton();
  }

  function setAll(show){
    for (let i = 0; i < checkedById.length; i++) checkedById[i] = show;
    render();
  }

  function syncToggleAllButton(){
    const allChecked = checkedById.length > 0 && checkedById.every(v => v);
    toggleAllBtn.textContent = allChecked ? "すべての読みを非表示" : "すべての読みを表示";
    toggleAllBtn.dataset.mode = allChecked ? "hide" : "show";
  }

  toggleAllBtn.addEventListener("click", () => {
    const mode = toggleAllBtn.dataset.mode || "show";
    if (mode === "show") setAll(true);
    else setAll(false);
  });

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      order = shuffleArray(order.slice()); // 新しい順序を作る
      render();
    });
  }

  render();
}
