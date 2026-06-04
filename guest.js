const params = new URLSearchParams(window.location.search);
const status = params.get("status") || "Vou";
const form = document.querySelector("#guestForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const guest = {
    status,
    name: data.get("name").trim(),
    lastName: data.get("lastName").trim()
  };

  sessionStorage.setItem("cecilia_rsvp_draft", JSON.stringify(guest));

  window.location.href = "age.html";
});
