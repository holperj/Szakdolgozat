/* ============================================================
   PRODUCT PAGE LOGIC (FINAL)
   ============================================================ */

function initProductPage() {
  if (!PRODUCT) return;

  /* ---------------------------
     SWATCH BACKGROUNDS
  ---------------------------- */
  function applySwatchBackgroundsLocal() {
    const map = PRODUCT.swatchImages || {};
    document.querySelectorAll(".swatch[data-swatch]").forEach(el => {
      const key = el.dataset.swatch;
      if (map[key]) {
        el.style.backgroundImage = `url("${map[key]}")`;
      }
    });
  }

  /* ---------------------------
     PREVIEW IMAGE
  ---------------------------- */
  function updatePreviewImageLocal() {
    const preview = document.getElementById("preview");
    if (!preview) return;

    const selected = getSelectedValues(PRODUCT.optionNames);
    const key = buildImageKey(selected);

    preview.src = (key && PRODUCT.images?.[key])
      ? PRODUCT.images[key]
      : PRODUCT.placeholder;
  }

  /* ---------------------------
     PRICE UPDATE
  ---------------------------- */
  function updateDisplayedPriceLocal() {
    const priceEl = document.getElementById("productPrice");
    if (!priceEl) return;

    if (typeof PRODUCT.price === "number") {
      priceEl.textContent = formatPrice(PRODUCT.price);
      return;
    }

    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    if (!selectedSize) {
      priceEl.textContent = "";
      return;
    }

    const selectedPrice = PRODUCT.price?.[selectedSize];
    priceEl.textContent = selectedPrice != null ? formatPrice(selectedPrice) : "Ajánlatkérés";
  }

  /* ---------------------------
     OPTION WATCHERS
  ---------------------------- */
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

  /* ---------------------------
     ADD TO CART
  ---------------------------- */
  const addBtn = document.getElementById("addToCart");

  if (addBtn) {
    addBtn.addEventListener("click", () => {

      const selectedAll = getSelectedValues(watchNames);
      const previewSrc = document.getElementById("preview")?.src || PRODUCT.placeholder;

      const selectedPrice = (typeof PRODUCT.price === "number")
        ? PRODUCT.price
        : PRODUCT.price?.[selectedAll.size] ?? null;

      const configToSave = {};
      (PRODUCT.saveOptions || []).forEach(k => configToSave[k] = selectedAll[k]);

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

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    initProductPage();
  }
});
