const API_URL = "https://wedding-api-tau.vercel.app/api/wishes";

const form = document.getElementById("wish-form");
const nameInput = document.getElementById("wishName");
const emailInput = document.getElementById("wishEmail");
const messageInput = document.getElementById("content");
const wishList = document.getElementById("wishList");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderWish(wish) {
  const div = document.createElement("div");
  div.className = "wish-item";
  div.innerHTML = `
    <h4>${escapeHtml(wish.name)}</h4>
    <p>${escapeHtml(wish.message)}</p>
  `;
  wishList.prepend(div);
}

async function loadWishes() {
  const res = await fetch(API_URL);
  const data = await res.json();
  data.forEach(renderWish);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) return;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  });

  if (!res.ok) {
    alert("Không gửi được lời chúc 😢");
    return;
  }

  const saved = await res.json();
  renderWish(saved);
  form.reset();
});

loadWishes();
