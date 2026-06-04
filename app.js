const eventDate = new Date("2026-06-28T18:00:00-03:00");
const storageKeys = {
  rsvps: "cecilia_rsvps",
  messages: "cecilia_messages"
};

const $ = (selector) => document.querySelector(selector);

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function updateCountdown() {
  const target = $("#countdown");
  const diff = eventDate - new Date();

  if (diff <= 0) {
    target.innerHTML = "<span><b>Hoje</b>e festa!</span>";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  target.innerHTML = [
    ["dias", days],
    ["horas", hours],
    ["min", minutes],
    ["seg", seconds]
  ].map(([label, value]) => `<span><b>${String(value).padStart(2, "0")}</b>${label}</span>`).join("");
}

function renderRsvps() {
  const rsvps = readJson(storageKeys.rsvps, []);
  const accepted = rsvps.filter((item) => item.status === "Vou");
  const declined = rsvps.filter((item) => item.status === "Nao vou");
  const totalGuests = accepted.reduce((sum, item) => sum + 1 + Number(item.guests || 0), 0);

  $("#rsvpStats").innerHTML = `
    <span>${accepted.length} confirmados</span>
    <span>${declined.length} nao vao</span>
    <span>${totalGuests} pessoas no total</span>
  `;

  $("#rsvpList").innerHTML = rsvps.length
    ? rsvps.map((item) => `
      <article>
        <strong>${escapeHtml(item.name)}</strong> - ${escapeHtml(item.status)}
        <br><small>${item.age ? "Idade: " + escapeHtml(item.age) + " | " : ""}Acompanhantes: ${Number(item.guests || 0)} ${item.note ? " | " + escapeHtml(item.note) : ""}</small>
      </article>
    `).join("")
    : "<article>Nenhuma confirmacao salva ainda.</article>";
}

function renderMessages() {
  const messages = readJson(storageKeys.messages, []);
  $("#messageWall").innerHTML = messages.length
    ? messages.map((item) => `
      <article>
        <strong>${escapeHtml(item.author)}</strong>
        <p>${escapeHtml(item.message)}</p>
      </article>
    `).join("")
    : "<article>Seja a primeira pessoa a deixar um recadinho.</article>";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

const rsvpForm = $("#rsvpForm");
if (rsvpForm) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const rsvps = readJson(storageKeys.rsvps, []);

    rsvps.unshift({
      status: form.get("status"),
      name: form.get("name").trim(),
      guests: form.get("guests"),
      note: form.get("note").trim(),
      createdAt: new Date().toISOString()
    });

    saveJson(storageKeys.rsvps, rsvps);
    event.currentTarget.reset();
    event.currentTarget.status.value = "Vou";
    event.currentTarget.guests.value = 0;
    renderRsvps();
  });
}

$("#messageForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const messages = readJson(storageKeys.messages, []);

  messages.unshift({
    author: form.get("author").trim(),
    message: form.get("message").trim(),
    createdAt: new Date().toISOString()
  });

  saveJson(storageKeys.messages, messages);
  event.currentTarget.reset();
  renderMessages();
});

$("#exportBtn")?.addEventListener("click", () => {
  const rsvps = readJson(storageKeys.rsvps, []);
  const rows = [["Nome", "Status", "Acompanhantes", "Observacao", "Criado em"]];
  rsvps.forEach((item) => rows.push([item.name, item.status, item.guests, item.note, item.createdAt]));

  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "confirmacoes_cecilia.csv";
  link.click();
  URL.revokeObjectURL(url);
});

$("#shareBtn")?.addEventListener("click", async () => {
  const text = "Voce esta convidado para o aniversario da Cecilia! Abra o convite e confirme sua presenca.";

  if (navigator.share) {
    await navigator.share({ title: "Aniversario da Cecilia", text, url: location.href });
    return;
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(text + " " + location.href)}`;
  window.open(whatsapp, "_blank", "noopener,noreferrer");
});

updateCountdown();
renderRsvps();
renderMessages();
setInterval(updateCountdown, 1000);
