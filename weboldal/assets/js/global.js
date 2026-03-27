/* LOADER HANDLING */
const loader = document.querySelector('.loader');
if (loader) {
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
  }, 800); // 0.8 sec
}

/* ============================================================
   GLOBAL CART + PRODUCT DETECTION (FINAL VERSION)
   ============================================================ */

const CART_KEY = "cartData";

/* ---------------------------
   PRICE FORMATTER
---------------------------- */
function formatPrice(num) {
  if (num == null) return "";
  return num.toLocaleString("hu-HU") + " Ft";
}

/* ---------------------------
   CART STORAGE
---------------------------- */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addItemToCart(item) {
  const cart = loadCart();
  cart.push(item);
  saveCart(cart);
  updateBadges();
  renderCart();
}

function clearCart() {
  saveCart([]);
  updateBadges();
  renderCart();
}

/* ---------------------------
   BADGE UPDATE
---------------------------- */
function updateBadges() {
  const cart = loadCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

/* ---------------------------
   PRODUCT DETECTION
---------------------------- */
function detectProduct() {
  const key = document.body.dataset.product;
  if (!key) return null;
  return PRODUCTS[key] || null;
}

let PRODUCT = detectProduct();

/* ---------------------------
   HELPERS
---------------------------- */
function getSelectedValues(names) {
  const out = {};
  (names || []).forEach(n => {
    out[n] = document.querySelector(`input[name="${n}"]:checked`)?.value || "";
  });
  return out;
}

function buildImageKey(selected) {
  if (!PRODUCT || !PRODUCT.optionNames) return "";
  const parts = PRODUCT.optionNames.map(n => selected[n] || "");
  if (parts.some(p => !p)) return "";
  return parts.join("|");
}

/* ============================================================
   CART DRAWER RENDERING (WITH IMAGE + FORMATTED CONFIG)
   ============================================================ */

function renderCart() {
  const cart = loadCart();
  updateBadges();

  const wrap = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const totalItemsEl = document.getElementById("cartTotalItems");
  const totalPriceEl = document.getElementById("cartTotalPrice");

  if (!wrap || !empty) return;

  wrap.innerHTML = "";

  if (cart.length === 0) {
    empty.style.display = "block";
    totalItemsEl.textContent = "0";
    totalPriceEl.textContent = "0 Ft";
    return;
  }

  empty.style.display = "none";

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item, idx) => {
    totalItems += item.qty;

    const unitPrice = item.price ?? null;
    const itemTotal = unitPrice === null ? null : unitPrice * item.qty;

    if (itemTotal != null) totalPrice += itemTotal;

    const row = document.createElement("div");
    row.className = "cart-row d-flex gap-3 border-bottom pb-3";

    row.innerHTML = `
      <img class="cart-thumb"
           src="${item.img || '/assets/images/products/flexdesk_placeholder.jpg'}"
           alt="${item.name}"
           style="width:80px; height:auto; border-radius:6px;">

      <div class="flex-grow-1">

        <p class="cart-title mb-1 fw-bold">${item.name}</p>

        ${item.config ? `
          <div class="cart-meta small text-muted mb-2">
            ${Object.entries(item.config)
              .map(([k, v]) => `
                <div><strong>${LABELS[k] || k}:</strong> ${DISPLAY_NAMES[k]?.[v] || v}</div>
              `)
              .join("")}
          </div>
        ` : ""}

        <div class="cart-price fw-bold mb-1">
          ${unitPrice === null ? "Ajánlatkérés szükséges" : formatPrice(unitPrice) + " / db"}
        </div>

        <div class="d-flex align-items-center gap-2 mt-2">
          <button class="btn btn-sm btn-outline-dark" data-action="dec" data-idx="${idx}">−</button>
          <span><strong>${item.qty}</strong></span>
          <button class="btn btn-sm btn-outline-dark" data-action="inc" data-idx="${idx}">+</button>

          <button class="btn btn-sm btn-outline-danger ms-auto" data-action="remove" data-idx="${idx}">
            Törlés
          </button>
        </div>

        <div class="text-end fw-bold mt-2">
          ${itemTotal !== null ? formatPrice(itemTotal) : "Ajánlatkérés"}
        </div>

      </div>
    `;

    wrap.appendChild(row);
  });

  totalItemsEl.textContent = totalItems;
  totalPriceEl.textContent = formatPrice(totalPrice);
}

/* ============================================================
   CART BUTTON ACTIONS (INC / DEC / REMOVE)
   ============================================================ */

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const idx = parseInt(btn.dataset.idx, 10);
  if (Number.isNaN(idx)) return;

  const cart = loadCart();
  const item = cart[idx];
  if (!item) return;

  if (action === "inc") item.qty += 1;
  if (action === "dec") item.qty = Math.max(1, item.qty - 1);
  if (action === "remove") cart.splice(idx, 1);

  saveCart(cart);
  renderCart();
});

/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
  renderCart();

  const clearBtn = document.getElementById("clearCart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCart();
    });
  }
});
