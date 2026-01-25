// const COLOR_PRIORITY = [
//   "#000", "#000000",
//   "#fff", "#ffffff",
//   "#192252",
//   "#636b2f",
//   "#895129",
//   "#4cbb17",
//   "#708090",
//   "#24357a",
//   "#4f3065",
//   "#595855",
//   "#669f51",
//   "#c1daf7",
//   "#f7a5bb",
// ];

// export const pickPreviewImg = (variants = []) => {
//   const normalizeColor = (c = "") => c.trim().toLowerCase();
//   const normalizeFit = (f = "") => f.toUpperCase();

//   const list = variants
//     .map(v => ({
//       frontImg: v.frontImg,
//       fit: normalizeFit(v.fit),   // MEN / WOMEN
//       color: normalizeColor(v.color), // #000 / #fff etc
//     }))
//     .filter(v => v.frontImg);

//   const findBy = (fit, colors) =>
//     list.find(
//       v =>
//         v.fit === fit &&
//         colors.includes(v.color)
//     );

//   // 1️⃣ MEN → BLACK
//   let found = findBy("MEN", ["#000", "#000000"]);
//   if (found) return found.frontImg;

//   // 2️⃣ MEN → WHITE
//   found = findBy("MEN", ["#fff", "#ffffff"]);
//   if (found) return found.frontImg;

//   // 3️⃣ WOMEN → BLACK
//   found = findBy("WOMEN", ["#000", "#000000"]);
//   if (found) return found.frontImg;

//   // 4️⃣ WOMEN → WHITE
//   found = findBy("WOMEN", ["#fff", "#ffffff"]);
//   if (found) return found.frontImg;

//   // optional fallback (can remove if you want strict)
//   return list[0]?.frontImg || null;
// };

const BLACKS = ["#000", "#000000"];
const WHITES = ["#fff", "#ffffff"];

export const pickPreviewImg = (variants = []) => {
  const normalizeColor = (c = "") => c.trim().toLowerCase();
  const normalizeFit = (f = "") => String(f || "").toUpperCase();

  const list = (variants || [])
    .map(v => ({
      frontImg: v.frontImg || null,
      backImg: v.backImg || null,           // ✅ back image added
      fit: normalizeFit(v.fit || v.fitType), // supports both fit / fitType
      color: normalizeColor(v.color),
    }))
    .filter(v => v.frontImg || v.backImg); // ✅ at least one image

  const findBy = (fit, colors) =>
    list.find(v => v.fit === fit && colors.includes(v.color));

  const pickImg = (v) => v.frontImg || v.backImg;

  // 1️⃣ MEN → BLACK
  let found = findBy("MEN", BLACKS);
  if (found) return pickImg(found);

  // 2️⃣ MEN → WHITE
  found = findBy("MEN", WHITES);
  if (found) return pickImg(found);

  // 3️⃣ WOMEN → BLACK
  found = findBy("WOMEN", BLACKS);
  if (found) return pickImg(found);

  // 4️⃣ WOMEN → WHITE
  found = findBy("WOMEN", WHITES);
  if (found) return pickImg(found);

  // 🔁 fallback: first available image
  return list[0] ? pickImg(list[0]) : null;
};
