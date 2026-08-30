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

renderAppointments();
