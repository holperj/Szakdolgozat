/* ============================================================
   PRODUCT PAGE LOGIC
   ============================================================ */

function initProductPage() {
  if (!PRODUCT) return;

  function applySwatchBackgroundsLocal() {
    const map = PRODUCT.swatchImages || {};
    document.querySelectorAll(".swatch[data-swatch]").forEach(el => {
      const key = el.dataset.swatch;
      if (map[key]) {
        el.style.backgroundImage = `url("${map[key]}")`;
      }
    });
  }

  function updatePreviewImageLocal() {
    const preview = document.getElementById("preview");
    if (!preview) return;

    const selected = getSelectedValues(PRODUCT.optionNames || []);
    const key = buildImageKey(selected);

    preview.src = (key && PRODUCT.images?.[key])
      ? PRODUCT.images[key]
      : (PRODUCT.placeholder || "assets/images/products/flexdesk_placeholder.jpg");
  }

  function updateDisplayedPriceLocal() {
    const priceEl = document.getElementById("productPrice");
    if (!priceEl) return;

    if (typeof PRODUCT.price === "number") {
      priceEl.textContent = formatPrice(PRODUCT.price);
      return;
    }

    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    if (!selectedSize) {
      priceEl.textContent = "Ajánlatkérés";
      return;
    }

    const selectedPrice = PRODUCT.price?.[selectedSize];
    priceEl.textContent = selectedPrice != null ? formatPrice(selectedPrice) : "Ajánlatkérés";
  }

  const watchNames = Array.from(new Set([
    ...(PRODUCT.optionNames || []),
    ...(PRODUCT.saveOptions || [])
  ]));

  watchNames.forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
      input.addEventListener("change", () => {
        updatePreviewImageLocal();
        updateDisplayedPriceLocal();
      });
    });
  });

  const addBtn = document.getElementById("addToCart");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const selectedAll = getSelectedValues(watchNames);
      const previewSrc = document.getElementById("preview")?.getAttribute("src") ||
        PRODUCT.placeholder ||
        "assets/images/products/flexdesk_placeholder.jpg";

      const selectedPrice = (typeof PRODUCT.price === "number")
        ? PRODUCT.price
        : (PRODUCT.price?.[selectedAll.size] ?? null);

      if (PRODUCT.saveOptions?.includes("size") && !selectedAll.size) {
        alert("Kérjük válasszon méretet!");
        return;
      }

      const configToSave = {};
      (PRODUCT.saveOptions || []).forEach(k => {
        if (selectedAll[k]) configToSave[k] = selectedAll[k];
      });

      addItemToCart({
        sku: PRODUCT.sku,
        name: PRODUCT.name,
        img: previewSrc,
        qty: 1,
        price: selectedPrice,
        config: configToSave
      });

      const drawer = document.getElementById("cartDrawer");
      if (drawer && window.bootstrap?.Offcanvas) {
        bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
      }
    });
  }

  applySwatchBackgroundsLocal();
  updatePreviewImageLocal();
  updateDisplayedPriceLocal();
}

document.addEventListener("DOMContentLoaded", initProductPage);