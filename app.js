const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const dateTextElement = document.getElementById("dateText");
const ampmElement = document.getElementById("ampm");

function formatTimePart(value) {
  return String(value).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  hoursElement.textContent = formatTimePart(hour12);
  minutesElement.textContent = formatTimePart(minutes);
  secondsElement.textContent = formatTimePart(seconds);
  ampmElement.textContent = period;

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  dateTextElement.textContent = formattedDate.replace(/(^\w)/, (letter) =>
    letter.toUpperCase()
  );

  document.title = `${formatTimePart(hour12)}:${formatTimePart(minutes)}:${formatTimePart(seconds)} ${period} | Relógio Digital`;
}

updateClock();
setInterval(updateClock, 1000);
