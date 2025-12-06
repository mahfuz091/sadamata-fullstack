"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, FabricImage } from "fabric"; // Fabric.js v6
import DashSidebar from "../DashSidebar/DashSidebar";
import Tag from "./Tag";
import { toast } from "sonner";
import { createProduct } from "@/app/actions/product/product.actions";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import BrandDropdown from "./BrandDropDown";
import { useRouter } from "next/navigation";
const MOCKUP_BASE_URL =
  process.env.NEXT_PUBLIC_MOCKUP_BASE_URL || "https://admin.sadamata.com";
const SPINNER_SVG_DATAURI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="20" stroke="#3b82f6" stroke-width="5" fill="none" opacity="0.2"/>
  <path fill="none" stroke="#3b82f6" stroke-width="5" d="M25 5 a20 20 0 0 1 0 40"/>
</svg>`);

/**
 * Map whatever mockup URL backend gives into /mockup/... so it goes through Next.js rewrite.
 * This makes images effectively same-origin -> no tainted canvas on toBlob/toDataURL.
 */

// raw can be full URL from backend or some relative string
const buildImageUrl = (raw) => {
  if (!raw) return "";
  if (typeof raw !== "string") raw = String(raw);

  // Case 1: backend sends full URL
  //   "http://localhost:3003/mockups/1765043063018-frontImg.png"
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      // "/mockups/1765043063018-frontImg.png" -> "mockups/1765043063018-frontImg.png"
      let path = url.pathname.replace(/^\/+/, "");
      // remove leading "mockups/"
      path = path.replace(/^mockups\//, "");
      // browser will request: /mockup/1765043063018-frontImg.png
      return `/mockup/${path}`;
    } catch (e) {
      console.warn("Invalid URL in buildImageUrl:", raw, e);
    }
  }

  // Case 2: backend sends "/mockups/1765..." or "mockups/1765..."
  let path = raw.replace(/^\/+/, ""); // strip leading "/"
  path = path.replace(/^mockups\//, ""); // strip "mockups/"

  // Final browser URL -> /mockup/<filename>
  return `/mockup/${path}`;
};

/**
 * Safe image loader. No crossOrigin (images are same-origin via rewrite).
 * On error we log and resolve null instead of throwing.
 */
const loadHTMLImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      console.error("loadHTMLImage: empty src");
      resolve(null);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (event) => {
      console.error("Failed to load image:", src, event);
      resolve(null);
    };
    img.src = src;
  });

export default function AddDesignFitAdmin({
  allMockup,
  currentUserId,
  brands,
  user,
}) {
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [designImage, setDesignImage] = useState(null); // FRONT design (data URL)
  const [designBack, setDesignBack] = useState(false); // BACK design (data URL or false)
  const [designImageFile, setDesignImageFile] = useState(null);
  const [designBackFile, setDesignBackFile] = useState(null);

  // Multi-select for fits/colors + hover preview
  const [selectedFitType, setSelectedFitType] = useState({});
  const [hoveredFitType, setHoveredFitType] = useState({});
  const [selectedColor, setSelectedColor] = useState({});
  const [hoveredColor, setHoveredColor] = useState({});

  const getActiveFit = (idx, fallback) => {
    if (idx == null) return fallback;
    const hover = hoveredFitType[idx];
    if (hover) return hover;
    const picked = selectedFitType[idx];
    return picked?.[0] ?? fallback;
  };

  const getActiveColor = (idx, fallback) => {
    if (idx == null) return fallback;
    const hover = hoveredColor[idx];
    if (hover) return hover;
    const picked = selectedColor[idx];
    return picked?.[0] ?? fallback;
  };

  const [canvas, setCanvas] = useState(null);
  const [backCanvas, setBackCanvas] = useState(null);

  const [designPosition, setDesignPosition] = useState({ x: 100, y: 100 });
  const [designBackPosition, setDesignBackPosition] = useState({
    x: 100,
    y: 100,
  });
  const [designSize, setDesignSize] = useState({ width: 200, height: 200 });
  const [designBackSize, setDesignBackSize] = useState({
    width: 200,
    height: 200,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [isBackView, setIsBackView] = useState(false);

  const inputFileRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasBackRef = useRef(null);

  const [spinnerFront, setSpinnerFront] = useState(null);
  const [spinnerBack, setSpinnerBack] = useState(null);

  const canvasRefs = useRef([]); // grid canvas DOM refs
  const [canvasInstances, setCanvasInstances] = useState([]); // grid Fabric canvases

  const activeProduct =
    activeProductIndex !== null
      ? allMockup?.[activeProductIndex] ?? null
      : null;

  // ---- Build mockup config: product -> fit -> color -> img URLs ----
  function buildMockupsByProduct(list) {
    const data = {};
    if (!Array.isArray(list)) return data;

    list.forEach((product) => {
      if (!product?.name || !Array.isArray(product?.variants)) return;

      const fits = {};
      const fitSet = new Set();

      product.variants.forEach((v) => {
        const fit = String(v.fitType || "").toUpperCase();
        const color = v.color?.toLowerCase?.();
        if (!fit || !color || !v.frontImg || !v.backImg) return;

        const frontUrl = buildImageUrl(v.frontImg);
        const backUrl = buildImageUrl(v.backImg);

        if (!fits[fit]) {
          fits[fit] = { colorFront: {}, colorBack: {}, colors: [] };
        }

        fits[fit].colorFront[color] = frontUrl;
        fits[fit].colorBack[color] = backUrl;
        if (!fits[fit].colors.includes(color)) fits[fit].colors.push(color);
        fitSet.add(fit);
      });

      data[product.name.toLowerCase()] = {
        fits,
        fitTypes: Array.from(fitSet),
      };
    });

    return data;
  }

  const mockupsByProduct = useMemo(
    () => buildMockupsByProduct(allMockup),
    [allMockup]
  );

  // ------------------ IMAGE UPLOAD HANDLERS ------------------

  // FRONT design upload (this is what you draw on top of mockups)
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setIsLoading(true);
      setDesignImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        // small delay only for spinner effect; you can remove setTimeout if you want instant
        setTimeout(() => {
          setDesignImage(String(reader.result)); // data URL
          setIsLoading(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  // BACK design upload (optional)
  const handleBackFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setBackFileName(file.name);
      setDesignBackFile(file);
      setIsBackLoading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setDesignBack(String(reader.result));
          setIsBackLoading(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  // ------------------ FABRIC CANVAS INIT ------------------

  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      selection: false,
    });
    setCanvas(c);
    return () => c.dispose();
  }, [
    isBackView,
    selectedColor,
    hoveredColor,
    activeProductIndex,
    selectedFitType,
    hoveredFitType,
  ]);

  useEffect(() => {
    if (!canvasBackRef.current) return;
    const c = new Canvas(canvasBackRef.current, {
      width: 400,
      height: 400,
      selection: false,
    });
    setBackCanvas(c);
    return () => c.dispose();
  }, [
    isBackView,
    selectedColor,
    hoveredColor,
    activeProductIndex,
    selectedFitType,
    hoveredFitType,
  ]);

  // init grid canvases
  useEffect(() => {
    const refs = canvasRefs.current.filter(Boolean);
    if (!refs.length) return;

    const instances = refs.map(
      (ref) => new Canvas(ref, { width: 350, height: 350, selection: false })
    );
    setCanvasInstances(instances);

    return () => {
      instances.forEach((c) => c && c.dispose());
    };
  }, [allMockup.length]);

  // ------------------ HELPERS ------------------

  const safeClear = (fabricCanvas) => {
    const ok =
      fabricCanvas?.lowerCanvasEl &&
      typeof fabricCanvas.lowerCanvasEl.getContext === "function";
    if (!ok) return false;
    fabricCanvas.clear();
    return true;
  };

  // spinner
  const addSpinnerToCanvas = (fabricCanvas, which) => {
    if (!fabricCanvas) return;
    const img = new Image();
    img.src = SPINNER_SVG_DATAURI;
    img.onload = () => {
      const spin = new FabricImage(img, {
        originX: "center",
        originY: "center",
        left: fabricCanvas.getWidth() / 2,
        top: fabricCanvas.getHeight() / 2,
        selectable: false,
        evented: false,
        opacity: 0.9,
      });
      fabricCanvas.add(spin);
      let angle = 0;
      spin.__spin = true;
      const rotate = () => {
        if (spin.__spin) {
          angle += 2;
          spin.set({ angle });
          fabricCanvas.renderAll();
          requestAnimationFrame(rotate);
        }
      };
      rotate();

      if (which === "front") setSpinnerFront(spin);
      if (which === "back") setSpinnerBack(spin);
    };
  };

  const removeSpinnerFromCanvas = (fabricCanvas, which) => {
    const spin = which === "front" ? spinnerFront : spinnerBack;
    if (fabricCanvas && spin) {
      spin.__spin = false;
      fabricCanvas.remove(spin);
      fabricCanvas.renderAll();
      if (which === "front") setSpinnerFront(null);
      if (which === "back") setSpinnerBack(null);
    }
  };

  // update design rect from Fabric drag/resize
  useEffect(() => {
    if (!canvas) return;
    const handler = (e) => {
      const obj = e.target;
      if (obj && obj.type === "image" && obj.layer === 1) {
        setDesignPosition({ x: obj.left, y: obj.top });
        setDesignSize({
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
        });
      }
    };
    canvas.on("object:modified", handler);
    return () => canvas.off("object:modified", handler);
  }, [canvas]);

  useEffect(() => {
    if (!backCanvas) return;
    const handler = (e) => {
      const obj = e.target;
      if (obj && obj.type === "image" && obj.layer === 1) {
        setDesignBackPosition({ x: obj.left, y: obj.top });
        setDesignBackSize({
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
        });
      }
    };
    backCanvas.on("object:modified", handler);
    return () => backCanvas.off("object:modified", handler);
  }, [backCanvas]);

  // add design on top of base
  const addDesignToCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designImage) return;
    loadHTMLImage(designImage).then((designImg) => {
      if (!designImg) return;
      const fabricImg = new FabricImage(designImg);
      fabricImg.set({
        left: designPosition.x,
        top: designPosition.y,
        scaleX: designSize.width / designImg.width,
        scaleY: designSize.height / designImg.height,
        hasControls: true,
        lockUniScaling: true,
        layer: 1,
      });
      fabricCanvas.add(fabricImg);
      fabricCanvas.renderAll();
    });
  };

  const addDesignToBackCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designBack) return;
    loadHTMLImage(designBack).then((designImg) => {
      if (!designImg) return;
      const fabricImg = new FabricImage(designImg);
      fabricImg.set({
        left: designBackPosition.x,
        top: designBackPosition.y,
        scaleX: designBackSize.width / designImg.width,
        scaleY: designBackSize.height / designImg.height,
        hasControls: true,
        lockUniScaling: true,
        layer: 1,
      });
      fabricCanvas.add(fabricImg);
      fabricCanvas.renderAll();
    });
  };

  const addDesignToSmallCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designImage) return;
    loadHTMLImage(designImage).then((designImg) => {
      if (!designImg) return;
      const targetWidth = 80;
      const targetHeight = 80;
      const scaleX = targetWidth / designImg.width;
      const scaleY = targetHeight / designImg.height;
      const centerX = (fabricCanvas.width - targetWidth) / 2;
      const centerY = (fabricCanvas.height - targetHeight) / 2;

      const fabricImg = new FabricImage(designImg);
      fabricImg.set({
        left: centerX,
        top: centerY,
        scaleX,
        scaleY,
        hasControls: false,
        lockUniScaling: true,
        layer: 1,
      });
      fabricCanvas.add(fabricImg);
      fabricCanvas.renderAll();
    });
  };

  // default selections when active product changes
  useEffect(() => {
    if (activeProductIndex === null) return;
    const product = allMockup[activeProductIndex];
    if (!product) return;

    const conf = mockupsByProduct[product.name.toLowerCase()];
    if (!conf) return;

    const firstFit = conf.fitTypes?.[0];
    if (!selectedFitType[activeProductIndex] && firstFit) {
      setSelectedFitType((p) => ({ ...p, [activeProductIndex]: [firstFit] }));
    }

    const fit = getActiveFit(activeProductIndex, firstFit);
    const colors = fit ? conf.fits[fit]?.colors ?? [] : [];
    const firstColor = colors[0];

    if (!selectedColor[activeProductIndex] && firstColor) {
      setSelectedColor((p) => ({ ...p, [activeProductIndex]: [firstColor] }));
    }
  }, [
    activeProductIndex,
    allMockup,
    mockupsByProduct,
    selectedFitType,
    selectedColor,
  ]);

  // ------------------ RENDER MOCKUPS INTO CANVASES ------------------

  // FRONT main preview
  useEffect(() => {
    if (!canvas || !activeProduct) return;

    const conf = mockupsByProduct[activeProduct.name.toLowerCase()];
    if (!conf) return;

    const fitFallback = conf.fitTypes?.[0];
    const fit = getActiveFit(activeProductIndex, fitFallback);
    if (!fit || !conf.fits[fit]) return;

    const colorFallback = conf.fits[fit].colors?.[0];
    const color = getActiveColor(activeProductIndex, colorFallback);
    if (!color) return;

    const src = conf.fits[fit].colorFront[color];
    if (!src) return;

    loadHTMLImage(src).then((img) => {
      if (!img) return;
      if (!safeClear(canvas)) return;
      const base = new FabricImage(img);
      base.set({
        left: 0,
        top: 0,
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        selectable: false,
        evented: false,
      });
      canvas.add(base);
      addDesignToCanvas(canvas);
      canvas.renderAll();
    });
  }, [
    canvas,
    activeProductIndex,
    activeProduct,
    selectedFitType,
    hoveredFitType,
    selectedColor,
    hoveredColor,
    designImage,
    mockupsByProduct,
  ]);

  // BACK main preview
  useEffect(() => {
    if (!backCanvas || !activeProduct) return;

    const conf = mockupsByProduct[activeProduct.name.toLowerCase()];
    if (!conf) return;

    const fitFallback = conf.fitTypes?.[0];
    const fit = getActiveFit(activeProductIndex, fitFallback);
    if (!fit || !conf.fits[fit]) return;

    const colorFallback = conf.fits[fit].colors?.[0];
    const color = getActiveColor(activeProductIndex, colorFallback);
    if (!color) return;

    const src = conf.fits[fit].colorBack[color];
    if (!src) return;

    loadHTMLImage(src).then((img) => {
      if (!img) return;
      if (!safeClear(backCanvas)) return;
      const base = new FabricImage(img);
      base.set({
        left: 0,
        top: 0,
        scaleX: backCanvas.width / img.width,
        scaleY: backCanvas.height / img.height,
        selectable: false,
        evented: false,
      });
      backCanvas.add(base);
      addDesignToBackCanvas(backCanvas);
      backCanvas.renderAll();
    });
  }, [
    backCanvas,
    activeProductIndex,
    activeProduct,
    selectedFitType,
    hoveredFitType,
    selectedColor,
    hoveredColor,
    designBack,
    mockupsByProduct,
  ]);

  // grid small previews
  useEffect(() => {
    if (!canvasInstances?.length) return;

    canvasInstances.forEach((c, idx) => {
      const product = allMockup[idx];
      if (!c || !product) return;

      const conf = mockupsByProduct[product.name.toLowerCase()];
      if (!conf) return;

      const fit = getActiveFit(idx, conf.fitTypes?.[0]);
      if (!fit || !conf.fits[fit]) return;

      const color = getActiveColor(idx, conf.fits[fit].colors?.[0]);
      if (!color) return;

      const src = conf.fits[fit].colorFront[color];
      if (!src) return;

      loadHTMLImage(src).then((img) => {
        if (!img) return;
        if (!safeClear(c)) return;
        const base = new FabricImage(img);
        base.set({
          left: 0,
          top: 0,
          scaleX: c.width / img.width,
          scaleY: c.height / img.height,
          selectable: false,
          evented: false,
        });
        c.add(base);
        addDesignToSmallCanvas(c);
        c.renderAll();
      });
    });
  }, [
    allMockup,
    canvasInstances,
    mockupsByProduct,
    selectedFitType,
    hoveredFitType,
    selectedColor,
    hoveredColor,
    designImage,
  ]);

  // spinner overlays
  useEffect(() => {
    if (!canvas) return;
    if (isLoading) addSpinnerToCanvas(canvas, "front");
    else removeSpinnerFromCanvas(canvas, "front");
  }, [isLoading, designImage, canvas]);

  useEffect(() => {
    if (!backCanvas) return;
    if (isBackLoading) addSpinnerToCanvas(backCanvas, "back");
    else removeSpinnerFromCanvas(backCanvas, "back");
  }, [isBackLoading, designBack, backCanvas]);

  // ------------------ FIT / COLOR SELECTION ------------------

  const toggleMapArray = (setter) => (key, value) => {
    setter((prev) => {
      const arr = prev[key] ?? [];
      const exists = arr.includes(value);
      const next = exists ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const toggleFitAtIndex = toggleMapArray(setSelectedFitType);
  const toggleColorAtIndex = toggleMapArray(setSelectedColor);

  const handleFitHover = (fitOrNull) => {
    if (activeProductIndex === null) return;
    setHoveredFitType((prev) => ({ ...prev, [activeProductIndex]: fitOrNull }));
  };

  const handleHoverColor = (colorOrNull) => {
    if (activeProductIndex === null) return;
    setHoveredColor((prev) => ({ ...prev, [activeProductIndex]: colorOrNull }));
  };

  const handleFitToggle = (fit) => {
    if (activeProductIndex === null) return;
    toggleFitAtIndex(activeProductIndex, fit);
  };

  const handleColorToggle = (color) => {
    if (activeProductIndex === null) return;
    toggleColorAtIndex(activeProductIndex, color);
  };

  const handleBackButtonClick = () => setIsBackView(true);
  const handleFrontButtonClick = () => setIsBackView(false);

  // ------------------ SIMPLE "SAVE IMAGE" HELPER (FRONT) ------------------

  const saveImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png", quality: 1.0 });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "design_with_mockup.png";
    link.click();
  };

  // ------------------ TAGS ------------------

  const [tags, setTags] = useState([]);
  const tagLimit = 10;

  const handleTagKeyDown = (e) => {
    if (e.keyCode === 188 || e.keyCode === 13) {
      e.preventDefault();
      let tag = e.target.value?.trim();
      if (tag && tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) setTags([...tags, tag]);
      } else {
        toast.warning(`Tag limit reached.`);
      }
      e.target.value = "";
    }
  };

  const removeTag = (index) =>
    setTags((prev) => prev.filter((_, i) => i !== index));

  // ------------------ PRODUCT FORM STATE ------------------

  const activeConfig = activeProduct?.name
    ? mockupsByProduct[activeProduct.name.toLowerCase()]
    : null;
  const activeFitList = activeConfig?.fitTypes ?? [];
  const uiFit =
    activeProductIndex !== null
      ? getActiveFit(activeProductIndex, activeFitList[0]) ?? activeFitList[0]
      : undefined;
  const activeColors = uiFit ? activeConfig?.fits?.[uiFit]?.colors ?? [] : [];

  const [brandOption, setBrandOption] = useState("non-brand");
  const [selected, setSelected] = useState("searchable");

  const [features, setFeatures] = useState({
    title: "",
    feature1: "",
    feature2: "",
    description: "",
    price: "",
    brandName: "",
  });

  const [brandId, setBrandId] = useState(null);

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // normalize rect (percent) relative to preview size
  const getNormalizedRect = (side) => {
    const refW =
      side === "FRONT"
        ? canvas?.getWidth?.() || 400
        : backCanvas?.getWidth?.() || 400;
    const refH =
      side === "FRONT"
        ? canvas?.getHeight?.() || 400
        : backCanvas?.getHeight?.() || 400;

    const pos = side === "FRONT" ? designPosition : designBackPosition;
    const sz = side === "FRONT" ? designSize : designBackSize;

    return {
      x: (pos.x || 0) / refW,
      y: (pos.y || 0) / refH,
      w: (sz.width || 0) / refW,
      h: (sz.height || 0) / refH,
    };
  };

  // merge mockup + design into PNG blob (FRONT/BACK)
  const composeSideToBlob = async (baseSrc, side) => {
    const overlayDataURL = side === "FRONT" ? designImage : designBack;
    if (!baseSrc || !overlayDataURL) return null;

    const baseImg = await loadHTMLImage(baseSrc);
    if (!baseImg) return null;

    const el = document.createElement("canvas");
    el.width = baseImg.width;
    el.height = baseImg.height;

    const fc = new Canvas(el, {
      width: el.width,
      height: el.height,
      selection: false,
    });

    const base = new FabricImage(baseImg, {
      left: 0,
      top: 0,
      scaleX: fc.getWidth() / baseImg.width,
      scaleY: fc.getHeight() / baseImg.height,
      selectable: false,
      evented: false,
    });
    fc.add(base);

    const overlayImg = await loadHTMLImage(overlayDataURL);
    if (!overlayImg) {
      fc.dispose();
      return null;
    }

    const norm = getNormalizedRect(side);

    const targetW = Math.max(1, norm.w * fc.getWidth());
    const targetH = Math.max(1, norm.h * fc.getHeight());
    const left = norm.x * fc.getWidth();
    const top = norm.y * fc.getHeight();

    const overlay = new FabricImage(overlayImg, {
      left,
      top,
      scaleX: targetW / overlayImg.width,
      scaleY: targetH / overlayImg.height,
      hasControls: false,
      selectable: false,
      evented: false,
    });
    fc.add(overlay);

    fc.renderAll();

    const blob = await new Promise((resolve) =>
      el.toBlob(resolve, "image/png", 1)
    );
    fc.dispose();

    return blob;
  };

  // ZIP download (all products)
  const downloadAllMockups = async () => {
    try {
      if (!designImage) {
        toast.error("Please upload the FRONT design first.");
        return;
      }
      setIsDownloading(true);
      const zip = new JSZip();
      const designTitle = (features.title || "design").trim() || "design";

      for (const product of allMockup || []) {
        const conf = product?.name
          ? mockupsByProduct[product.name.toLowerCase()]
          : null;
        if (!conf) continue;

        for (const fit of conf.fitTypes || []) {
          const colors = conf.fits?.[fit]?.colors || [];
          if (!colors.length) continue;

          for (const color of colors) {
            const frontSrc = conf.fits[fit]?.colorFront?.[color];
            const backSrc = conf.fits[fit]?.colorBack?.[color];

            if (frontSrc) {
              const frontBlob = await composeSideToBlob(frontSrc, "FRONT");
              if (frontBlob) {
                const path = `${product.name}/${fit}/${color}/${designTitle}_${product.name}_${fit}_${color}_front.png`;
                zip.file(path, frontBlob);
              }
            }
            if (designBack && backSrc) {
              const backBlob = await composeSideToBlob(backSrc, "BACK");
              if (backBlob) {
                const path = `${product.name}/${fit}/${color}/${designTitle}_${product.name}_${fit}_${color}_back.png`;
                zip.file(path, backBlob);
              }
            }
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${designTitle}_all-mockups.zip`);
      toast.success("All mockups are ready in a ZIP!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to prepare images. Check console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  // SINGLE-product FormData for createProduct
  const prepareMockupFiles = async () => {
    if (!Array.isArray(allMockup) || allMockup.length === 0) {
      toast.error("No mockups found.");
      return null;
    }
    if (!designImage) {
      toast.error("Please upload the FRONT design first.");
      return null;
    }
    if (!currentUserId) {
      toast.error("Missing userId.");
      return null;
    }

    const chosenMockup = activeProduct?.id
      ? { id: activeProduct.id, name: activeProduct.name || "mockup" }
      : allMockup[0];

    if (!chosenMockup?.id) {
      toast.error("No mockupId available.");
      return null;
    }

    const conf = chosenMockup?.name
      ? mockupsByProduct[chosenMockup.name.toLowerCase()]
      : null;

    if (!conf) {
      toast.error("No configuration found for the selected mockup.");
      return null;
    }

    const formData = new FormData();
    const designTitle = (features.title || "design").trim() || "design";

    formData.append("title", designTitle);
    formData.append("description", features.description || "");
    formData.append("brandName", features.brandName || "");
    formData.append("price", String(features.price ?? 500));
    formData.append(
      "visibility",
      selected !== "non-searchable" ? "true" : "false"
    );
    formData.append("userId", String(currentUserId));
    formData.append("mockupId", String(chosenMockup.id));

    if (designImageFile)
      formData.append("frontDesign", designImageFile, "designFront");
    if (designBackFile)
      formData.append("backDesign", designBackFile, "designBack");

    if (brandId) formData.append("brandId", brandId);
    if (features.brandCommissionPct != null) {
      formData.append(
        "brandCommissionPct",
        String(features.brandCommissionPct)
      );
    }
    if (features.merchantCommissionPct != null) {
      formData.append(
        "merchantCommissionPct",
        String(features.merchantCommissionPct)
      );
    }

    (tags || []).forEach((tag, i) => {
      if (tag) formData.append(`tags[${i}]`, String(tag));
    });
    [features.feature1, features.feature2].filter(Boolean).forEach((f, i) => {
      formData.append(`features[${i}]`, String(f));
    });

    const fitsToUse =
      activeProductIndex !== null &&
      selectedFitType[activeProductIndex] &&
      selectedFitType[activeProductIndex].length
        ? selectedFitType[activeProductIndex]
        : conf.fitTypes || [];

    let vIndex = 0;

    for (const fit of fitsToUse) {
      const allColors = conf.fits?.[fit]?.colors || [];
      const chosenColors =
        activeProductIndex !== null &&
        selectedColor[activeProductIndex] &&
        selectedColor[activeProductIndex].length
          ? selectedColor[activeProductIndex].filter((c) =>
              allColors.includes(c)
            )
          : allColors;

      for (const color of chosenColors) {
        const frontSrc = conf.fits[fit]?.colorFront?.[color];
        const backSrc = conf.fits[fit]?.colorBack?.[color];

        formData.append(`variants[${vIndex}][color]`, String(color));
        formData.append(`variants[${vIndex}][fitType]`, String(fit));

        if (frontSrc) {
          const frontBlob = await composeSideToBlob(frontSrc, "FRONT");
          if (frontBlob) {
            formData.append(
              `variants[${vIndex}][frontImg]`,
              frontBlob,
              `${designTitle}_${chosenMockup.name}_${fit}_${color}_front.png`
            );
          }
        }

        if (designBack && backSrc) {
          const backBlob = await composeSideToBlob(backSrc, "BACK");
          if (backBlob) {
            formData.append(
              `variants[${vIndex}][backImg]`,
              backBlob,
              `${designTitle}_${chosenMockup.name}_${fit}_${color}_back.png`
            );
          }
        }

        vIndex++;
      }
    }

    if (vIndex === 0) {
      toast.error("No valid fit/color combinations for the selected mockup.");
      return null;
    }

    return formData;
  };

  const router = useRouter();

  const handleCreateProduct = async () => {
    try {
      const formData = await prepareMockupFiles();
      if (!formData) return;

      const product = await createProduct(formData);

      if (product.success) {
        toast.success("Product created!");
        router.push("/dashboard");
      } else {
        console.error("Failed to create product:", product.message);
        toast.error(product.message || "Failed to create product.");
      }
    } catch (error) {
      console.error("Error in handleCreateProduct:", error?.message || error);
      toast.error(error?.message || "Error creating product.");
    }
  };

  // ------------------ JSX ------------------

  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>

          <div className='col-lg-9'>
            <div className='dashboard-area__content'>
              <div className='dashboard-area__top'>
                <h2 className='dashboard-area__title'>Create Products</h2>
                <a href='#' className='commerce-btn'>
                  Select Products <i className='icon-right-arrow' />
                </a>
              </div>

              {/* FRONT DESIGN UPLOAD AREA */}
              <div className='dashboard-area__uplode'>
                <div className='dashboard-area__uplode-box'>
                  <form>
                    <div className='upload-area file-upload__area'>
                      <label
                        htmlFor='image-upload'
                        className='file-upload__label'
                      >
                        <input
                          ref={inputFileRef}
                          type='file'
                          id='image-upload'
                          className='file-upload__input'
                          hidden
                          onChange={handleFileChange}
                          accept='image/*'
                        />
                        {isLoading ? (
                          <div
                            className='spinner-border text-primary'
                            role='status'
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                        ) : (
                          designImage && (
                            <img
                              src={designImage}
                              alt='Uploaded Design'
                              width={200}
                              height={200}
                            />
                          )
                        )}

                        {designImage ? (
                          ""
                        ) : (
                          <>
                            <div className='image-upload__icon'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='60'
                                height='60'
                                viewBox='0 0 60 60'
                                fill='none'
                              >
                                <path
                                  d='M49.9908 22.055C47.2178 11.008 36.0146 4.30066 24.9676 7.07371C16.3346 9.24086 10.0661 16.7022 9.42027 25.5795C3.29051 26.5903 -0.859227 32.3789 0.151639 38.5086C1.05025 43.9581 5.77216 47.9489 11.2951 47.927H20.669V44.1774H11.2951C7.15341 44.1774 3.79589 40.8199 3.79589 36.6783C3.79589 32.5366 7.15341 29.1791 11.2951 29.1791C12.3305 29.1791 13.1699 28.3397 13.1699 27.3043C13.1605 17.9855 20.7074 10.4235 30.0261 10.4142C38.0929 10.4062 45.037 16.1091 46.5975 24.0234C46.7515 24.8136 47.3928 25.4173 48.191 25.5232C53.3165 26.2531 56.8797 30.9997 56.1499 36.1251C55.4945 40.7275 51.565 44.1542 46.9162 44.1774H39.417V47.927H46.9162C54.1641 47.9051 60.0219 42.0117 59.9999 34.7637C59.9816 28.7304 55.8519 23.4867 49.9908 22.055Z'
                                  fill='black'
                                />
                                <path
                                  d='M28.7118 29.7229L21.2126 37.2221L23.8561 39.8656L28.1681 35.5723V53.5516H31.9177V35.5723L36.211 39.8656L38.8545 37.2221L31.3553 29.7229C30.624 28.996 29.4431 28.996 28.7118 29.7229Z'
                                  fill='black'
                                />
                              </svg>
                            </div>
                            <span className='file-name'>{fileName}</span>
                            <div className='image-upload__text-box'>
                              <h3 className='image-upload__title'>
                                Drag and drop artwork here
                              </h3>
                              <p className='image-upload__text'>
                                or Click to browse for a file
                              </p>
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  </form>
                </div>

                {/* Guidelines */}
                <div className='dashboard-area__tag-box'>
                  <div className='tag-box-top'>
                    <h2 className='tag-box-title'>Artwork should be:</h2>
                    <button
                      className='tag-box-button'
                      data-target='.tag-box-button__list'
                    >
                      <i className='fas fa-caret-down' />
                    </button>
                  </div>
                  <div className='dashboard-area__list tag-box-button__list toggle-list'>
                    <button className='tag-iterm'>PNG format</button>
                    <button className='tag-iterm'>
                      As large as possible (≥ 4500px)
                    </button>
                    <button className='tag-iterm'>
                      RGB color, 8 bits/channel
                    </button>
                    <button className='tag-iterm'>Less than 25 MB</button>
                  </div>
                </div>
              </div>

              {/* Product grid with canvases */}
              <div className='product-category-list d-flex overflow-x-auto'>
                {allMockup.map((item, index) => (
                  <div className='item' key={item.id ?? index}>
                    <div className='product__item-two'>
                      <div className='product__item-two__img'>
                        <a href='#' className='product__item-two__img__item'>
                          <canvas
                            ref={(el) => {
                              if (el) canvasRefs.current[index] = el;
                            }}
                            style={{
                              border: "1px solid #ddd",
                              position: "relative",
                            }}
                          />
                        </a>
                      </div>
                      <div className='product__item-two__content'>
                        <h4 className='product__item-two__title'>
                          <a href='product-details'>{item.name}</a>
                        </h4>

                        <button
                          className='commerce-btn product__item-two__link'
                          onClick={() => setActiveProductIndex(index)}
                        >
                          Edit Details <i className='icon-right-arrow'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active product preview + options */}
              {activeProduct && (
                <div className='product-preview-panel'>
                  <h2>Preview for {activeProduct.name}</h2>

                  <div className='row gutter-x-30 gutter-y-30'>
                    <div className='col-lg-6'>
                      <div className='product-preview-panel__view-toggle'>
                        <button
                          className={`toggle-btn ${
                            !isBackView ? "active" : ""
                          }`}
                          onClick={handleFrontButtonClick}
                        >
                          Front
                        </button>
                        <button
                          className={`toggle-btn ${isBackView ? "active" : ""}`}
                          onClick={handleBackButtonClick}
                        >
                          Back
                        </button>
                      </div>

                      {isBackView ? (
                        <label htmlFor='backimage-upload'>
                          <canvas
                            ref={canvasBackRef}
                            className={`front ${isBackView ? "" : "d-none"}`}
                            style={{
                              border: "1px solid #ddd",
                              position: "relative",
                            }}
                          />
                          <input
                            type='file'
                            id='backimage-upload'
                            className='file-upload__input'
                            hidden
                            onChange={handleBackFileChange}
                            disabled={!!designBack}
                            accept='image/*'
                          />
                        </label>
                      ) : (
                        <div>
                          <canvas
                            ref={canvasRef}
                            className={`front ${isBackView ? "d-none" : ""}`}
                            style={{
                              border: "1px solid #ddd",
                              position: "relative",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className='col-lg-6'>
                      <div className='product-preview-panel__product-options'>
                        {/* FITS */}
                        <div className='product-preview-panel__fit-type-selector'>
                          <p className='product-preview-panel__label'>
                            Choose fit types:
                          </p>
                          <div className='d-flex gap-3 flex-wrap'>
                            {(activeConfig?.fitTypes ?? []).map((fit) => {
                              const checked = (
                                selectedFitType[activeProductIndex] ?? []
                              ).includes(fit);
                              return (
                                <label
                                  key={fit}
                                  className='fit-checkbox'
                                  onMouseEnter={() => handleFitHover(fit)}
                                  onMouseLeave={() => handleFitHover(null)}
                                >
                                  <input
                                    type='checkbox'
                                    name='fitType'
                                    checked={checked}
                                    onChange={() => handleFitToggle(fit)}
                                  />
                                  <span className='custom-check'></span>
                                  {fit.charAt(0) + fit.slice(1).toLowerCase()}
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* COLORS */}
                        <div className='product-preview-panel__color-chooser'>
                          <p className='product-preview-panel__label'>
                            Choose colors:
                          </p>
                          <div className='color-options d-flex gap-2 flex-wrap'>
                            {(activeColors ?? []).map((color) => {
                              const checked = (
                                selectedColor[activeProductIndex] ?? []
                              ).includes(color);
                              return (
                                <label
                                  key={color}
                                  className='color-option'
                                  style={{ position: "relative" }}
                                >
                                  <input
                                    type='checkbox'
                                    name='productColor'
                                    value={color}
                                    checked={checked}
                                    onChange={() => handleColorToggle(color)}
                                    style={{ display: "none" }}
                                  />
                                  <span
                                    className={`color-circle ${
                                      checked ? "is-checked" : ""
                                    }`}
                                    style={{
                                      backgroundColor: color,
                                      width: 36,
                                      height: 36,
                                      display: "inline-block",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                      position: "relative",
                                    }}
                                    onMouseEnter={() => handleHoverColor(color)}
                                    onMouseLeave={() => handleHoverColor(null)}
                                    title={color}
                                  >
                                    {checked && (
                                      <span
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          color: "white",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          textShadow: "0 0 2px rgba(0,0,0,0.5)",
                                        }}
                                      >
                                        ✓
                                      </span>
                                    )}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className='product-preview-panel__price-input-field'>
                          <label className='product-preview-panel__label'>
                            Price (Minimum BDT 500):
                          </label>
                          <input
                            type='text'
                            placeholder='BDT 0.00'
                            onChange={(e) =>
                              setFeatures((p) => ({
                                ...p,
                                price: Number(e.target.value) || 500,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Details Form */}
              <div className='product-details__form mt-4'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Artworld should be:
                  </h2>
                  <button
                    className='tag-box-button'
                    data-target='.product-details__form-two'
                  >
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>

                <form
                  action='#'
                  className='product-details__form-two toggle-list'
                >
                  <div className='row gutter-x-30 gutter-y-30'>
                    <div className='col-lg-6'>
                      <div className='product-details__form__content'>
                        <h4 className='product-details__form__title'>
                          Product details (required)
                        </h4>
                        <p className='product-details__form__text'>
                          Product names will be appended to this design title.
                        </p>
                      </div>

                      <div className='form-group'>
                        <div className='form-control-two'>
                          <label htmlFor='title'>Design Title</label>
                          <input
                            type='text'
                            name='title'
                            id='title'
                            value={features.title}
                            onChange={handleFeatureChange}
                          />
                          <span>
                            60 characters remaining (minimum 3 characters)
                          </span>
                        </div>

                        <div className='form-control-two'>
                          <label>Select Brand</label>

                          {user?.merchantProfile?.brandOption ? (
                            <>
                              <div className='flex items-center gap-4 mt-2'>
                                <label>
                                  <input
                                    type='radio'
                                    name='brandOption'
                                    value='non-brand'
                                    checked={brandOption === "non-brand"}
                                    onChange={(e) =>
                                      setBrandOption(e.target.value)
                                    }
                                  />
                                  Non-brand
                                </label>

                                <label>
                                  <input
                                    type='radio'
                                    name='brandOption'
                                    value='select-brand'
                                    checked={brandOption === "select-brand"}
                                    onChange={(e) =>
                                      setBrandOption(e.target.value)
                                    }
                                  />
                                  Select Brand
                                </label>
                              </div>

                              {brandOption === "non-brand" && (
                                <input
                                  type='text'
                                  name='brandName'
                                  placeholder='Write your brand'
                                  className='mt-2'
                                  onChange={handleFeatureChange}
                                />
                              )}

                              {brandOption === "select-brand" && (
                                <BrandDropdown
                                  brands={brands}
                                  onBrandChange={(id) => setBrandId(id)}
                                />
                              )}
                            </>
                          ) : (
                            <>
                              <div className='d-flex align-items-center gap-4 mt-2'>
                                <label>
                                  <input
                                    type='radio'
                                    name='brandOption'
                                    value='non-brand'
                                    checked={brandOption === "non-brand"}
                                    onChange={(e) =>
                                      setBrandOption(e.target.value)
                                    }
                                  />
                                  Non-brand
                                </label>

                                <label>
                                  <input
                                    type='radio'
                                    name='brandOption'
                                    value='select-brand'
                                    checked={brandOption === "select-brand"}
                                    onChange={(e) =>
                                      setBrandOption(e.target.value)
                                    }
                                  />
                                  Select Brand
                                </label>
                              </div>

                              {brandOption === "non-brand" && (
                                <input
                                  type='text'
                                  name='brandName'
                                  placeholder='Write your brand'
                                  className='mt-2'
                                  onChange={handleFeatureChange}
                                />
                              )}

                              {brandOption === "select-brand" && (
                                <BrandDropdown />
                              )}
                            </>
                          )}

                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className='product-details__form__content'>
                        <h4 className='product-details__form__title'>
                          Product Features (optional)
                        </h4>
                        <p className='product-details__form__text'>
                          Summarize the unique details of your design.
                        </p>
                      </div>

                      <div className='form-group'>
                        <div className='form-control-two'>
                          <label htmlFor='feature1'>Feature bullet 1</label>
                          <input
                            type='text'
                            name='feature1'
                            id='feature1'
                            value={features.feature1}
                            onChange={handleFeatureChange}
                          />
                          <span>256 characters remaining</span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='feature2'>Feature bullet 2</label>
                          <input
                            type='text'
                            name='feature2'
                            id='feature2'
                            value={features.feature2}
                            onChange={handleFeatureChange}
                          />
                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='description'>
                            Product description
                          </label>
                          <textarea
                            name='description'
                            id='description'
                            placeholder='Minimum 75 characters'
                            value={features.description}
                            onChange={handleFeatureChange}
                          ></textarea>
                          <span>200 characters remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Keywords */}
              <div className='product-details__keyword'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Artworld should be:
                  </h2>
                </div>
                <p className='product-details__keyword__text'>
                  Add tags/keywords to improve search visibility.
                </p>
                <div className='keyword toggle-list'>
                  <label htmlFor='tagInput' className='tag-input-label'>
                    *Product Keyword
                  </label>
                  <div className='tag-input-wrapper'>
                    <div className='tag-box' id='tagBox'>
                      {tags.map((tag, index) => (
                        <Tag
                          key={index}
                          tag={tag}
                          onRemove={() => removeTag(index)}
                        />
                      ))}

                      <input
                        type='text'
                        id='tagInput'
                        className='tag-input'
                        maxLength={200}
                        onKeyDown={handleTagKeyDown}
                      />
                    </div>
                    <p className='char-limit' id='charLimit'>
                      200 characters remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className='product-details__availability'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Product availability on Amazon
                  </h2>
                  <button
                    className='tag-box-button'
                    data-target='.product-details-form'
                  >
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>
                <form action='#' className='toggle-list product-details-form'>
                  <div className='row gutter-x-6'>
                    <div className='col-lg-6'>
                      <div
                        className='product-details__item-box'
                        onClick={() => setSelected("non-searchable")}
                      >
                        <label
                          htmlFor='non-searchable'
                          className='availability__item'
                        >
                          <input
                            type='radio'
                            id='non-searchable'
                            name='searchability'
                            value='non-searchable'
                            className='sr-only'
                            checked={selected === "non-searchable"}
                            onChange={() => setSelected("non-searchable")}
                          />
                          <span
                            className={`custom-radio-circle ${
                              selected === "non-searchable" ? "active" : ""
                            }`}
                          ></span>
                          <div className='availability__item__content'>
                            <h3 className='availability__item__title'>
                              Non-searchable
                            </h3>
                            <p className='availability__item__text'>
                              Does not appear in Sadamata search results
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div
                        className='product-details__item-box'
                        onClick={() => setSelected("searchable")}
                      >
                        <label
                          htmlFor='searchable'
                          className='availability__item'
                        >
                          <input
                            type='radio'
                            id='searchable'
                            name='searchability'
                            value='searchable'
                            className='sr-only'
                            checked={selected === "searchable"}
                            onChange={() => setSelected("searchable")}
                          />
                          <span
                            className={`custom-radio-circle ${
                              selected === "searchable" ? "active" : ""
                            }`}
                          ></span>
                          <div className='availability__item__content'>
                            <h3 className='availability__item__title'>
                              Searchable
                            </h3>
                            <p className='availability__item__text'>
                              Appears in Amazon search results
                            </p>
                            <p className='availability__item__text'>
                              Customers can find these products through Sadamata
                              search results
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>

                <div className='product-details__btn-group'>
                  <button type='button' className='commerce-btn'>
                    Save draft<i className='icon-right-arrow'></i>
                  </button>
                  <button
                    type='button'
                    className='commerce-btn ms-3'
                    onClick={handleCreateProduct}
                  >
                    Publish <i className='icon-right-arrow'></i>
                  </button>
                  {/* Optional utilities:
                  <button className="commerce-btn ms-3" onClick={saveImage}>
                    Save Front Image
                  </button>
                  <button
                    className="commerce-btn ms-3"
                    onClick={downloadAllMockups}
                    disabled={isDownloading || !designImage}
                  >
                    {isDownloading ? "Preparing ZIP..." : "Download All Images (ZIP)"}
                  </button> */}
                </div>

                <p className='product-details__availability__text'>
                  By submitting for production, you acknowledge you have all the
                  necessary rights to the original artwork, brand name, design
                  title, product features and description.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
