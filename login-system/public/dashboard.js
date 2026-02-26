// ================= LOGIN =================
const username = localStorage.getItem("username");

if (!username) {
  window.location.href = "./index.html";
}

document.getElementById("dashboard-welcome").textContent =
  `Welcome, ${username}!`;
document.getElementById("menu-welcome").textContent = username;

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("username");
  window.location.href = "./index.html";
}

// ================= POSTS =================
let localPosts = JSON.parse(localStorage.getItem("posts") || "[]");
let apiPosts = [];

// combined render function
function renderPosts() {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  // first render local posts (user-created)
  localPosts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>Posted by: <strong>${post.user}</strong></small>
    `;
    container.appendChild(div);
  });

  // then render API posts
  apiPosts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <small>Posted by User ${post.userId}</small>
    `;
    container.appendChild(div);
  });
}

// ================= MODAL CONTROL =================
const modal = document.getElementById("post-modal");

function openPostModal() {
  modal.style.display = "flex";
  closeMenu(); // close side menu when opening
}

function closePostModal() {
  modal.style.display = "none";
}

// ================= SUBMIT POST =================
function submitPost() {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!title || !content) {
    alert("Please enter a title and content");
    return;
  }

  // add to local posts
  localPosts.unshift({ title, content, user: username });
  localStorage.setItem("posts", JSON.stringify(localPosts));

  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";

  closePostModal();
  renderPosts();
}

// ================= BURGER MENU =================
const burger = document.getElementById("burger");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("menuOverlay");

burger.addEventListener("click", () => {
  sideMenu.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", closeMenu);

function closeMenu() {
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
}

// ================= FETCH API POSTS =================
async function loadApiPosts() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    apiPosts = data.slice(0, 50); // first 50 posts
    renderPosts(); // render after fetching
  } catch (err) {
    console.error("Failed to fetch API posts:", err);
  }
}

// ================= INITIALIZE =================
renderPosts();
loadApiPosts();
