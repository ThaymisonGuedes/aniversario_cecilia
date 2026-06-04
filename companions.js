const form = document.querySelector("#companionsForm");
const draft = JSON.parse(sessionStorage.getItem("cecilia_rsvp_draft") || "{}");

if (!draft.name) {
  window.location.href = "rsvp.html";
}

function readRsvps() {
  try {
    return JSON.parse(localStorage.getItem("cecilia_rsvps")) || [];
  } catch {
    return [];
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  draft.guests = data.get("guests");
  draft.note = data.get("note").trim();
  sessionStorage.setItem("cecilia_rsvp_draft", JSON.stringify(draft));
  window.location.href = "contact.html";
});
