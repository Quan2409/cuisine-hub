const container = document.querySelector(".reset");
const resetForm = document.querySelector(".form__reset");
const urlParams = new URLSearchParams(window.location.search);
const messageParam = urlParams.get("message");
const statusParam = urlParams.get("status");
const typeParam = urlParams.get("type");
const userId = urlParams.get("id");

const handleSubmit = async (e) => {
  e.preventDefault();

  const success = document.querySelector(".form-success");
  const newPassword = document.querySelector(".password-input");
  const retypePassword = document.querySelector(".retype-input");
  const passwordError = document.querySelector(".password-error");
  const retypeError = document.querySelector(".retype-error");

  if (newPassword.value.trim() === "") {
    passwordError.innerText = "Password is required";
    return;
  } else if (newPassword.value.length < 6) {
    passwordError.innerText = "Password must be at least 6 characters";
    return;
  } else if (!/^\S+$/.test(newPassword.value)) {
    passwordError.innerText = "Password must be npt contian white space";
  } else {
    passwordError.innerText = "";
  }

  if (retypePassword.value.trim() === "") {
    retypeError.innerText = "Retype Password is requierd";
    return;
  } else if (newPassword.value !== retypePassword.value) {
    retypeError.innerText = "Password do not match";
    return;
  } else {
    retypeError.innerText = "";
  }

  const apiUrl = `http://localhost:3500/user/change-password`;
  const password = newPassword.value;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    });
    if (response.ok) {
      // success.innerText = "Password reset success";
      container.innerHTML = `
        <div class="reset-success">
          <h1>Reset Password Successfully</h1>
          <a href="http://localhost:5173/login">Login Now</a>
        </div>
      `;
    }
  } catch (err) {
    console.log("An error occurred: ", err);
  }
};

resetForm.addEventListener("submit", handleSubmit);
