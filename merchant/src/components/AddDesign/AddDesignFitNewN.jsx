"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, FabricImage, Rect } from "fabric"; // Fabric.js v6
import DashSidebar from "../DashSidebar/DashSidebar";
import Tag from "./Tag";
import { toast } from "sonner";
import { createProduct } from "@/app/actions/product/product.actions";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import BrandDropdown from "./BrandDropDown";

const SPINNER_SVG_DATAURI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="20" stroke="#3b82f6" stroke-width="5" fill="none" opacity="0.2"/>
  <path fill="none" stroke="#3b82f6" stroke-width="5"
        d="M25 5 a20 20 0 0 1 0 40"/>
</svg>`);

export default function AddDesignFitNewN({
  allMockup = [],
  currentUserId,
  brands = [],
  user,
}) {
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [designImage, setDesignImage] = useState(null);
  const [designBack, setDesignBack] = useState(null);
  const [designImageFile, setDesignImageFile] = useState(null);
  const [designBackFile, setDesignBackFile] = useState(null);

  // Multi-select choices + hover preview
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

  // Fabric canvases (front/back + grid thumbnails)
  const [canvas, setCanvas] = useState(null);
  const [backCanvas, setBackCanvas] = useState(null);
  const canvasRef = useRef(null);
  const canvasBackRef = useRef(null);
  const canvasRefs = useRef([]);
  const [canvasInstances, setCanvasInstances] = useState([]);

  // Placement boxes
  const [frontBox, setFrontBox] = useState({ x: 110, y: 80, w: 180, h: 220 });
  const [backBox, setBackBox] = useState({ x: 110, y: 80, w: 180, h: 220 });
  const frontBoxRef = useRef(null);
  const backBoxRef = useRef(null);
  const [showBoxes, setShowBoxes] = useState(true);

  // Track live design bounds (for WYSIWYG export)
  const [frontBounds, setFrontBounds] = useState(null);
  const [backBounds, setBackBounds] = useState(null);

  // Keep references to the design images on each canvas
  const frontDesignRef = useRef(null);
  const backDesignRef = useRef(null);

  // Loading / spinner
  const [isLoading, setIsLoading] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [spinnerFront, setSpinnerFront] = useState(null);
  const [spinnerBack, setSpinnerBack] = useState(null);

  const [isBackView, setIsBackView] = useState(false);

  const inputFileRef = useRef(null);

  const activeProduct =
    activeProductIndex !== null ? allMockup?.[activeProductIndex] ?? null : null;

  // Build mapping: product -> fits -> colors -> images
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

        if (!fits[fit]) fits[fit] = { colorFront: {}, colorBack: {}, colors: [] };
        fits[fit].colorFront[color] = v.frontImg;
        fits[fit].colorBack[color] = v.backImg;
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

  // File handlers
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setIsLoading(true);
      setDesignImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignImage(String(reader.result));
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setBackFileName(file.name);
      setDesignBackFile(file);
      setIsBackLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignBack(String(reader.result));
        setIsBackLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------- Fabric Canvas Init ----------
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

  // Grid canvas instances init once
  useEffect(() => {
    const refs = canvasRefs.current.filter(Boolean);
    if (!refs.length) return;

    const instances = refs.map(
      (ref) => new Canvas(ref, { width: 200, height: 200, selection: false })
    );
    setCanvasInstances(instances);

    return () => {
      instances.forEach((c) => c && c.dispose());
    };
  }, [allMockup.length]);

  const safeClear = (fabricCanvas) => {
    const ok =
      fabricCanvas?.lowerCanvasEl &&
      typeof fabricCanvas.lowerCanvasEl.getContext === "function";
    if (!ok) return false;
    fabricCanvas.clear();
    return true;
  };

  // Spinner helpers
  const addSpinnerToCanvas = (fabricCanvas, which) => {
    if (!fabricCanvas) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
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

  // Safe image loader (CORS)
  const loadHTMLImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  // Draw placement box
  function drawPlacementBox(fabricCanvas, box, side) {
    const prev = side === "front" ? frontBoxRef.current : backBoxRef.current;
    if (prev) fabricCanvas.remove(prev);

    const r = new Rect({
      left: box.x,
      top: box.y,
      width: box.w,
      height: box.h,
      rx: 10,
      ry: 10,
      fill: showBoxes ? "rgba(59,130,246,0.08)" : "rgba(0,0,0,0.001)",
      stroke: showBoxes ? "#3b82f6" : "rgba(0,0,0,0.001)",
      strokeDashArray: showBoxes ? [6, 6] : null,
      strokeWidth: showBoxes ? 2 : 0.01,
      selectable: false,
      evented: false,
    });

    fabricCanvas.add(r);
    if (side === "front") frontBoxRef.current = r;
    else backBoxRef.current = r;
    // Fabric v6: use bringObjectToFront
    fabricCanvas.bringObjectToFront(r);
    fabricCanvas.renderAll();
  }

  // Constrain + clip helpers
  function attachGuards(fabricCanvas, img, box, setBounds) {
    const clampToBox = () => {
      const bounds = img.getBoundingRect(true, true);
      let dx = 0,
        dy = 0;

      if (bounds.left < box.x) dx = box.x - bounds.left;
      if (bounds.top < box.y) dy = box.y - bounds.top;
      if (bounds.left + bounds.width > box.x + box.w)
        dx = box.x + box.w - (bounds.left + bounds.width);
      if (bounds.top + bounds.height > box.y + box.h)
        dy = box.y + box.h - (bounds.top + bounds.height);

      img.left = (img.left ?? 0) + dx;
      img.top = (img.top ?? 0) + dy;
    };

    const minMaxScale = () => {
      const iw = img.width || 1;
      const ih = img.height || 1;
      const maxScaleX = box.w / iw;
      const maxScaleY = box.h / ih;
      const maxScale = Math.min(maxScaleX, maxScaleY);
      const MIN = 0.05;
      img.scaleX = Math.min(Math.max(img.scaleX ?? 1, MIN), maxScale);
      img.scaleY = Math.min(Math.max(img.scaleY ?? 1, MIN), maxScale);
    };

    const updateBounds = () => {
      const b = img.getBoundingRect(true, true);
      setBounds({ left: b.left, top: b.top, width: b.width, height: b.height });
    };

    const guard = () => {
      minMaxScale();
      clampToBox();
      updateBounds();
      fabricCanvas.renderAll();
    };

    img.on("moving", guard);
    img.on("scaling", guard);
    img.on("rotating", guard);
    // initial record
    updateBounds();
  }

  // Add front/back design with clipPath + constraints
  const addDesignToCanvas = async (fabricCanvas, box, side) => {
    const src = side === "FRONT" ? designImage : designBack;
    if (!fabricCanvas || !src) return;

    const imgEl = await loadHTMLImage(src);

    // initial fit into box
    const scale = Math.min(box.w / imgEl.width, box.h / imgEl.height);
    const initW = imgEl.width * scale;
    const initH = imgEl.height * scale;
    const initLeft = box.x + (box.w - initW) / 2;
    const initTop = box.y + (box.h - initH) / 2;

    const fi = new FabricImage(imgEl, {
      left: initLeft,
      top: initTop,
      scaleX: scale,
      scaleY: scale,
      lockUniScaling: true,
      cornerStyle: "circle",
      transparentCorners: false,
      clipPath: new Rect({
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        absolutePositioned: true,
      }),
    });

    fabricCanvas.add(fi);
    fabricCanvas.setActiveObject(fi);

    if (side === "FRONT") {
      frontDesignRef.current = fi;
      attachGuards(fabricCanvas, fi, box, setFrontBounds);
    } else {
      backDesignRef.current = fi;
      attachGuards(fabricCanvas, fi, box, setBackBounds);
    }

    // keep box on top
    const r = side === "FRONT" ? frontBoxRef.current : backBoxRef.current;
    if (r) fabricCanvas.bringObjectToFront(r);
    fabricCanvas.renderAll();
  };

  // Defaults when product changes
  useEffect(() => {
    if (activeProductIndex === null) return;
    const product = allMockup[activeProductIndex];
    if (!product) return;

    const conf = mockupsByProduct[product.name?.toLowerCase?.()];
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

  // FRONT render
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

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = async () => {
      if (!safeClear(canvas)) return;
      const base = new FabricImage(img, {
        left: 0,
        top: 0,
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        selectable: false,
        evented: false,
      });
      canvas.add(base);

      // placement box + design
      drawPlacementBox(canvas, frontBox, "front");
      await addDesignToCanvas(canvas, frontBox, "FRONT");
    };
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
    frontBox.x,
    frontBox.y,
    frontBox.w,
    frontBox.h,
    showBoxes,
  ]);

  // BACK render
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

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = async () => {
      if (!safeClear(backCanvas)) return;
      const base = new FabricImage(img, {
        left: 0,
        top: 0,
        scaleX: backCanvas.width / img.width,
        scaleY: backCanvas.height / img.height,
        selectable: false,
        evented: false,
      });
      backCanvas.add(base);

      // placement box + design
      drawPlacementBox(backCanvas, backBox, "back");
      await addDesignToCanvas(backCanvas, backBox, "BACK");
    };
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
    backBox.x,
    backBox.y,
    backBox.w,
    backBox.h,
    showBoxes,
  ]);

  // Grid renders
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

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        if (!safeClear(c)) return;
        const base = new FabricImage(img, {
          left: 0,
          top: 0,
          scaleX: c.width / img.width,
          scaleY: c.height / img.height,
          selectable: false,
          evented: false,
        });
        c.add(base);

        // small preview: just center the design thumbnail
        if (designImage) {
          const thumbImg = new Image();
          thumbImg.crossOrigin = "anonymous";
          thumbImg.src = designImage;
          thumbImg.onload = () => {
            const target = 80;
            const sc = Math.min(target / thumbImg.width, target / thumbImg.height);
            const fi = new FabricImage(thumbImg, {
              left: (c.width - thumbImg.width * sc) / 2,
              top: (c.height - thumbImg.height * sc) / 2,
              scaleX: sc,
              scaleY: sc,
              selectable: false,
              evented: false,
            });
            c.add(fi);
            c.renderAll();
          };
        } else {
          c.renderAll();
        }
      };
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

  // Spinners for previews
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

  // Hover + toggle handlers
  const toggleMapArray =
    (setter) =>
    (key, value) => {
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

  // Tags
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

  // UI lists for active product
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

  // Product features
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

  // ======= EXPORT/ZIP/CREATE PRODUCT =======

  // Use design bounding box (if present) else fall back to placement box
  const getNormalizedRect = (side) => {
    const c = side === "FRONT" ? canvas : backCanvas;
    const box = side === "FRONT" ? frontBox : backBox;
    const bnd = side === "FRONT" ? frontBounds : backBounds;

    const refW = c?.getWidth?.() || 400;
    const refH = c?.getHeight?.() || 400;

    const src = bnd || { left: box.x, top: box.y, width: box.w, height: box.h };

    return {
      x: (src.left || 0) / refW,
      y: (src.top || 0) / refH,
      w: (src.width || 0) / refW,
      h: (src.height || 0) / refH,
    };
  };

  // Compose side at base resolution using normalized rect
  const composeSideToBlob = async (baseSrc, side) => {
    const overlayDataURL = side === "FRONT" ? designImage : designBack;
    if (!baseSrc || !overlayDataURL) return null;

    const baseImg = await loadHTMLImage(baseSrc);

    const el = document.createElement("canvas");
    el.width = baseImg.width;
    el.height = baseImg.height;

    const fc = new Canvas(el, { width: el.width, height: el.height, selection: false });

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

    const blob = await new Promise((resolve) => el.toBlob(resolve, "image/png", 1));
    fc.dispose();
    return blob;
  };

  // Download all as ZIP (respects fits/colors and your live bounds)
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

  // SINGLE product FormData for createProduct; uses live bounds/box
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

    const chosenMockup =
      activeProduct?.id
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

    // Root/meta
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

    if (designImageFile) formData.append("frontDesign", designImageFile, "designFront");
    if (designBackFile) formData.append("backDesign", designBackFile, "designBack");

    if (brandId) formData.append("brandId", brandId);
    if (features.brandCommissionPct != null) {
      formData.append("brandCommissionPct", String(features.brandCommissionPct));
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
    [features.feature1, features.feature2]
      .filter(Boolean)
      .forEach((f, i) => {
        formData.append(`features[${i}]`, String(f));
      });

    // Use only checked fits/colors (fallback to all if none checked)
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
          ? selectedColor[activeProductIndex].filter((c) => allColors.includes(c))
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

  const handleCreateProduct = async () => {
    try {
      const formData = await prepareMockupFiles();
      if (!formData) return;

      const product = await createProduct(formData);

      if (product.success) {
        toast.success("Product created!");
      } else {
        console.error("Failed to create product:", product.message);
        toast.error(product.message || "Failed to create product.");
      }
    } catch (error) {
      console.error("Error in handleCreateProduct:", error?.message || error);
      toast.error(error?.message || "Error creating product.");
    }
  };

  return (
    <section className="dashboard-area section-space">
      <div className="container">
        <div className="row gutter-x-40">
          <div className="col-lg-3">
            <DashSidebar />
          </div>

          <div className="col-lg-9">
            <div className="dashboard-area__content">
              <div className="dashboard-area__top">
                <h2 className="dashboard-area__title">Create Products</h2>
                <a href="#" className="commerce-btn">
                  Select Products <i className="icon-right-arrow" />
                </a>
              </div>

              {/* Upload area */}
              <div className="dashboard-area__uplode">
                <div className="dashboard-area__uplode-box">
                  <form>
                    <div className="upload-area file-upload__area">
                      <label htmlFor="image-upload" className="file-upload__label">
                        <input
                          ref={inputFileRef}
                          type="file"
                          id="image-upload"
                          className="file-upload__input"
                          hidden
                          onChange={handleFileChange}
                        />
                        {isLoading ? (
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          designImage && (
                            <img
                              src={designImage}
                              alt="Uploaded Design"
                              width={200}
                              height={200}
                            />
                          )
                        )}

                        {designImage ? (
                          ""
                        ) : (
                          <>
                            <div className="image-upload__icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="60"
                                height="60"
                                viewBox="0 0 60 60"
                                fill="none"
                              >
                                <path
                                  d="M49.9908 22.055C47.2178 11.008 36.0146 4.30066 24.9676 7.07371C16.3346 9.24086 10.0661 16.7022 9.42027 25.5795C3.29051 26.5903 -0.859227 32.3789 0.151639 38.5086C1.05025 43.9581 5.77216 47.9489 11.2951 47.927H20.669V44.1774H11.2951C7.15341 44.1774 3.79589 40.8199 3.79589 36.6783C3.79589 32.5366 7.15341 29.1791 11.2951 29.1791C12.3305 29.1791 13.1699 28.3397 13.1699 27.3043C13.1605 17.9855 20.7074 10.4235 30.0261 10.4142C38.0929 10.4062 45.037 16.1091 46.5975 24.0234C46.7515 24.8136 47.3928 25.4173 48.191 25.5232C53.3165 26.2531 56.8797 30.9997 56.1499 36.1251C55.4945 40.7275 51.565 44.1542 46.9162 44.1774H39.417V47.927H46.9162C54.1641 47.9051 60.0219 42.0117 59.9999 34.7637C59.9816 28.7304 55.8519 23.4867 49.9908 22.055Z"
                                  fill="black"
                                />
                                <path
                                  d="M28.7118 29.7229L21.2126 37.2221L23.8561 39.8656L28.1681 35.5723V53.5516H31.9177V35.5723L36.211 39.8656L38.8545 37.2221L31.3553 29.7229C30.624 28.996 29.4431 28.996 28.7118 29.7229Z"
                                  fill="black"
                                />
                              </svg>
                            </div>
                            <span className="file-name">{fileName}</span>
                            <div className="image-upload__text-box">
                              <h3 className="image-upload__title">
                                Drag and drop artwork here
                              </h3>
                              <p className="image-upload__text">
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
                <div className="dashboard-area__tag-box">
                  <div className="tag-box-top">
                    <h2 className="tag-box-title">Artwork should be:</h2>
                    <button
                      className="tag-box-button"
                      data-target=".tag-box-button__list"
                    >
                      <i className="fas fa-caret-down" />
                    </button>
                  </div>
                  <div className="dashboard-area__list tag-box-button__list toggle-list">
                    <button className="tag-iterm">PNG format</button>
                    <button className="tag-iterm">
                      As large as possible (≥ 4500px)
                    </button>
                    <button className="tag-iterm">RGB color, 8 bits/channel</button>
                    <button className="tag-iterm">Less than 25 MB</button>
                  </div>
                </div>
              </div>

              {/* Product grid */}
              <div className="product-category-list d-flex overflow-x-auto">
                {allMockup.map((item, index) => (
                  <div className="item" key={item.id ?? index}>
                    <div className="product__item-two">
                      <div className="product__item-two__img">
                        <a href="#" className="product__item-two__img__item">
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
                      <div className="product__item-two__content">
                        <h4 className="product__item-two__title">
                          <a href="product-details">{item.name}</a>
                        </h4>

                        <button
                          className="commerce-btn product__item-two__link"
                          onClick={() => setActiveProductIndex(index)}
                        >
                          Edit Details <i className="icon-right-arrow"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active product preview */}
              {activeProduct && (
                <div className="product-preview-panel">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2>Preview for {activeProduct.name}</h2>
                    <div className="d-flex gap-2 align-items-center">
                      <label className="d-flex gap-2 align-items-center">
                        <input
                          type="checkbox"
                          checked={showBoxes}
                          onChange={() => setShowBoxes((s) => !s)}
                        />
                        Show placement box
                      </label>
                    </div>
                  </div>

                  <div className="row gutter-x-30 gutter-y-30">
                    <div className="col-lg-6">
                      <div className="product-preview-panel__view-toggle">
                        <button
                          className={`toggle-btn ${!isBackView ? "active" : ""}`}
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
                        <label htmlFor="backimage-upload">
                          <canvas
                            ref={canvasBackRef}
                            className={`front ${isBackView ? "" : "d-none"}`}
                            style={{
                              border: "1px solid #ddd",
                              position: "relative",
                            }}
                          />
                          <input
                            type="file"
                            id="backimage-upload"
                            className="file-upload__input"
                            hidden
                            onChange={handleBackFileChange}
                          />
                          {designBack ? (
                            <small className="text-muted d-block mt-2">
                              Back design loaded: {backFileName || "custom image"}
                            </small>
                          ) : (
                            <small className="text-muted d-block mt-2">
                              Click canvas to upload a back design
                            </small>
                          )}
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

                      {/* Quick placement helpers for the active side */}
                      <div className="d-flex gap-2 mt-2 flex-wrap">
                        <button
                          className="commerce-btn"
                          onClick={() => {
                            const c = isBackView ? backCanvas : canvas;
                            const d = isBackView
                              ? backDesignRef.current
                              : frontDesignRef.current;
                            const box = isBackView ? backBox : frontBox;
                            if (!d || !c) return;
                            const iw = d.width || 1;
                            const ih = d.height || 1;
                            const scale = Math.min(box.w / iw, box.h / ih);
                            d.set({
                              scaleX: scale,
                              scaleY: scale,
                              left: box.x + (box.w - iw * scale) / 2,
                              top: box.y + (box.h - ih * scale) / 2,
                            });
                            c.renderAll();
                          }}
                        >
                          Fit to box
                        </button>
                        <button
                          className="commerce-btn"
                          onClick={() => {
                            const c = isBackView ? backCanvas : canvas;
                            const d = isBackView
                              ? backDesignRef.current
                              : frontDesignRef.current;
                            const box = isBackView ? backBox : frontBox;
                            if (!d || !c) return;
                            const w = (d.width || 1) * (d.scaleX || 1);
                            const h = (d.height || 1) * (d.scaleY || 1);
                            d.set({
                              left: box.x + (box.w - w) / 2,
                              top: box.y + (box.h - h) / 2,
                            });
                            c.renderAll();
                          }}
                        >
                          Center in box
                        </button>
                      </div>

                      {/* Box controls */}
                      <div className="mt-3">
                        <h5>Placement Box ({isBackView ? "Back" : "Front"})</h5>
                        <div className="d-flex gap-2 flex-wrap">
                          {(isBackView ? ["x", "y", "w", "h"] : ["x", "y", "w", "h"]).map(
                            (k) => (
                              <label key={k} style={{ display: "inline-flex", gap: 6 }}>
                                {k.toUpperCase()}
                                <input
                                  type="number"
                                  value={(isBackView ? backBox : frontBox)[k]}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (isBackView)
                                      setBackBox((b) => ({
                                        ...b,
                                        [k]: k === "w" || k === "h" ? Math.max(1, val) : val,
                                      }));
                                    else
                                      setFrontBox((b) => ({
                                        ...b,
                                        [k]: k === "w" || k === "h" ? Math.max(1, val) : val,
                                      }));
                                  }}
                                  style={{ width: 90 }}
                                />
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="product-preview-panel__product-options">
                        {/* FIT TYPES (checkbox) */}
                        <div className="product-preview-panel__fit-type-selector">
                          <p className="product-preview-panel__label">
                            Choose fit types:
                          </p>
                          <div className="d-flex gap-3 flex-wrap">
                            {(activeConfig?.fitTypes ?? []).map((fit) => {
                              const checked =
                                (selectedFitType[activeProductIndex] ?? []).includes(fit);
                              return (
                                <label
                                  key={fit}
                                  className="fit-checkbox"
                                  onMouseEnter={() => handleFitHover(fit)}
                                  onMouseLeave={() => handleFitHover(null)}
                                >
                                  <input
                                    type="checkbox"
                                    name="fitType"
                                    checked={checked}
                                    onChange={() => handleFitToggle(fit)}
                                  />
                                  <span className="custom-check"></span>
                                  {fit.charAt(0) + fit.slice(1).toLowerCase()}
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* COLORS (checkbox) */}
                        <div className="product-preview-panel__color-chooser">
                          <p className="product-preview-panel__label">Choose colors:</p>
                          <div className="color-options d-flex gap-2 flex-wrap">
                            {(activeColors ?? []).map((color) => {
                              const checked =
                                (selectedColor[activeProductIndex] ?? []).includes(color);
                              return (
                                <label key={color} className="color-option" style={{ position: "relative" }}>
                                  <input
                                    type="checkbox"
                                    name="productColor"
                                    value={color}
                                    checked={checked}
                                    onChange={() => handleColorToggle(color)}
                                    style={{ display: "none" }}
                                  />
                                  <span
                                    className={`color-circle ${checked ? "is-checked" : ""}`}
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

                          <div className="product-preview-panel__price-input-field mt-3">
                            <label className="product-preview-panel__label">
                              Price (Minimum BDT 500):
                            </label>
                            <input
                              type="text"
                              placeholder="BDT 0.00"
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
                </div>
              )}

              {/* Product Details Form */}
              <div className="product-details__form mt-4">
                <div className="product-details__form-top">
                  <h2 className="product-details__form-title">Artworld should be:</h2>
                  <button className="tag-box-button" data-target=".product-details__form-two">
                    <i className="fas fa-caret-down"></i>
                  </button>
                </div>

                <form action="#" className="product-details__form-two toggle-list">
                  <div className="row gutter-x-30 gutter-y-30">
                    <div className="col-lg-6">
                      <div className="product-details__form__content">
                        <h4 className="product-details__form__title">
                          Product details (required)
                        </h4>
                        <p className="product-details__form__text">
                          Product names will be appended to this design title.
                        </p>
                      </div>

                      <div className="form-group">
                        <div className="form-control-two">
                          <label htmlFor="title">Design Title</label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={features.title}
                            onChange={handleFeatureChange}
                          />
                          <span>60 characters remaining (minimum 3)</span>
                        </div>

                        <div className="form-control-two">
                          <label>Select Brand</label>

                          {user?.merchantProfile?.brandOption ? (
                            <>
                              <div className="flex items-center gap-4 mt-2">
                                <label>
                                  <input
                                    type="radio"
                                    name="brandOption"
                                    value="non-brand"
                                    checked={brandOption === "non-brand"}
                                    onChange={(e) => setBrandOption(e.target.value)}
                                  />
                                  Non-brand
                                </label>

                                <label>
                                  <input
                                    type="radio"
                                    name="brandOption"
                                    value="select-brand"
                                    checked={brandOption === "select-brand"}
                                    onChange={(e) => setBrandOption(e.target.value)}
                                  />
                                  Select Brand
                                </label>
                              </div>

                              {brandOption === "non-brand" && (
                                <input
                                  type="text"
                                  name="brandName"
                                  placeholder="Write your brand"
                                  className="mt-2"
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
                            <BrandDropdown
                              brands={brands}
                              onBrandChange={(id) => setBrandId(id)}
                            />
                          )}

                          <span>50 characters remaining (minimum 3)</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="product-details__form__content">
                        <h4 className="product-details__form__title">
                          Product Features (optional)
                        </h4>
                        <p className="product-details__form__text">
                          Summarize the unique details of your design.
                        </p>
                      </div>

                      <div className="form-group">
                        <div className="form-control-two">
                          <label htmlFor="feature1">Feature bullet 1</label>
                          <input
                            type="text"
                            name="feature1"
                            id="feature1"
                            value={features.feature1}
                            onChange={handleFeatureChange}
                          />
                          <span>256 characters remaining</span>
                        </div>
                        <div className="form-control-two">
                          <label htmlFor="feature2">Feature bullet 2</label>
                          <input
                            type="text"
                            name="feature2"
                            id="feature2"
                            value={features.feature2}
                            onChange={handleFeatureChange}
                          />
                          <span>50 characters remaining</span>
                        </div>
                        <div className="form-control-two">
                          <label htmlFor="description">Product description</label>
                          <textarea
                            name="description"
                            id="description"
                            placeholder="Minimum 75 characters"
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

              {/* Keywords Input */}
              <div className="product-details__keyword">
                <div className="product-details__form-top">
                  <h2 className="product-details__form-title">Artworld should be:</h2>
                  <button className="tag-box-button" data-target=".keyword">
                    <i className="fas fa-caret-down"></i>
                  </button>
                </div>
                <p className="product-details__keyword__text">
                  Add product tags/keywords for better SEO visibility.
                </p>
                <div className="keyword toggle-list">
                  <label htmlFor="tagInput" className="tag-input-label">
                    *Product Keyword
                  </label>
                  <div className="tag-input-wrapper">
                    <div className="tag-box" id="tagBox">
                      {tags.map((tag, index) => (
                        <Tag key={index} tag={tag} onRemove={() => removeTag(index)} />
                      ))}

                      <input
                        type="text"
                        id="tagInput"
                        className="tag-input"
                        maxLength="200"
                        onKeyDown={handleTagKeyDown}
                      />
                    </div>
                    <p className="char-limit" id="charLimit">
                      200 characters remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div className="product-details__availability">
                <div className="product-details__form-top">
                  <h2 className="product-details__form-title">
                    Product availability on Amazon
                  </h2>
                  <button className="tag-box-button" data-target=".product-details-form">
                    <i className="fas fa-caret-down"></i>
                  </button>
                </div>
                <form action="#" className="toggle-list product-details-form">
                  <div className="row gutter-x-6">
                    <div className="col-lg-6">
                      <div
                        className="product-details__item-box"
                        onClick={() => setSelected("non-searchable")}
                      >
                        <label htmlFor="non-searchable" className="availability__item">
                          <input
                            type="radio"
                            id="non-searchable"
                            name="searchability"
                            value="non-searchable"
                            className="sr-only"
                            checked={selected === "non-searchable"}
                            onChange={() => setSelected("non-searchable")}
                          />
                          <span
                            className={`custom-radio-circle ${
                              selected === "non-searchable" ? "active" : ""
                            }`}
                          ></span>
                          <div className="availability__item__content">
                            <h3 className="availability__item__title">Non-searchable</h3>
                            <p className="availability__item__text">
                              Does not appear in Sadamata search results
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div
                        className="product-details__item-box"
                        onClick={() => setSelected("searchable")}
                      >
                        <label htmlFor="searchable" className="availability__item">
                          <input
                            type="radio"
                            id="searchable"
                            name="searchability"
                            value="searchable"
                            className="sr-only"
                            checked={selected === "searchable"}
                            onChange={() => setSelected("searchable")}
                          />
                          <span
                            className={`custom-radio-circle ${
                              selected === "searchable" ? "active" : ""
                            }`}
                          ></span>
                          <div className="availability__item__content">
                            <h3 className="availability__item__title">Searchable</h3>
                            <p className="availability__item__text">
                              Appears in Amazon search results
                            </p>
                            <p className="availability__item__text">
                              Customers can find these products through Sadamata search
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="product-details__btn-group">
                  <button type="button" className="commerce-btn">
                    Save draft<i className="icon-right-arrow"></i>
                  </button>
                  <button
                    type="button"
                    className="commerce-btn ms-3"
                    onClick={handleCreateProduct}
                  >
                    Publish <i className="icon-right-arrow"></i>
                  </button>
                  <button
                    className="commerce-btn ms-3"
                    onClick={downloadAllMockups}
                    disabled={isDownloading || !designImage}
                    title={!designImage ? "Upload a front design first" : ""}
                  >
                    {isDownloading ? "Preparing ZIP..." : "Download All Images (ZIP)"}
                  </button>
                </div>

                <p className="product-details__availability__text">
                  By submitting for production, you acknowledge you have all the
                  necessary rights to the original artwork, Brand name, design title,
                  product features and description.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
