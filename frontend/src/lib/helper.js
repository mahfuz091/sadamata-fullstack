export const getProductImage = (product) => {
  if (!product?.variants?.length) return null;

  const variants = product.variants;

  // 1️⃣ MEN + BLACK + front
  let v = variants.find(
    (x) =>
      x.fitType === "MEN" && x.color?.toLowerCase() === "#000" && x.frontImg
  );
  if (v) return v.frontImg;

  // 2️⃣ MEN + BLACK + back
  v = variants.find(
    (x) => x.fitType === "MEN" && x.color?.toLowerCase() === "#000" && x.backImg
  );
  if (v) return v.backImg;

  // 3️⃣ MEN + any + front
  v = variants.find((x) => x.fitType === "MEN" && x.frontImg);
  if (v) return v.frontImg;

  // 4️⃣ MEN + any + back
  v = variants.find((x) => x.fitType === "MEN" && x.backImg);
  if (v) return v.backImg;

  // 5️⃣ Any fit + BLACK + front
  v = variants.find((x) => x.color?.toLowerCase() === "#000" && x.frontImg);
  if (v) return v.frontImg;

  // 6️⃣ Any fit + BLACK + back
  v = variants.find((x) => x.color?.toLowerCase() === "#000" && x.backImg);
  if (v) return v.backImg;

  // 7️⃣ Any front image
  v = variants.find((x) => x.frontImg);
  if (v) return v.frontImg;

  // 8️⃣ Any back image
  v = variants.find((x) => x.backImg);
  if (v) return v.backImg;

  // 9️⃣ Nothing available
  return null;
};

export const isDarkColor = (hex) => {
  if (!hex) return false;
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 140;
};

export const isLightColor = (color) => {
  if (!color) return false;

  let r, g, b;

  // HEX format (#fff or #ffffff)
  if (color.startsWith("#")) {
    let hex = color.replace("#", "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    if (hex.length !== 6) return false;

    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }

  // RGB format (rgb(255, 255, 255))
  else if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return false;

    [r, g, b] = match.map(Number);
  }

  // Unknown format
  else {
    return false;
  }

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160;
};
