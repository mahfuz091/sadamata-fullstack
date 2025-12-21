import { FabricImage } from "fabric";
import { loadHTMLImage } from "./image";

export const safeClear = (canvas) => {
  if (!canvas?.lowerCanvasEl) return;
  canvas.clear();
};

export const addBaseImage = async (canvas, src) => {
  const img = await loadHTMLImage(src);
  if (!img) return;

  const base = new FabricImage(img, {
    left: 0,
    top: 0,
    scaleX: canvas.width / img.width,
    scaleY: canvas.height / img.height,
    selectable: false,
    evented: false,
  });

  canvas.add(base);
};
