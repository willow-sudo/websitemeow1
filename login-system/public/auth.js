function getInputValues() {
  return {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
}

function showMessage(msg) {
  document.getElementById("msg").textContent = msg;
}

/* -------- SIGNUP -------- */

async function signup() {
  const data = getInputValues();

  if (!data.username || !data.password) {
    showMessage("Enter username and password");
    return;
  }

  const res = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  showMessage(result.success ? "Signup successful" : result.error);
}

/* -------- LOGIN -------- */

async function login() {
  const data = getInputValues();

  if (!data.username || !data.password) {
    showMessage("Enter username and password");
    return;
  }

  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (result.success) {
    localStorage.setItem("username", result.username);
    localStorage.setItem("role", result.role);

    window.location.href = "./dashboard.html";
  } else {
    showMessage(result.error);
  }
}
