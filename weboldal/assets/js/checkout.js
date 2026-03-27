
/* ============================================================
   CHECKOUT PAGE SCRIPT
   ============================================================ */

function getCheckoutSummary(cart) {
  let totalQty = 0;
  let totalPrice = 0;
  let quoteNeeded = false;

  cart.forEach(item => {
    const qty = Number(item.qty) || 1;
    const unitPrice = item.price ?? null;

    totalQty += qty;

    if (unitPrice === null) {
      quoteNeeded = true;
    } else {
      totalPrice += unitPrice * qty;
    }
  });

  return { totalQty, totalPrice, quoteNeeded };
}

function formatCheckoutConfig(cfg) {
  if (!cfg) return "";

  return Object.entries(cfg)
    .filter(([_, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => {
      const label = LABELS[k] || k;
      const displayValue = DISPLAY_NAMES[k]?.[String(v)] || v;
      return `<div><strong>${label}:</strong> ${displayValue}</div>`;
    })
    .join("");
}

function renderCheckout() {
  const cart = loadCart();

  const wrap = document.getElementById("checkoutItems");
  const totalItems = document.getElementById("checkoutTotalItems");
  const totalPrice = document.getElementById("checkoutTotalPrice");
  const quoteNotice = document.getElementById("checkoutQuoteNotice");

  if (!wrap || !totalItems || !totalPrice || !quoteNotice) return;

  wrap.innerHTML = "";

  if (!Array.isArray(cart) || cart.length === 0) {
    wrap.innerHTML = `<div class="text-muted">Nincs termék a kosárban.</div>`;
    totalItems.textContent = "0 db";
    totalPrice.textContent = "0 Ft";
    quoteNotice.classList.add("d-none");
    return;
  }

  const summary = getCheckoutSummary(cart);

  cart.forEach(item => {
    const qty = Number(item.qty) || 1;
    const unitPrice = item.price ?? null;

    const itemPriceText = unitPrice === null
      ? "Ajánlatkérés szükséges"
      : `${formatPrice(unitPrice)} / db`;

    const row = document.createElement("div");
    row.className = "border rounded-4 p-3 mb-3";

    row.innerHTML = `
      <div class="d-flex gap-3 align-items-start">
        <img
          src="${item.img || '/assets/images/products/flexdesk_placeholder.jpg'}"
          alt="${item.name || ''}"
          style="width:250px;height:auto;object-fit:cover;border-radius:12px;background:#f5f5f5;"
        >

        <div class="flex-grow-1">
          <div class="fw-bold fs-5">${item.name || ""}</div>

          ${item.config ? `
            <div class="text-muted mt-2" style="font-size: 0.98rem;">
              ${formatCheckoutConfig(item.config)}
            </div>
          ` : ""}

          <div class="mt-2" style="font-size: 1rem;">
            Mennyiség: <strong>${qty}</strong>
          </div>

          <div class="fw-bold mt-2" style="font-size: 1.05rem;">
            ${itemPriceText}
          </div>
        </div>
      </div>
    `;

    wrap.appendChild(row);
  });

  totalItems.textContent = `${summary.totalQty} db`;

  if (summary.quoteNeeded) {
    totalPrice.textContent = "Ajánlatkérés szükséges";
    quoteNotice.classList.remove("d-none");
  } else {
    totalPrice.textContent = formatPrice(summary.totalPrice);
    quoteNotice.classList.add("d-none");
  }
}

function initCheckoutPage() {
  renderCheckout();

  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const cart = loadCart();

      if (!Array.isArray(cart) || cart.length === 0) {
        alert("A kosár üres.");
        return;
      }

      const summary = getCheckoutSummary(cart);

      console.log("CHECKOUT CART:", cart);
      console.log("CHECKOUT SUMMARY:", summary);

      if (summary.quoteNeeded) {
        alert("Az igény rögzítve. A kosár ajánlatkérős terméket is tartalmaz.");
      } else {
        alert("A rendelés demo módban rögzítve.");
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("button[data-action]") || e.target.closest("#clearCart")) {
      setTimeout(renderCheckout, 0);
    }
  });
}

document.addEventListener("DOMContentLoaded", initCheckoutPage);
