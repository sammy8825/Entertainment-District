// For toggling display of logout section

const userIcon = document.querySelector(".user");
const options = document.querySelector(".dropdown");

userIcon.addEventListener("click", (e) => {
  options.style.display =
    options.style.display === "inline-block" ? "none" : "inline-block";
});