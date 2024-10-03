const resetForm = document.getElementById("resetForm");
const card = document.getElementById("card");
const statusMessage = document.getElementById("statusMessage");
const statusIcon = document.getElementById("statusIcon");
const urlParams = new URLSearchParams(window.location.search);
const messageParam = urlParams.get("message");
const statusParam = urlParams.get("status");
const typeParam = urlParams.get("type");
const userId = urlParams.get("id");

const handleSubmit = async (e) => {
  const success = document.getElementById("success");
  const error = document.getElementById("error");

  e.preventDefault();
  error.textContent = "";
  const newPassword = document.getElementById("newPassword");
  const retypePassword = document.getElementById("retypePassword");
  const password = newPassword.value;
  if (password !== retypePassword.value) {
    error.textContent = "Password do not match";
    return;
  }

  const apiUrl = `http://localhost:3500/user/change-password`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    });

    if (response.ok) {
      window.location.replace("#");
      success.textContent = "Password reset success";
    }
  } catch (err) {
    error.textContent = "An error occurred, please try again";
    console.log("An error occurred: ", err);
  }
};

const iconError = `<i id="statusIconError" class="fa-solid fa-xmark ic-error"></i>`;

if (statusParam === "error") {
  resetForm.classList.add("hideForm");
  card.classList.add("showError");
  statusIcon.innerHTML = iconError;
  statusMessage.textContent = messageParam;
} else if (typeParam === "reset") {
  resetForm.classList.add("showForm");
  card.classList.add("hideError");
}

resetForm.addEventListener("submit", handleSubmit);
