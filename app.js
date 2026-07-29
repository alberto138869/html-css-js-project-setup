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
