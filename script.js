const tambah = (a, b) => a + b;
const kurang = (a, b) => a - b;
const kali = (a, b) => a * b;
const bagi = (a, b) => b !== 0 ? a / b : showError("Tidak bisa dibagi nol!");

let expression = "";
let memory = 0;
const history = [];

const displayEl = document.getElementById("display");

function updateDisplay() {
  displayEl.innerText = expression || "0";
}

function showError(msg) {
  alert("Error: " + msg);
}

function resetKalkulator() {
  expression = "";
  memory = 0;
  history.length = 0;
  updateMemoryUI();
  renderHistory();
  updateDisplay();
}

function clearEntry() {
  const lastOp = Math.max(
    expression.lastIndexOf("+"),
    expression.lastIndexOf("-"),
    expression.lastIndexOf("×"),
    expression.lastIndexOf("÷")
  );
  expression = lastOp === -1 ? "" : expression.slice(0, lastOp + 1);
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function appendNumber(n) {
  expression += n;
  updateDisplay();
}

function appendOperator(op) {
  if (expression === "" && op !== "-") return;
  if (/[+\-×÷]$/.test(expression))
    expression = expression.slice(0, -1);
  expression += op;
  updateDisplay();
}

function appendDot() {
  const parts = expression.split(/([+\-×÷])/);
  const last = parts[parts.length - 1];
  if (last.includes(".")) return;
  expression += expression === "" || /[+\-×÷]$/.test(expression) ? "0." : "." ;
  updateDisplay();
}

function evaluateExpression() {
  if (!expression) return;

  const safeExpr = expression.replace(/×/g, "*").replace(/÷/g, "/");

  if (!/^[0-9.\s+\-*/()]+$/.test(safeExpr)) {
    showError("Ekspresi tidak valid");
    return;
  }

  try {
    let result = Function(`"use strict"; return (${safeExpr})`)();

    if (!Number.isFinite(result)) {
      showError("Tidak bisa dibagi nol!");
      return;
    }

    addHistory(expression, result);
    expression = String(result);
    updateDisplay();

  } catch {
    showError("Error");
  }
}

const historyListEl = document.getElementById("historyList");

function addHistory(expr, result) {
  history.push({ expr, result });
  if (history.length > 5) history.shift();
  renderHistory();
}

function renderHistory() {
  historyListEl.innerHTML =
    history
      .map(
        h => `<div class="border-b py-1 text-sm">${h.expr} = <b>${h.result}</b></div>`
      )
      .join("") || `<div class="text-slate-400">Belum ada history</div>`;
}

const memValueEl = document.getElementById("memValue");
const memIndicatorEl = document.getElementById("memIndicator");

function updateMemoryUI() {
  memValueEl.innerText = memory;
  memIndicatorEl.innerText = memory !== 0 ? "M" : "MC";
}

document.getElementById("mc").onclick = () => { memory = 0; updateMemoryUI(); };
document.getElementById("mr").onclick = () => { expression = String(memory); updateDisplay(); };
document.getElementById("mPlus").onclick = () => { memory += parseFloat(expression || "0"); updateMemoryUI(); };
document.getElementById("mMinus").onclick = () => { memory -= parseFloat(expression || "0"); updateMemoryUI(); };

document.getElementById("equals").onclick = evaluateExpression;
document.getElementById("ce").onclick = clearEntry;
document.getElementById("c").onclick = resetKalkulator;
document.getElementById("back").onclick = backspace;
document.getElementById("dot").onclick = appendDot;
document.getElementById("clearHistory").onclick = () => { history.length = 0; renderHistory(); };

document.querySelectorAll("[data-num]").forEach(btn =>
  btn.addEventListener("click", () => appendNumber(btn.dataset.num))
);

document.querySelectorAll("[data-op]").forEach(btn =>
  btn.addEventListener("click", () => appendOperator(btn.dataset.op))
);

window.addEventListener("keydown", e => {
  if (/^[0-9]$/.test(e.key)) appendNumber(e.key);
  if ("+-*/".includes(e.key)) {
    const map = { "*": "×", "/": "÷" };
    appendOperator(map[e.key] || e.key);
  }
  if (e.key === "Enter") evaluateExpression();
  if (e.key === "Backspace") backspace();
  if (e.key === "Escape") resetKalkulator();
  if (e.key === ".") appendDot();
  if (e.key === "Delete") clearEntry();
});

const toggle = document.getElementById("modeToggle");
const dot = document.getElementById("toggleDot");

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.remove("mode-pink");
    document.body.classList.add("mode-clean");
    dot.style.transform = "translateX(1.5rem)";
  } else {
    document.body.classList.remove("mode-clean");
    document.body.classList.add("mode-pink");
    dot.style.transform = "translateX(0rem)";
  }
});

updateDisplay();
updateMemoryUI();
renderHistory();
