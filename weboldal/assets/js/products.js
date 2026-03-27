const LABELS = { color:"Szín", legs:"Láb", line:"Csík", size:"Méret" };

const DISPLAY_NAMES = {
  color: {
    oak: "Tölgy",
    wood: "Fa",
    walnut: "Dió",
    black: "Fekete",
    grey: "Szürke",
    white: "Fehér"
  },
  legs: {
    blackleg: "Fekete láb",
    whiteleg: "Fehér láb"
  },
  line: {
    blackline: "Fekete csík",
    whiteline: "Fehér csík"
  },
  size: {
    "120": "120 cm",
    "160": "160 cm",
    "180": "180 cm",
    "200": "200 cm",
    "custom": "Egyéni"
  },
  price: {
    189000: "189 000 Ft",
    215000: "215 000 Ft",
    241000: "241 000 Ft",
    129000: "129 000 Ft",
    99000: "99 000 Ft",
    59000: "59 000 Ft",
    32000: "32 000 Ft",
    1400000: "1 400 000 Ft",
    2150000: "2 150 000 Ft",
    3410000: "3 410 000 Ft",
  }
};

/* =========================
   1) PRODUCTS (ONLY EDIT THIS)
   ========================= */
const PRODUCTS = {
  FLEXDESK: {
    sku: "FLEXDESK",
    name: "FlexDesk",
    price: {
      "120": 189000,
      "160": 215000,
      "200": 241000
    },
    optionNames: ["color","legs"],
    saveOptions: ["color","legs","size"],
    images: {
      "oak|blackleg":    "/assets/images/products/flexdesk_oak_blackleg.jpg",
      "oak|whiteleg":    "/assets/images/products/flexdesk_oak_whiteleg.jpg",
      "walnut|blackleg": "/assets/images/products/flexdesk_walnut_blackleg.jpg",
      "walnut|whiteleg": "/assets/images/products/flexdesk_walnut_whiteleg.jpg",
      "black|blackleg":  "/assets/images/products/flexdesk_black_blackleg.jpg",
      "black|whiteleg":  "/assets/images/products/flexdesk_black_whiteleg.jpg"
    },
    placeholder: "/assets/images/products/flexdesk_placeholder.jpg",
    swatchImages: {
      oak: "/assets/images/swatches/oak.jpg",
      walnut: "/assets/images/swatches/walnut.jpg"
    }
  },

  MEETTABLEX: {
    sku: "MEETTABLEX",
    name: "MeetTable X",
    price: {
      "400": 1400000,
      "600": 2150000,
      "800": 3410000
    },
    optionNames: ["color","line"],
    saveOptions: ["color","line","size"],
    images: {
      "oak|blackline":    "/assets/images/products/meettable_oak_black.jpg",
      "oak|whiteline":    "/assets/images/products/meettable_oak_white.jpg",
      "walnut|blackline": "/assets/images/products/meettable_walnut_black.jpg",
      "walnut|whiteline": "/assets/images/products/meettable_walnut_white.jpg",
      "black|blackline":  "/assets/images/products/meettable_black_black.jpg",
      "black|whiteline":  "/assets/images/products/meettable_black_white.jpg"
    },
    placeholder: "/assets/images/products/flexdesk_placeholder.jpg",
    swatchImages: {
      oak: "/assets/images/swatches/oak.jpg",
      walnut: "/assets/images/swatches/walnut.jpg"
    }
  },

    ERGOCHAIRAIR: {
    price: 99000,
    sku: "ERGOCHAIRAIR",
    name: "Ergochair Air",
    placeholder: "/assets/images/products/ergochair_air_preview.jpg",
  },

  ERGOCHAIRPRO: {
    price: 129000,
    sku: "ERGOCHAIRPRO",
    name: "Ergoshair Pro",
    optionNames: ["color"],
    saveOptions: ["color"],
    images: {
      white: "/assets/images/products/ergochair_pro_white.jpg",
      black: "/assets/images/products/ergochair_pro_black.jpg",
      grey:  "/assets/images/products/ergochair_pro_grey.jpg"
    },
    placeholder: "/assets/images/products/ergochair_pro_placeholder.jpg"
  },

  ACOUSTICPANEL: {
    price: 32000,
    sku: "ACOUSTICPANEL",
    name: "Acoustic Panel",
    optionNames: ["color"],
    saveOptions: ["color"],
    images: {
      oak:    "/assets/images/products/accusticpanel_oak.jpg",
      walnut: "/assets/images/products/accusticpanel_walnut.jpg",
      black:  "/assets/images/products/accusticpanel_black.jpg",
      grey:   "/assets/images/products/accusticpanel_grey.jpg"
    },
    placeholder: "/assets/images/products/flexdesk_placeholder.jpg",
    swatchImages: {
      oak: "/assets/images/swatches/oak.jpg",
      walnut: "/assets/images/swatches/walnut.jpg"
    }
  },

  SMARTSTORE: {
    price: 59000,
    sku: "SMARTSTORE",
    name: "Smartstore",
    optionNames: ["color"],
    saveOptions: ["color"],
    images: {
      wood:    "/assets/images/products/smartstore_wood.jpg",
      black:  "/assets/images/products/smartstore_black.jpg",
      white:   "/assets/images/products/smartstore_white.jpg"
    },
    placeholder: "/assets/images/products/flexdesk_placeholder.jpg",
    swatchImages: {
      oak: "/assets/images/swatches/oak.jpg",
      walnut: "/assets/images/swatches/walnut.jpg"
    }
  }
};