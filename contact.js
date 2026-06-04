const draft = JSON.parse(sessionStorage.getItem("cecilia_rsvp_draft") || "{}");
const form = document.querySelector("#contactForm");

if (!draft.name || !draft.age) {
  window.location.href = "rsvp.html";
}

function readRsvps() {
  try {
    return JSON.parse(localStorage.getItem("cecilia_rsvps")) || [];
  } catch {
    return [];
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const rsvps = readRsvps();
  const response = {
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
    status: draft.status,
    name: `${draft.name} ${draft.lastName || ""}`.trim(),
    age: draft.age || "",
    guests: Number(draft.guests || 0),
    phone: data.get("phone").trim(),
    note: draft.note || "",
    createdAt: new Date().toISOString()
  };

  rsvps.unshift(response);

  localStorage.setItem("cecilia_rsvps", JSON.stringify(rsvps));
  sessionStorage.removeItem("cecilia_rsvp_draft");

  if (location.protocol.startsWith("http")) {
    const netlifyData = new URLSearchParams({ "form-name": "rsvp-cecilia", ...response });
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: netlifyData.toString()
      });
    } catch {}
  }

  window.location.href = "thanks.html";
});
