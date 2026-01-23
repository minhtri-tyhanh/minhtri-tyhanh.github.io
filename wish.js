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
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (!Array.isArray(data)) return;
    data.forEach(renderWish);
  } catch (e) {
    console.error("Load wishes failed", e);
  }
}

/**
 * 🔥 CHẶN SUBMIT + GỬI FETCH TRONG 1 HÀM DUY NHẤT
 * capture phase để plugin jQuery KHÔNG can thiệp
 */
form.addEventListener(
  "submit",
  async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) return;

    try {
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
    } catch (err) {
      alert("Có lỗi xảy ra");
      console.error(err);
    }
  },
  true // 👈 capture phase
);

loadWishes();
