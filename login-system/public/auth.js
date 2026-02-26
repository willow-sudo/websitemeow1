// ------------------- helper -------------------
function getInputValues() {
  return {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
}

function showMessage(msg) {
  document.getElementById("msg").textContent = msg;
}

/*

 _____ _____ _____  _   _ _   _______ 
/  ___|_   _|  __ \| \ | | | | | ___ \
\ `--.  | | | |  \/|  \| | | | | |_/ /
 `--. \ | | | | __ | . ` | | | |  __/ 
/\__/ /_| |_| |_\ \| |\  | |_| | |    
\____/ \___/ \____/\_| \_/\___/\_|    
                                      
                                      

*/

async function signup() {
  const data = getInputValues();

  if (!data.username || !data.password) {
    showMessage("Please enter username and password");
    return;
  }

  try {
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    showMessage(
      result.success ? "Signup successful" : result.error || "Signup failed",
    );
  } catch (err) {
    console.error(err);
    showMessage("Server error");
  }
}


/*

 _     _____ _____ _____ _   _ 
| |   |  _  |  __ \_   _| \ | |
| |   | | | | |  \/ | | |  \| |
| |   | | | | | __  | | | . ` |
| |___\ \_/ / |_\ \_| |_| |\  |
\_____/\___/ \____/\___/\_| \_/
                               
                               

*/

async function login() {
  const data = getInputValues();

  if (!data.username || !data.password) {
    showMessage("Please enter username and password");
    return;
  }

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      // Save username in localStorage for dashboard
      localStorage.setItem("username", result.username);
      // Redirect to dashboard
      window.location.href = "./dashboard.html";
    } else {
      showMessage(result.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    showMessage("Server error");
  }
}
