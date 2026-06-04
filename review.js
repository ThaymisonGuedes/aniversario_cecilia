const draft = JSON.parse(sessionStorage.getItem("cecilia_rsvp_draft") || "{}");
const guestName = document.querySelector("#guestName");
const guestAge = document.querySelector("#guestAge");
const addCompanion = document.querySelector("#addCompanion");
const finishBtn = document.querySelector("#finishBtn");

if (!draft.name || !draft.age) {
  window.location.href = "rsvp.html";
}

guestName.textContent = `${draft.name || ""} ${draft.lastName || ""}`.trim();
guestAge.textContent = draft.age || "";

if (draft.status !== "Vou") {
  addCompanion.style.display = "none";
}

function readRsvps() {
  try {
    return JSON.parse(localStorage.getItem("cecilia_rsvps")) || [];
  } catch {
    return [];
  }
}

finishBtn.addEventListener("click", () => {
  draft.guests = 0;
  draft.note = "";
  sessionStorage.setItem("cecilia_rsvp_draft", JSON.stringify(draft));
  window.location.href = "contact.html";
});
