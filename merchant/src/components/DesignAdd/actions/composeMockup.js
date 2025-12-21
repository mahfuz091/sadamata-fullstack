import { Canvas, FabricImage } from "fabric";
import { loadHTMLImage } from "../utils/image";
import { MIN_OUTPUT_PX } from "../constants";

/**
 * Normalize placement from preview canvas to output canvas
 */
const getNormalizedRect = (positions, side, fit, refW, refH) => {
  const stored = positions?.[side]?.[fit];
  if (!stored) return null;

  return {
    x: stored.x / refW,
    y: stored.y / refH,
    w: stored.w / refW,
    h: stored.h / refH,
  };
};

/**
 * Compose a single side (FRONT / BACK) into a high-res PNG blob
 */
export async function composeSideToBlob({
  baseSrc,
  overlaySrc,
  side,
  fit,
  positions,
  previewSize = { width: 400, height: 400 },
}) {
  if (!baseSrc || !overlaySrc) return null;

  /* ---------- LOAD BASE IMAGE ---------- */
  const baseImg = await loadHTMLImage(baseSrc);
  if (!baseImg) return null;

  /* ---------- SCALE TO ≥4500px ---------- */
  const scaleFactor = Math.max(
    MIN_OUTPUT_PX / baseImg.width,
    MIN_OUTPUT_PX / baseImg.height,
    1
  );

  const outputW = Math.round(baseImg.width * scaleFactor);
  const outputH = Math.round(baseImg.height * scaleFactor);

  /* ---------- CREATE OUTPUT CANVAS ---------- */
  const el = document.createElement("canvas");
  el.width = outputW;
  el.height = outputH;

  const canvas = new Canvas(el, {
    width: outputW,
    height: outputH,
    selection: false,
  });

  /* ---------- ADD BASE ---------- */
  const base = new FabricImage(baseImg, {
    left: 0,
    top: 0,
    scaleX: scaleFactor,
    scaleY: scaleFactor,
    selectable: false,
    evented: false,
  });

  canvas.add(base);

  /* ---------- LOAD OVERLAY ---------- */
  const overlayImg = await loadHTMLImage(overlaySrc);
  if (!overlayImg) {
    canvas.dispose();
    return null;
  }

  /* ---------- NORMALIZED RECT ---------- */
  const norm = getNormalizedRect(
    positions,
    side,
    fit,
    previewSize.width,
    previewSize.height
  );

  if (!norm) {
    canvas.dispose();
    return null;
  }

  /* ---------- ADD OVERLAY ---------- */
  const overlay = new FabricImage(overlayImg, {
    left: norm.x * outputW,
    top: norm.y * outputH,
    scaleX: (norm.w * outputW) / overlayImg.width,
    scaleY: (norm.h * outputH) / overlayImg.height,
    selectable: false,
    evented: false,
  });

  canvas.add(overlay);
  canvas.renderAll();

  /* ---------- EXPORT ---------- */
  const blob = await new Promise((resolve) =>
    el.toBlob(resolve, "image/png", 1.0)
  );

  canvas.dispose();
  return blob;
}
