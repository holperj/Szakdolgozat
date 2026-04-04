/* LOADER HANDLING */
const loader = document.querySelector(".loader");
if (loader) {
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
  }, 800);
}

const CART_KEY = "do_cart_v1";
const FALLBACK_IMAGE = "assets/images/products/flexdesk_placeholder.jpg";

/* ---------------------------
   PRICE FORMATTER
---------------------------- */
function formatPrice(num) {
  if (num == null || Number.isNaN(Number(num))) return "";
  return Number(num).toLocaleString("hu-HU") + " Ft";
}

/* ---------------------------
   CART STORAGE
---------------------------- */
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cleanConfig(cfg) {
  const out = {};
  Object.entries(cfg || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      out[k] = v;
    }
  });
  return out;
}

function cartItemKey(item) {
  return `${item.sku || ""}|${JSON.stringify(item.config || {})}`;
}

function normalizeCartItem(item) {
  return {
    sku: item?.sku || "",
    name: item?.name || "Termék",
    img: item?.img || FALLBACK_IMAGE,
    qty: Number(item?.qty) > 0 ? Number(item.qty) : 1,
    price: item?.price ?? null,
    config: cleanConfig(item?.config || {})
  };
}

function addItemToCart(item) {
  const cart = loadCart();
  const safeItem = normalizeCartItem(item);
  const key = cartItemKey(safeItem);
  const existing = cart.find(i => cartItemKey(i) === key);

  if (existing) {
    existing.qty += safeItem.qty;
    if (!existing.img && safeItem.img) existing.img = safeItem.img;
    if (existing.price == null && safeItem.price != null) existing.price = safeItem.price;
  } else {
    cart.push(safeItem);
  }

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
  const count = cart.reduce((sum, i) => sum + (Number(i.qty) || 1), 0);

  const badge1 = document.getElementById("cartCount");
  const badge2 = document.getElementById("cartCountInline");

  if (badge1) badge1.textContent = count;
  if (badge2) badge2.textContent = count;
}

/* ---------------------------
   PRODUCT DETECTION
---------------------------- */
function detectProduct() {
  const key = document.body.dataset.product;
  if (!key || typeof PRODUCTS === "undefined") return null;
  return PRODUCTS[key] || null;
}

let PRODUCT = null;

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

function formatConfig(cfg) {
  if (!cfg) return "";

  return Object.entries(cfg)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => {
      const label = LABELS?.[k] || k;
      const displayValue = DISPLAY_NAMES?.[k]?.[String(v)] ?? v;
      return `<div><strong>${label}:</strong> ${displayValue}</div>`;
    })
    .join("");
}

/* ============================================================
   CART DRAWER RENDERING
   ============================================================ */
function renderCart() {
  const cart = loadCart();
  updateBadges();

  const wrap = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const totalItemsEl = document.getElementById("cartTotalItems");
  const totalPriceEl = document.getElementById("cartTotalPrice");

  if (!wrap || !empty || !totalItemsEl || !totalPriceEl) return;

  wrap.innerHTML = "";

  if (!cart.length) {
    empty.style.display = "block";
    totalItemsEl.textContent = "0";
    totalPriceEl.textContent = "0 Ft";
    return;
  }

  empty.style.display = "none";

  let totalItems = 0;
  let totalPrice = 0;
  let quoteNeeded = false;

  cart.forEach((rawItem, idx) => {
    const item = normalizeCartItem(rawItem);
    totalItems += item.qty;

    const unitPrice = item.price;
    const itemTotal = unitPrice == null ? null : unitPrice * item.qty;

    if (itemTotal != null) totalPrice += itemTotal;
    if (unitPrice == null) quoteNeeded = true;

    const row = document.createElement("div");
    row.className = "cart-row d-flex gap-3 border-bottom pb-3";

    row.innerHTML = `
      <img
        class="cart-thumb"
        src="${item.img || FALLBACK_IMAGE}"
        alt="${item.name}"
        style="width:110px;height:90px;object-fit:cover;border-radius:10px;"
      >

      <div class="flex-grow-1">
        <p class="cart-title mb-1">${item.name}</p>

        ${Object.keys(item.config).length ? `
          <div class="cart-meta mb-2">
            ${formatConfig(item.config)}
          </div>
        ` : ""}

        <div class="cart-price mb-1">
          ${unitPrice == null ? "Ajánlatkérés szükséges" : `${formatPrice(unitPrice)} / db`}
        </div>

        <div class="d-flex align-items-center gap-2 mt-2">
          <button class="btn btn-sm btn-outline-dark" data-action="dec" data-idx="${idx}">−</button>
          <span><strong>${item.qty}</strong></span>
          <button class="btn btn-sm btn-outline-dark" data-action="inc" data-idx="${idx}">+</button>
          <button class="btn btn-sm btn-outline-danger ms-auto" data-action="remove" data-idx="${idx}">Törlés</button>
        </div>

        <div class="text-end fw-bold mt-2">
          ${itemTotal != null ? formatPrice(itemTotal) : "Ajánlatkérés"}
        </div>
      </div>
    `;

    wrap.appendChild(row);
  });

  totalItemsEl.textContent = String(totalItems);
  totalPriceEl.textContent = quoteNeeded ? "Ajánlatkérés szükséges" : formatPrice(totalPrice);
}

/* ============================================================
   CART BUTTON ACTIONS
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

  const qty = Number(item.qty) || 1;

  if (action === "inc") item.qty = qty + 1;
  if (action === "dec") item.qty = Math.max(1, qty - 1);
  if (action === "remove") cart.splice(idx, 1);

  saveCart(cart);
  renderCart();

  if (typeof renderCheckout === "function") {
    renderCheckout();
  }
});

/* ============================================================
   INITIALIZATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  PRODUCT = detectProduct();
  updateBadges();
  renderCart();

  const clearBtn = document.getElementById("clearCart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCart();
      if (typeof renderCheckout === "function") {
        renderCheckout();
      }
    });
  }
});