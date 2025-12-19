"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, FabricImage } from "fabric";
import DashSidebar from "../DashSidebar/DashSidebar";
import Tag from "./Tag";
import { toast } from "sonner";
import { updateProduct } from "@/app/actions/product/product.actions";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import BrandDropdown from "./BrandDropDown";
import { useRouter } from "next/navigation";
import { validatePngFile } from "@/utils/validation";
const SPINNER_SVG_DATAURI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="20" stroke="#3b82f6" stroke-width="5" fill="none" opacity="0.2"/>
  <path fill="none" stroke="#3b82f6" stroke-width="5" d="M25 5 a20 20 0 0 1 0 40"/>
</svg>`);
const MAX_DESIGN_PX = 200;
const MIN_OUTPUT_PX = 4500;

/* ================= HELPERS ================= */
const safeClear = (fabricCanvas) => {
  const ok =
    fabricCanvas?.lowerCanvasEl &&
    typeof fabricCanvas.lowerCanvasEl.getContext === "function";
  if (!ok) return false;
  fabricCanvas.clear();
  return true;
};
const buildImageUrl = (raw) => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) {
    const url = new URL(raw);
    return `/mockup/${url.pathname.replace(/^\/+mockups\//, "")}`;
  }
  return `/mockup/${raw.replace(/^\/+mockups\//, "")}`;
};

const loadHTMLImage = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/* ================= COMPONENT ================= */

