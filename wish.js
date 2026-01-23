const API_URL = "https://wedding-api-tau.vercel.app/api/wishes";

// ===== DOM =====
const form = document.getElementById("wish-form");
const nameInput = document.getElementById("wishName");
const emailInput = document.getElementById("wishEmail");
const messageInput = document.getElementById("content");
const wishList = document.getElementById("wishList");

const successBox = document.getElementById("success");
const errorBox = document.getElementById("error");

// ===== HELPERS =====
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function hideMessages() {
  successBox.style.display = "none";
  errorBox.style.display = "none";
}

function showSuccess() {
  hideMessages();
  successBox.style.display = "block";
  setTimeout(() => {
    successBox.style.display = "none";
  }, 3000);
}

function showError() {
  hideMessages();
  errorBox.style.display = "block";
  setTimeout(() => {
    errorBox.style.display = "none";
  }, 3000);
}

// ===== RENDER =====
function renderWish(wish) {
  const div = document.createElement("div");
  div.className = "wish-item";
  div.innerHTML = `
    <h4>${escapeHtml(wish.name)}</h4>
    <p>${escapeHtml(wish.message)}</p>
  `;
  wishList.prepend(div);
}

// ===== LOAD DATA =====
async function loadWishes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!Array.isArray(data)) return;

    data.forEach(renderWish);
  } catch (e) {
    console.error("Load wishes failed", e);
  }
}

// ===== SUBMIT (CAPTURE PHASE – CHẶN JQUERY PLUGIN) =====
form.addEventListener(
  "submit",
  async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    hideMessages();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      showError();
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        showError();
        return;
      }

      const savedWish = await res.json();
      renderWish(savedWish);
      form.reset();
      showSuccess();
    } catch (err) {
      console.error(err);
      showError();
    }
  },
  true // 👈 capture phase
);

// ===== INIT =====
hideMessages();
loadWishes();
