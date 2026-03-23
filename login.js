const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    loginError.textContent = "Invalid credentials! Use demo credentials.";
    loginError.classList.remove("hidden");
  }
});