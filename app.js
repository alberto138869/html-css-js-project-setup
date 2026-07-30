const countElement = document.getElementById("count");
const incrementButton = document.getElementById("increment");
const decrementButton = document.getElementById("decrement");
const resetButton = document.getElementById("reset");
const messageInput = document.getElementById("messageInput");
const messageOutput = document.getElementById("messageOutput");
const themeButton = document.getElementById("themeButton");

let count = 0;

function updateCount() {
  countElement.textContent = count;
  countElement.style.color = count === 0 ? "#4338ca" : count > 0 ? "#22c55e" : "#ef4444";
}

function changeTheme() {
  const backgroundColors = [
    "#f8fafc",
    "#fff7ed",
    "#eff6ff",
    "#ecfdf5",
    "#fdf2f8",
  ];
  const accentColors = ["#6366f1", "#d946ef", "#10b981", "#f97316", "#0ea5e9"];
  const randomIndex = Math.floor(Math.random() * backgroundColors.length);

  document.body.style.background = `linear-gradient(180deg, ${backgroundColors[randomIndex]} 0%, #f9fafb 100%)`;
  document.documentElement.style.setProperty("--brand", accentColors[randomIndex]);
  document.documentElement.style.setProperty("--brand-dark", accentColors[randomIndex]);
}

incrementButton.addEventListener("click", () => {
  count += 1;
  updateCount();
});

decrementButton.addEventListener("click", () => {
  count -= 1;
  updateCount();
});

resetButton.addEventListener("click", () => {
  count = 0;
  updateCount();
});

messageInput.addEventListener("input", () => {
  const message = messageInput.value.trim();
  messageOutput.textContent = message || "Sua mensagem aparecerá aqui.";
});

themeButton.addEventListener("click", changeTheme);

updateCount();

/* --- Calculadora científica --- */
const calcDisplay = document.getElementById("calcDisplay");
const calcButtons = document.querySelectorAll(".calc-button");
const calcClear = document.getElementById("calcClear");
const calcDel = document.getElementById("calcDel");
const calcEquals = document.getElementById("calcEquals");

function appendToCalc(v) {
  // se display mostrar '0' ou 'Erro', substitui
  if (calcDisplay.value === "0" || calcDisplay.value === "Erro") calcDisplay.value = "";
  calcDisplay.value += v;
}

calcButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const v = btn.dataset.value || btn.textContent;
    appendToCalc(v);
  });
});

calcClear.addEventListener("click", () => { calcDisplay.value = ""; });
calcDel.addEventListener("click", () => { calcDisplay.value = calcDisplay.value.slice(0, -1); });
calcEquals.addEventListener("click", evaluateCalc);

// também permite usar Enter no teclado quando o foco não está no input (ou em dispositivos móveis)
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    evaluateCalc();
  }
});

function evaluateCalc() {
  let expr = calcDisplay.value;
  if (!expr || expr.trim() === "") return;

  // Substituições para transformar em expressão JS usando Math
  expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**");
  expr = expr.replace(/√\(/g, "Math.sqrt(");
  expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
  expr = expr.replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(").replace(/tan\(/g, "Math.tan(");
  expr = expr.replace(/ln\(/g, "Math.log(");
  // log -> base 10
  expr = expr.replace(/log\(/g, "(Math.log10?Math.log10:(x=>Math.log(x)/Math.LN10))(");
  expr = expr.replace(/exp\(/g, "Math.exp(");
  expr = expr.replace(/pi/gi, "Math.PI");
  expr = expr.replace(/e(?![a-z0-9_])/gi, "Math.E");

  // Segurança básica: permitir apenas caracteres razoáveis
  const safeRe = /^[0-9+\-*/().,\sMathPIElnsgctaoxpwribde*]+$/i;
  // nota: a regex acima é permissiva para permitir nomes Math.*, parênteses, operadores e números
  if (!safeRe.test(expr)) {
    calcDisplay.value = "Erro";
    return;
  }

  try {
    // Avalia com Function para manter escopo limpo
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result === 'number' && isFinite(result)) {
      calcDisplay.value = String(result);
    } else {
      calcDisplay.value = "Erro";
    }
  } catch (err) {
    calcDisplay.value = "Erro";
  }
}
