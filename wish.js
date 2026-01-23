const API_URL = "https://wedding-api-tau.vercel.app/api/wishes";

const form = document.getElementById("wishForm");
const nameInput = document.getElementById("wishName");
const messageInput = document.getElementById("wishMessage");
const wishList = document.getElementById("wishList");

// render 1 lời chúc
function renderWish(wish) {
  const div = document.createElement("div");
  div.className = "wish-item";
  div.innerHTML = `
    <strong>${escapeHtml(wish.name)}</strong>
    <p>${escapeHtml(wish.message)}</p>
  `;
  wishList.prepend(div);
}

// load danh sách
async function loadWishes() {
  try {
    const res = await fetch(API_URL);
    const wishes = await res.json();
    wishes.forEach(renderWish);
  } catch (err) {
    console.error("Load wishes failed", err);
  }
}

// submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, message }),
    });

    if (!res.ok) {
      alert("Không gửi được lời chúc 😢");
      return;
    }

    const savedWish = await res.json();
    renderWish(savedWish);

    form.reset();
  } catch (err) {
    alert("Có lỗi xảy ra");
  }
});

// chống XSS đơn giản
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// init
loadWishes();
