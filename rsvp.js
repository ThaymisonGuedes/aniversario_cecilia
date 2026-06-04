const options = document.querySelectorAll(".rsvp-option");

options.forEach((button) => {
  button.addEventListener("click", () => {
    const status = encodeURIComponent(button.dataset.status);
    window.location.href = `guest.html?status=${status}`;
  });
});
