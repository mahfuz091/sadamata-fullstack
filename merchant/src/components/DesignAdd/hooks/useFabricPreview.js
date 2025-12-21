import { Canvas, FabricImage } from "fabric";
import { loadHTMLImage } from "../utils/image";
import { MAX_DESIGN_PX } from "../constants";

export function useFabricPreview(ref) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    canvasRef.current = new Canvas(ref.current, {
      width: 400,
      height: 400,
      selection: false,
    });
    return () => canvasRef.current.dispose();
  }, []);

  const render = async (baseSrc, designSrc, placement) => {
    const canvas = canvasRef.current;
    canvas.clear();

    const baseImg = await loadHTMLImage(baseSrc);
    const base = new FabricImage(baseImg, {
      scaleX: canvas.width / baseImg.width,
      scaleY: canvas.height / baseImg.height,
      selectable: false,
    });
    canvas.add(base);

    if (!designSrc) return;

    const dImg = await loadHTMLImage(designSrc);
    const scale = Math.min(
      MAX_DESIGN_PX / dImg.width,
      MAX_DESIGN_PX / dImg.height,
      1
    );

    const overlay = new FabricImage(dImg, {
      left: placement.x,
      top: placement.y,
      scaleX: scale,
      scaleY: scale,
      lockUniScaling: true,
      lockRotation: true,
      layer: 1,
    });

    canvas.add(overlay);
    canvas.renderAll();
  };

  return { render };
}
