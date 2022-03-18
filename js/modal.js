// Modal for Forgot Section
const forgot = document.querySelector("#forgot");
const forgotModal = document.querySelector(".forgotModal");
const close = document.querySelector(".closeButton");
const sent = document.querySelector(".displayMesaage");
const sendButton = document.querySelector(".send");

forgot.addEventListener("click", (e) => {
  e.preventDefault();
  forgotModal.style.display = "block";
});

close.addEventListener("click", (e) => {
    forgotModal.style.display = "none";
});