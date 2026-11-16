const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");
const successMessage = document.getElementById("successMessage");

const storageKey = "petShopAppointments";
const appointments = JSON.parse(localStorage.getItem(storageKey) || "[]");

function formatDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function createAppointmentCard(appointment) {
  const card = document.createElement("article");
  card.className = "appointment-card";

  const title = document.createElement("h3");
  title.textContent = `${appointment.petName} — ${appointment.service}`;
  card.appendChild(title);

  const owner = document.createElement("p");
  owner.innerHTML = `<strong>Responsável:</strong> ${appointment.ownerName}`;
  card.appendChild(owner);

  const contacts = document.createElement("div");
  contacts.className = "details";
  contacts.innerHTML = `
    <p><strong>Data:</strong> ${formatDate(appointment.date)}</p>
    <p><strong>Horário:</strong> ${appointment.time}</p>
    <p><strong>Telefone:</strong> ${appointment.phone}</p>
  `;
  card.appendChild(contacts);

  if (appointment.notes) {
    const notes = document.createElement("p");
    notes.innerHTML = `<strong>Observações:</strong> ${appointment.notes}`;
    card.appendChild(notes);
  }

  return card;
}

function renderAppointments() {
  appointmentList.innerHTML = "";

  if (!appointments.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Nenhum agendamento registrado ainda.";
    appointmentList.appendChild(empty);
    return;
  }

  appointments.forEach((appointment) => {
    appointmentList.appendChild(createAppointmentCard(appointment));
  });
}

function saveAppointments() {
  localStorage.setItem(storageKey, JSON.stringify(appointments));
}

function showSuccess() {
  successMessage.hidden = false;
  setTimeout(() => {
    successMessage.hidden = true;
  }, 2800);
}

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const appointment = {
    petName: document.getElementById("petName").value.trim(),
    ownerName: document.getElementById("ownerName").value.trim(),
    service: document.getElementById("serviceType").value,
    date: document.getElementById("appointmentDate").value,
    time: document.getElementById("appointmentTime").value,
    phone: document.getElementById("ownerPhone").value.trim(),
    notes: document.getElementById("notes").value.trim(),
  };

  appointments.push(appointment);
  saveAppointments();
  renderAppointments();
  appointmentForm.reset();
  showSuccess();
});

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
