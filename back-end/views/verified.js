const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");
const statusType = urlParams.get("status");

const card = document.querySelector(".card");
const statusMessage = document.getElementById("statusMessage");
const statusIcon = document.getElementById("statusIcon");
const btn = document.getElementById("btn");

const iconSuccess = `<i id="statusIconSuccess" class="fa-solid fa-check ic-success"></i>`;
const iconError = `<i id="statusIconError" class="fa-solid fa-xmark ic-error"></i>`;

if (statusType === "success") {
  statusIcon.innerHTML = iconSuccess;
  statusMessage.textContent = message;
  statusMessage.classList.add("success");
  card.classList.add("card-success");
  btn.classList.add("showBtn");
} else if (statusType === "error") {
  statusIcon.innerHTML = iconError;
  statusMessage.textContent = message;
  statusMessage.classList.add("error");
  card.classList.add("card-error");
  btn.classList.add("hideBtn");
}