export default function EditProductDesign({
  product,
  allMockup,
  currentUserId,
  brands,
  user,
}) {
  const router = useRouter();

  console.log(product, "edit");

  /* ================= STATE (SAME AS ADD DESIGN) ================= */

  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [fileName, setFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [designImage, setDesignImage] = useState(null);
  const [designBack, setDesignBack] = useState(null);
  const [designImageFile, setDesignImageFile] = useState(null);
  const [designBackFile, setDesignBackFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFitType, setSelectedFitType] = useState({});
  const [selectedColor, setSelectedColor] = useState({});
  const [fitClickHistory, setFitClickHistory] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const inputFileRef = useRef(null);
  const [tags, setTags] = useState([]);
  const tagLimit = 10;
  const [isPublishing, setIsPublishing] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [isBackView, setIsBackView] = useState(false);
  const [hoveredFitType, setHoveredFitType] = useState({});
  const [designOriginalSize, setDesignOriginalSize] = useState(null);
  const [brandOption, setBrandOption] = useState("non-brand");

  const [hoveredColor, setHoveredColor] = useState({});
  const [selected, setSelected] = useState("searchable");
  const [canvas, setCanvas] = useState(null);
  const [backCanvas, setBackCanvas] = useState(null);
  const [designPosition, setDesignPosition] = useState({ x: 100, y: 100 });
  const [designBackPosition, setDesignBackPosition] = useState({
    x: 100,
    y: 100,
  });
  const [designSize, setDesignSize] = useState(null);
  const [designBackSize, setDesignBackSize] = useState(null);
  const [spinnerFront, setSpinnerFront] = useState(null);
  const [spinnerBack, setSpinnerBack] = useState(null);
  const [features, setFeatures] = useState({
    title: "",
    feature1: "",
    feature2: "",
    description: "",
    price: "",
    brandName: "",
  });

  const handleBackButtonClick = () => setIsBackView(true);
  const handleFrontButtonClick = () => setIsBackView(false);

  const handleFitToggle = (fit) => {
    if (activeProductIndex === null) return;

    setSelectedFitType((prev) => {
      const current = prev[activeProductIndex] ?? [];
      const exists = current.includes(fit);

      const next = exists
        ? current.filter((f) => f !== fit)
        : [...current, fit];

      return { ...prev, [activeProductIndex]: next };
    });

    setFitClickHistory((prev) => {
      const history = prev[activeProductIndex] ?? [];

      // 🔴 ALWAYS move checked fit to the end
      const cleaned = history.filter((f) => f !== fit);

      return {
        ...prev,
        [activeProductIndex]: [...cleaned, fit],
      };
    });
  };

  const handleColorToggle = (color) => {
    if (activeProductIndex === null) return;

    const fit = getActiveFit(activeProductIndex, activeFitList?.[0]);
    if (!fit) return;

    setSelectedColor((prev) => {
      const productColors = prev[activeProductIndex] ?? {};
      const fitColors = productColors[fit] ?? [];

      const exists = fitColors.includes(color);
      const nextColors = exists
        ? fitColors.filter((c) => c !== color)
        : [...fitColors, color];

      return {
        ...prev,
        [activeProductIndex]: {
          ...productColors,
          [fit]: nextColors,
        },
      };
    });
  };
  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const canvasRef = useRef(null);
  const canvasBackRef = useRef(null);
  const canvasRefs = useRef([]);
  const [canvasInstances, setCanvasInstances] = useState([]); // grid Fabric canvases

  const handleFitHover = (fitOrNull) => {
    if (activeProductIndex === null) return;
    setHoveredFitType((prev) => ({ ...prev, [activeProductIndex]: fitOrNull }));
  };

  const handleHoverColor = (colorOrNull) => {
    if (activeProductIndex === null) return;
    setHoveredColor((prev) => ({ ...prev, [activeProductIndex]: colorOrNull }));
  };
  const getActiveFit = (idx, fallback) => {
    if (idx == null) return fallback;

    const hover = hoveredFitType[idx];
    if (hover) return hover;

    const selected = selectedFitType[idx] ?? [];
    const history = fitClickHistory[idx] ?? [];

    // Pick the LAST clicked fit that is still selected
    for (let i = history.length - 1; i >= 0; i--) {
      if (selected.includes(history[i])) {
        return history[i];
      }
    }

    return selected[0] ?? fallback;
  };

  const getActiveColor = (idx, fit, fallback) => {
    if (idx == null || !fit) return fallback;

    const hover = hoveredColor[idx];
    if (hover) return hover;

    const fitColors = selectedColor[idx]?.[fit];
    return fitColors?.[0] ?? fallback;
  };

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

  /* ================= HYDRATE EXISTING PRODUCT ================= */
  const handleFileChange = async (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      await handleFrontFile(file);
      e.target.value = ""; // allow re-upload of same file
      const isValid = await validatePngFile(file, 4500, 5400);
      if (!isValid) {
        e.target.value = "";
        return;
      }

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
  const handleBackFileChange = async (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const isValid = await validatePngFile(file, 4500, 5400);
      if (!isValid) {
        e.target.value = "";
        return;
      }

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

  // ------------------ REMOVE DESIGN HANDLERS ------------------

  const handleRemoveFrontDesign = () => {
    setDesignImage(null);
    setDesignImageFile(null);
    setFileName("");
    setIsLoading(false);

    // reset design position & size (optional but recommended)
    setDesignPosition({ x: 100, y: 100 });
    setDesignSize(null);

    // clear fabric canvas safely
    if (canvas) {
      safeClear(canvas);
    }

    // reset file input so same file can be re-uploaded
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }

    toast.info("Front design removed");
  };

  const handleRemoveBackDesign = () => {
    setDesignBack(false);
    setDesignBackFile(null);
    setBackFileName("");
    setIsBackLoading(false);

    setDesignBackPosition({ x: 100, y: 100 });
    setDesignBackSize(null);

    if (backCanvas) {
      safeClear(backCanvas);
    }

    const backInput = document.getElementById("backimage-upload");
    if (backInput) backInput.value = "";

    toast.info("Back design removed");
  };

  useEffect(() => {
    if (!product) return;

    setFeatures({
      title: product.title || "",
      feature1: product.features?.[0]?.content || "",
      feature2: product.features?.[1]?.content || "",
      description: product.description || "",
      price: product.price || "",
      brandName: product.brandName || "",
    });

    setTags(product.tags?.map((t) => t.value) || []);

    if (product.frontDesign) {
      setDesignImage(buildImageUrl(product.frontDesign));
    }
    if (product.backDesign) {
      setDesignBack(buildImageUrl(product.backDesign));
    }

    const fitMap = {};
    const colorMap = {};

    product.variants?.forEach((v) => {
      fitMap[0] ??= [];
      if (!fitMap[0].includes(v.fitType)) {
        fitMap[0].push(v.fitType);
      }

      colorMap[0] ??= {};
      colorMap[0][v.fitType] ??= [];
      if (!colorMap[0][v.fitType].includes(v.color)) {
        colorMap[0][v.fitType].push(v.color);
      }
    });

    setSelectedFitType(fitMap);
    setSelectedColor(colorMap);
  }, [product]);

  //
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
      (ref) => new Canvas(ref, { width: 400, height: 400, selection: false })
    );
    setCanvasInstances(instances);

    return () => {
      instances.forEach((c) => c && c.dispose());
    };
  }, [allMockup.length]);

  /* ================= MOCKUP CONFIG (UNCHANGED) ================= */
  const activeProduct =
    activeProductIndex !== null
      ? allMockup?.[activeProductIndex] ?? null
      : null;
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

  const activeConfig = activeProduct?.name
    ? mockupsByProduct[activeProduct.name.toLowerCase()]
    : null;
  const activeFitList = activeConfig?.fitTypes ?? [];
  const uiFit =
    activeProductIndex !== null
      ? getActiveFit(activeProductIndex, activeFitList[0]) ?? activeFitList[0]
      : undefined;
  const activeColors = uiFit ? activeConfig?.fits?.[uiFit]?.colors ?? [] : [];
  /* ================= FILE HANDLERS ================= */

  const handleFrontFile = async (file) => {
    if (!file) return;
    const ok = await validatePngFile(file, 4500, 5400);
    if (!ok) return;

    setDesignImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setDesignImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBackFile = async (file) => {
    if (!file) return;
    const ok = await validatePngFile(file, 4500, 5400);
    if (!ok) return;

    setDesignBackFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setDesignBack(reader.result);
    reader.readAsDataURL(file);
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
    const color = getActiveColor(activeProductIndex, fit, colorFallback);
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
    const color = getActiveColor(activeProductIndex, fit, colorFallback);
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

      const color = getActiveColor(idx, fit, conf.fits[fit].colors?.[0]);
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

  const MAX_DESIGN_PX = 200;

  useEffect(() => {
    if (!canvas) return;

    const clampScale = (e) => {
      const obj = e.target;
      if (!obj || obj.type !== "image" || obj.layer !== 1) return;
      if (!designOriginalSize) return;

      const maxScaleX = MAX_DESIGN_PX / designOriginalSize.width;
      const maxScaleY = MAX_DESIGN_PX / designOriginalSize.height;
      const maxScale = Math.min(maxScaleX, maxScaleY);

      if (obj.scaleX > maxScale || obj.scaleY > maxScale) {
        obj.set({
          scaleX: maxScale,
          scaleY: maxScale,
        });
        canvas.renderAll();
      }
    };

    canvas.on("object:scaling", clampScale);
    return () => canvas.off("object:scaling", clampScale);
  }, [canvas, designOriginalSize]);

  const addDesignToCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designImage) return;

    loadHTMLImage(designImage).then((designImg) => {
      if (!designImg) return;

      setDesignOriginalSize({
        width: designImg.width,
        height: designImg.height,
      });

      const scale = Math.min(
        1,
        MAX_DESIGN_PX / designImg.width,
        MAX_DESIGN_PX / designImg.height
      );

      const fabricImg = new FabricImage(designImg, {
        left: (fabricCanvas.width - designImg.width * scale) / 2,
        top: (fabricCanvas.height - designImg.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        // hasControls: true,
        // lockUniScaling: true,
        // layer: 1,
        lockUniScaling: true,
        lockScalingFlip: true,
        lockRotation: true, // optional but recommended
        cornerStyle: "circle",
        transparentCorners: false,
        layer: 1,
      });

      fabricCanvas.add(fabricImg);
      fabricCanvas.setActiveObject(fabricImg);
      fabricCanvas.renderAll();

      // store final rendered size (after cap)
      setDesignSize({
        width: designImg.width * scale,
        height: designImg.height * scale,
      });
    });
  };

  // const addDesignToBackCanvas = (fabricCanvas) => {
  //   if (!fabricCanvas || !designBack) return;
  //   loadHTMLImage(designBack).then((designImg) => {
  //     if (!designImg) return;
  //     const fabricImg = new FabricImage(designImg);
  //     fabricImg.set({
  //       left: designBackPosition.x,
  //       top: designBackPosition.y,
  //       scaleX: designBackSize.width / designImg.width,
  //       scaleY: designBackSize.height / designImg.height,
  //       hasControls: true,
  //       lockUniScaling: true,
  //       layer: 1,
  //     });
  //     fabricCanvas.add(fabricImg);
  //     fabricCanvas.renderAll();
  //   });
  // };

  const addDesignToBackCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designBack) return;

    loadHTMLImage(designBack).then((designImg) => {
      if (!designImg) return;

      const scale = Math.min(
        1,
        MAX_DESIGN_PX / designImg.width,
        MAX_DESIGN_PX / designImg.height
      );

      const fabricImg = new FabricImage(designImg, {
        left: (fabricCanvas.width - designImg.width * scale) / 2,
        top: (fabricCanvas.height - designImg.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        // hasControls: true,
        // lockUniScaling: true,
        // layer: 1,
        lockUniScaling: true,
        lockScalingFlip: true,
        lockRotation: true, // optional but recommended
        cornerStyle: "circle",
        transparentCorners: false,
        layer: 1,
      });

      fabricCanvas.add(fabricImg);
      fabricCanvas.setActiveObject(fabricImg);
      fabricCanvas.renderAll();

      setDesignBackSize({
        width: designImg.width * scale,
        height: designImg.height * scale,
      });
    });
  };

  const addDesignToSmallCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designImage) return;

    loadHTMLImage(designImage).then((designImg) => {
      if (!designImg) return;

      const MAX = 200;

      // ✅ scale based on original image size
      const scale = Math.min(MAX / designImg.width, MAX / designImg.height, 1);

      const fabricImg = new FabricImage(designImg, {
        left: (fabricCanvas.width - designImg.width * scale) / 2,
        top: (fabricCanvas.height - designImg.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        hasControls: false,
        selectable: false,
        evented: false,
        layer: 1,
      });

      fabricCanvas.add(fabricImg);
      fabricCanvas.renderAll();
    });
  };

  /* ================= UPDATE PRODUCT ================= */

  const prepareFormData = async () => {
    const mockup = allMockup[0];
    const conf = mockupsByProduct[mockup.name.toLowerCase()];
    if (!conf) return null;

    const fd = new FormData();
    fd.append("productId", product.id);
    fd.append("title", features.title);
    fd.append("description", features.description);
    fd.append("price", String(features.price || 990));
    fd.append("userId", String(currentUserId));
    fd.append("mockupId", mockup.id);

    if (designImageFile) fd.append("frontDesign", designImageFile);
    if (designBackFile) fd.append("backDesign", designBackFile);

    tags.forEach((t, i) => fd.append(`tags[${i}]`, t));
    [features.feature1, features.feature2]
      .filter(Boolean)
      .forEach((f, i) => fd.append(`features[${i}]`, f));

    let i = 0;
    for (const fit of selectedFitType[0] || []) {
      for (const color of selectedColor[0]?.[fit] || []) {
        fd.append(`variants[${i}][fitType]`, fit);
        fd.append(`variants[${i}][color]`, color);
        i++;
      }
    }

    return fd;
  };

  const handleUpdateProduct = async () => {
    if (isPublishing) return;
    setIsPublishing(true);

    const formData = await prepareFormData();
    if (!formData) {
      setIsPublishing(false);
      return;
    }

    const res = await updateProduct(formData);

    if (res?.success) {
      toast.success("Product updated successfully");
      router.push("/dashboard");
    } else {
      toast.error(res?.message || "Failed to update product");
    }

    setIsPublishing(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await handleFrontFile(file);
  };

  /* ================= JSX ================= */
  /* ⚠️ IMPORTANT:
     The JSX BELOW SHOULD BE IDENTICAL
     to your AddDesignFitAdmin JSX.
     DO NOT REMOVE CLASSES OR CANVAS.
  */

  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>

          <div className='col-lg-9'>
            <div className='dashboard-area__content'>
              <h2 className='dashboard-area__title'>Edit Product</h2>

              {/* FRONT DESIGN UPLOAD AREA */}
              <div className='dashboard-area__uplode'>
                <div className='dashboard-area__uplode-box'>
                  <form>
                    <div
                      className={`upload-area file-upload__area ${
                        isDragOver ? "is-drag-over" : ""
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
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
                          accept='image/png'
                        />
                        {isLoading ? (
                          <div
                            className='spinner-border text-primary'
                            role='status'
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                        ) : (
                          // designImage && (
                          //   <img
                          //     src={designImage}
                          //     alt='Uploaded Design'
                          //     width={200}
                          //     height={200}
                          //   />
                          // )
                          designImage && (
                            <div className='position-relative d-inline-block'>
                              <img
                                src={designImage}
                                alt='Uploaded Design'
                                width={200}
                                height={200}
                                style={{ borderRadius: 6 }}
                              />

                              <button
                                type='button'
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation(); // 🔴 THIS IS THE KEY
                                  handleRemoveFrontDesign();
                                }}
                                className='btn btn-sm '
                                style={{
                                  position: "absolute",
                                  top: -10,
                                  right: -10,
                                  borderRadius: "50%",
                                  width: 28,
                                  height: 28,
                                  padding: 0,

                                  background: "var(--commerce-base)",
                                  color: "white",
                                }}
                                title='Remove design'
                              >
                                X
                              </button>
                            </div>
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
                        <span className='product__item-two__img__item'>
                          <canvas
                            ref={(el) => {
                              if (el) canvasRefs.current[index] = el;
                            }}
                            style={{
                              border: "1px solid #ddd",
                              position: "relative",
                            }}
                          />
                        </span>
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
                    <div className='col-lg-6 '>
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
                      <div
                        className='position-relative'
                        style={{ maxWidth: "400px" }}
                      >
                        {isBackView ? (
                          // <label htmlFor='backimage-upload'>
                          //   <canvas
                          //     ref={canvasBackRef}
                          //     className={`front ${isBackView ? "" : "d-none"}`}
                          //     style={{
                          //       border: "1px solid #ddd",
                          //       position: "relative",
                          //     }}
                          //   />

                          //   {designBack && (
                          //     <button
                          //       type='button'
                          //       onClick={handleRemoveBackDesign}
                          //       className='btn btn-sm btn-danger'
                          //       style={{
                          //         position: "absolute",
                          //         top: 10,
                          //         right: 10,
                          //         zIndex: 10,
                          //       }}
                          //     >
                          //       Remove Back Design
                          //     </button>
                          //   )}
                          //   <input
                          //     type='file'
                          //     id='backimage-upload'
                          //     className='file-upload__input'
                          //     hidden
                          //     onChange={handleBackFileChange}
                          //     disabled={!!designBack}
                          //     accept='image/*'
                          //   />
                          // </label>
                          <label htmlFor='backimage-upload'>
                            <canvas
                              ref={canvasBackRef}
                              className={`front ${isBackView ? "" : "d-none"}`}
                              style={{
                                border: "1px solid #ddd",
                                position: "relative",
                              }}
                            />

                            {designBack && (
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation(); // 🔴 THIS IS THE KEY
                                  handleRemoveBackDesign();
                                }}
                                className='btn btn-sm '
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  zIndex: 10,
                                  background: "var(--commerce-base)",
                                  color: "white",
                                }}
                              >
                                X
                              </button>
                            )}

                            <input
                              type='file'
                              id='backimage-upload'
                              className='file-upload__input'
                              hidden
                              onChange={handleBackFileChange}
                              disabled={!!designBack}
                              accept='image/png'
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
                                selectedColor[activeProductIndex]?.[uiFit] ?? []
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
                            Price (Minimum BDT 990):
                          </label>
                          <input
                            type='text'
                            placeholder='BDT 0.00'
                            value={features.price}
                            onChange={(e) =>
                              setFeatures((p) => ({
                                ...p,
                                price: Number(e.target.value) || 990,
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
                                  value={features.brandName}
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
                                  value={features.brandName}
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

              <button
                className='commerce-btn mt-4'
                onClick={handleUpdateProduct}
                disabled={isPublishing}
              >
                {isPublishing ? "Updating..." : "UPDATE PRODUCT"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
