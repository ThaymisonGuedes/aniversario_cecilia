const draft = JSON.parse(sessionStorage.getItem("cecilia_rsvp_draft") || "{}");
const options = document.querySelectorAll(".age-option");

if (!draft.name) {
  window.location.href = "rsvp.html";
}

options.forEach((button) => {
  button.addEventListener("click", () => {
    draft.age = button.dataset.age;
    sessionStorage.setItem("cecilia_rsvp_draft", JSON.stringify(draft));

    window.location.href = "review.html";
  });
});
