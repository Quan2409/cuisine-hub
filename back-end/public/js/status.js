const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");
const statusType = urlParams.get("status");

const statusCard = document.querySelector(".status__card");
const statusMessage = document.querySelector("#status__message");
const statusIcon = document.querySelector("#status__icon");
const statusBtn = document.querySelector("#card__btn");

const iconSuccess = `<i id="statusIconSuccess" class="fa-solid fa-check ic-success"></i>`;
const iconError = `<i id="statusIconError" class="fa-solid fa-xmark ic-error"></i>`;

if (statusType === "success") {
  statusIcon.innerHTML = iconSuccess;
  statusMessage.textContent = message;
  statusMessage.classList.add("success");
  statusCard.classList.add("card-success");
  statusBtn.classList.add("showBtn");
} else if (statusType === "error") {
  statusIcon.innerHTML = iconError;
  statusMessage.textContent = message;
  statusMessage.classList.add("error");
  statusCard.classList.add("card-error");
  statusBtn.classList.add("hideBtn");
}
