// Modal for Forgot Section
const change = document.querySelector(".changePassBtn");
const forgotModal = document.querySelector(".forgotModal");
const close = document.querySelector(".closeButton");
const sent = document.querySelector(".displayMesaage");
const sendButton = document.querySelector(".send");

change.addEventListener("click", (e) => {
  e.preventDefault();
  forgotModal.style.display = "block";
});

close.addEventListener("click", (e) => {
  forgotModal.style.display = "none";
});
