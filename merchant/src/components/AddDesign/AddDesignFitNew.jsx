"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, FabricImage, } from "fabric"; // Fabric.js v6
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

export default function AddDesignFitNew({ allMockup, currentUserId, brands , user}) {



  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [designImage, setDesignImage] = useState(null);
  const [designBack, setDesignBack] = useState(false);
const [designImageFile, setDesignImageFile] = useState(null);
 const [designBackFile, setDesignBackFile] = useState(null);
  // selection/hover per product index (fit + color)
  const [selectedFitType, setSelectedFitType] = useState({});
  const [hoveredFitType, setHoveredFitType] = useState({});
  const [selectedColor, setSelectedColor] = useState({});
  const [hoveredColor, setHoveredColor] = useState({});

  const getActiveFit = (idx, fallback) =>
    hoveredFitType[idx] ?? selectedFitType[idx] ?? fallback;

  const getActiveColor = (idx, fallback) =>
    hoveredColor[idx] ?? selectedColor[idx] ?? fallback;

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

  const [spinnerObj, setSpinnerObj] = useState(null);
  const canvasRefs = useRef([]);
  const [canvasInstances, setCanvasInstances] = useState([]);

  const activeProduct =
    activeProductIndex !== null
      ? allMockup?.[activeProductIndex] ?? null
      : null;

  // product -> fitType -> color -> front/back map
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

        if (!fits[fit])
          fits[fit] = { colorFront: {}, colorBack: {}, colors: [] };
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

  // file handlers
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setIsLoading(true);
      setDesignImageFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setDesignImage(String(reader.result));
          setIsLoading(false);
        }, 3000);
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
        setTimeout(() => {
          setDesignBack(String(reader.result));
          setIsBackLoading(false);
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // single preview canvases
  useEffect(() => {
    if (canvasRef.current) {
      const c = new Canvas(canvasRef.current, {
        width: 400,
        height: 400,
        selection: false,
      });
      setCanvas(c);
      return () => c.dispose();
    }
  }, [
    isBackView,
    selectedColor,
    hoveredColor,
    activeProductIndex,
    selectedFitType,
    hoveredFitType,
  ]);

  useEffect(() => {
    if (canvasBackRef.current) {
      const c = new Canvas(canvasBackRef.current, {
        width: 400,
        height: 400,
        selection: false,
      });
      setBackCanvas(c);
      return () => c.dispose();
    }
  }, [
    isBackView,
    selectedColor,
    hoveredColor,
    activeProductIndex,
    selectedFitType,
    hoveredFitType,
  ]);

  // grid canvases
  useEffect(() => {
    const instances = canvasRefs.current.map((ref) => {
      if (!ref) return null;
      const c = new Canvas(ref, { width: 200, height: 200, selection: false });
      return c;
    });
    setCanvasInstances(instances);
    return () => {
      instances.forEach((c) => c && c.dispose());
    };
  }, [
    allMockup,
    activeProductIndex,
    selectedColor,
    hoveredColor,
    selectedFitType,
    hoveredFitType,
  ]);

  // spinner helpers
  const addSpinnerToCanvas = (fabricCanvas) => {
    if (!fabricCanvas || spinnerObj) return;
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
      setSpinnerObj(spin);
      let angle = 0;
      const rotate = () => {
        if (spin.__spin !== false) {
          angle += 2;
          spin.set({ angle });
          fabricCanvas.renderAll();
          requestAnimationFrame(rotate);
        }
      };
      rotate();
    };
  };

  const removeSpinnerFromCanvas = (fabricCanvas) => {
    if (fabricCanvas && spinnerObj) {
      spinnerObj.__spin = false;
      fabricCanvas.remove(spinnerObj);
      setSpinnerObj(null);
      fabricCanvas.renderAll();
    }
  };

  // drag/resize listeners
  useEffect(() => {
    if (!canvas) return;
    canvas.on("object:modified", (e) => {
      const obj = e.target;
      if (obj && obj.type === "image") {
        setDesignPosition({ x: obj.left, y: obj.top });
        setDesignSize({
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
        });
      }
    });
  }, [canvas]);

  useEffect(() => {
    if (!backCanvas) return;
    backCanvas.on("object:modified", (e) => {
      const obj = e.target;
      if (obj && obj.type === "image") {
        setDesignBackPosition({ x: obj.left, y: obj.top });
        setDesignBackSize({
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
        });
      }
    });
  }, [backCanvas]);

  // add design images
  const addDesignToCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designImage) return;
    const designImg = new Image();
    designImg.crossOrigin = "anonymous"; 
    designImg.src = designImage;
    designImg.onload = () => {
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
    };
  };

  const addDesignToBackCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designBack) return;
    const designImg = new Image();
    designImg.crossOrigin = "anonymous"; 
    designImg.src = designBack;
    designImg.onload = () => {
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
    };
  };

  const addDesignToSmallCanvas = (fabricCanvas) => {
    if (!fabricCanvas || !designImage) return;
    const designImg = new Image();
    designImg.crossOrigin = "anonymous"; 
    designImg.src = designImage;
    designImg.onload = () => {
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
        hasControls: true,
        lockUniScaling: true,
        layer: 1,
      });
      fabricCanvas.add(fabricImg);
      fabricCanvas.renderAll();
    };
  };

  // default fit + color on active change
  useEffect(() => {
    if (activeProductIndex === null) return;
    const product = allMockup[activeProductIndex];
    if (!product) return;

    const conf = mockupsByProduct[product.name.toLowerCase()];
    if (!conf) return;

    const firstFit = conf.fitTypes?.[0];
    const fit = selectedFitType[activeProductIndex] ?? firstFit;
    if (!selectedFitType[activeProductIndex] && fit) {
      setSelectedFitType((p) => ({ ...p, [activeProductIndex]: fit }));
    }

    const colors = fit ? conf.fits[fit]?.colors ?? [] : [];
    const firstColor = colors[0];
    const col = selectedColor[activeProductIndex] ?? firstColor;
    if (!selectedColor[activeProductIndex] && col) {
      setSelectedColor((p) => ({ ...p, [activeProductIndex]: col }));
    }
  }, [
    activeProductIndex,
    allMockup,
    mockupsByProduct,
    selectedFitType,
    selectedColor,
  ]);

  // front preview render (fit+color)
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
    img.onload = () => {
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
  ]);

  // back preview render (fit+color)
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
    img.onload = () => {
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
  ]);

  // grid renders
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

  // spinners
  useEffect(() => {
    if (!canvas) return;
    if (isLoading) addSpinnerToCanvas(canvas);
    else removeSpinnerFromCanvas(canvas);
  }, [isLoading, designImage, canvas]);

  useEffect(() => {
    if (!backCanvas) return;
    if (isBackLoading) addSpinnerToCanvas(backCanvas);
    else removeSpinnerFromCanvas(backCanvas);
  }, [isBackLoading, designBack, backCanvas]);

  // handlers: fit & color
  const handleFitChange = (fit) => {
    if (activeProductIndex === null) return;
    setSelectedFitType((prev) => ({ ...prev, [activeProductIndex]: fit }));

    const product = allMockup[activeProductIndex];
    const conf = product ? mockupsByProduct[product.name.toLowerCase()] : null;
    const colors = conf?.fits?.[fit]?.colors ?? [];
    if (!colors.length) return;

    const currentColor = selectedColor[activeProductIndex];
    if (!currentColor || !colors.includes(currentColor)) {
      setSelectedColor((prev) => ({
        ...prev,
        [activeProductIndex]: colors[0],
      }));
    }
  };

  const handleFitHover = (fitOrNull) => {
    if (activeProductIndex === null) return;
    setHoveredFitType((prev) => ({ ...prev, [activeProductIndex]: fitOrNull }));
  };

  const handleColorChange = (color) => {
    if (activeProductIndex === null) return;
    setSelectedColor((prev) => ({ ...prev, [activeProductIndex]: color }));
  };

  const handleHoverColor = (colorOrNull) => {
    if (activeProductIndex === null) return;
    setHoveredColor((prev) => ({ ...prev, [activeProductIndex]: colorOrNull }));
  };

  const handleBackButtonClick = () => setIsBackView(true);
  const handleFrontButtonClick = () => setIsBackView(false);

  const saveImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png", quality: 1.0 });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "design_with_mockup.png";
    link.click();
  };

  // tags
  const [tags, setTags] = useState([]);
  const tagLimit = 10;
  const handleTagKeyDown = (e) => {
    if (e.keyCode === 188 || e.keyCode === 13) {
      e.preventDefault();
      let tag = e.target.value;
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

  const [brandId , setBrandId] = useState(null);
// console.log(brandId, "brandId");

  // Generic handler for input and textarea fields
  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log(features, "features");

  /** নিরাপদে ইমেজ লোড (CORS সহ) */
  const loadHTMLImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      // base mockup যদি অন্য ডোমেইনে হোস্টেড হয়, CORS প্রয়োজন
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  /** রেফারেন্স ক্যানভাস থেকে নরমালাইজড rect বের করি (position+size কে শতাংশে রূপান্তর) */
  const getNormalizedRect = (side) => {
    // আপনি ফ্রন্ট প্রিভিউ 400x400 ক্যানভাসে পজিশনিং করেন, তাই সেটাকেই রেফারেন্স ধরি
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

  /** একটি সাইড (FRONT/BACK) কম্পোজ করে Blob রিটার্ন করবে — uses canvas.toBlob (no dataURLToBlob) */
  const composeSideToBlob = async (baseSrc, side) => {
    const overlayDataURL = side === "FRONT" ? designImage : designBack;
    if (!baseSrc || !overlayDataURL) return null;

    // Base mockup ইমেজ লোড
    const baseImg = await loadHTMLImage(baseSrc);

    // Offscreen <canvas> এলিমেন্ট (বেস ইমেজের নেটিভ সাইজে)
    const el = document.createElement("canvas");
    el.width = baseImg.width;
    el.height = baseImg.height;

    const fc = new Canvas(el, {
      width: el.width,
      height: el.height,
      selection: false,
    });

    // বেস প্লেস করুন
    const base = new FabricImage(baseImg, {
      left: 0,
      top: 0,
      scaleX: fc.getWidth() / baseImg.width,
      scaleY: fc.getHeight() / baseImg.height,
      selectable: false,
      evented: false,
    });
    fc.add(base);

    // ওভারলে (আপলোড করা ডিজাইন)
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

    // Create PNG Blob straight from the HTMLCanvasElement
    const blob = await new Promise((resolve) =>
      el.toBlob(resolve, "image/png", 1)
    );

    // Dispose AFTER blob creation
    fc.dispose();

    return blob;
  };

  /** মূল ফাংশন: সব প্রোডাক্ট × fit × color → ZIP */
  const downloadAllMockups = async () => {
    try {
      if (!designImage) {
        toast.error("Please upload the FRONT design first.");
        return;
      }

      setIsDownloading(true);

      const zip = new JSZip();
      const designTitle = (features.title || "design").trim() || "design";

      // প্রতিটি প্রোডাক্ট
      for (const product of allMockup || []) {
        const conf = product?.name
          ? mockupsByProduct[product.name.toLowerCase()]
          : null;
        if (!conf) continue;

        // প্রতিটি fit
        for (const fit of conf.fitTypes || []) {
          const colors = conf.fits?.[fit]?.colors || [];
          if (!colors.length) continue;

          // প্রতিটি color
          for (const color of colors) {
            const frontSrc = conf.fits[fit]?.colorFront?.[color];
            const backSrc = conf.fits[fit]?.colorBack?.[color];

            // FRONT
            if (frontSrc) {
              const frontBlob = await composeSideToBlob(frontSrc, "FRONT");
              if (frontBlob) {
                const path = `${product.name}/${fit}/${color}/${designTitle}_${product.name}_${fit}_${color}_front.png`;
                zip.file(path, frontBlob);
              }
            }

            // BACK (যদি back ডিজাইন এবং বেস back থাকে)
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

  // const prepareMockupFiles = async () => {
  //   if (!Array.isArray(allMockup) || allMockup.length === 0) {
  //     toast.error("No mockups found.");
  //     return null;
  //   }
  //   if (!designImage) {
  //     toast.error("Please upload the FRONT design first.");
  //     return null;
  //   }

  //   const formData = new FormData();
  //   const designTitle = features.title;

  //   // Root/meta payload once (stringify non-file fields to keep FormData clean)
  //   // const payload = {
  //   //   title: designTitle,
  //   //   description: features.description,
  //   //   price: Number(features.price),
  //   //   visibility: selected !== "non-searchable",
  //   //   tags,
  //   //   features: [features.feature1, features.feature2].filter(Boolean),
  //   //   userId: currentUserId || null,
  //   // };

  //   formData.append("title", designTitle);
  //   formData.append("description", features.description );
  //   formData.append("brandName", features.brandName );
  //   formData.append("price", String(features.price ?? 500));
  //   formData.append(
  //     "visibility",
  //     selected !== "non-searchable" ? "true" : "false"
  //   );
  //   formData.append("userId", currentUserId );
  //   // Append tags
  //   tags.forEach((tag, i) => {
  //     formData.append(`tags[${i}]`, tag);
  //   });

  //   // Append features
  //   [features.feature1, features.feature2].filter(Boolean).forEach((f, i) => {
  //     formData.append(`features[${i}]`, f);
  //   });

  //   // Build every product × fit × color
  //   // let itemIndex = 0;
  //   // for (const product of allMockup) {
  //   //   const conf = product?.name
  //   //     ? mockupsByProduct[product.name.toLowerCase()]
  //   //     : null;
  //   //   if (!conf) continue;

  //   //   for (const fit of conf.fitTypes || []) {
  //   //     const colors = conf.fits?.[fit]?.colors || [];
  //   //     if (!colors.length) continue;

  //   //     for (const color of colors) {
  //   //       const frontSrc = conf.fits[fit]?.colorFront?.[color];
  //   //       const backSrc = conf.fits[fit]?.colorBack?.[color];

  //   //       // FRONT
  //   //       if (frontSrc) {
  //   //         const frontBlob = await composeSideToBlob(frontSrc, "FRONT");
  //   //         if (frontBlob) {
  //   //           formData.append(`items[${itemIndex}][images][0][type]`, "FRONT");
  //   //           formData.append(
  //   //             `items[${itemIndex}][images][0][file]`,
  //   //             frontBlob,
  //   //             `${designTitle}_${product.name}_${fit}_${color}_front.png`
  //   //           );
  //   //         }
  //   //       }

  //   //       // BACK (only if you uploaded a back design and base back exists)
  //   //       if (designBack && backSrc) {
  //   //         const backBlob = await composeSideToBlob(backSrc, "BACK");
  //   //         if (backBlob) {
  //   //           const imgIdx = frontSrc ? 1 : 0; // position after front if present
  //   //           formData.append(
  //   //             `items[${itemIndex}][images][${imgIdx}][type]`,
  //   //             "BACK"
  //   //           );
  //   //           formData.append(
  //   //             `items[${itemIndex}][images][${imgIdx}][file]`,
  //   //             backBlob,
  //   //             `${designTitle}_${product.name}_${fit}_${color}_back.png`
  //   //           );
  //   //         }
  //   //       }

  //   //       // Per-item metadata
  //   //       formData.append(`items[${itemIndex}][mockupId]`, product?.id ?? "");
  //   //       formData.append(
  //   //         `items[${itemIndex}][productName]`,
  //   //         product?.name ?? ""
  //   //       );
  //   //       formData.append(`items[${itemIndex}][fitType]`, fit);
  //   //       formData.append(`items[${itemIndex}][color]`, color);
         
  //   //       formData.append("userId", currentUserId);

  //   //       if (activeProduct?.id) {
  //   //         formData.append("mockupId", activeProduct.id);
  //   //       }

  //   //       itemIndex++;
  //   //     }
  //   //   }
  //   // }

  //   // if (itemIndex === 0) {
  //   //   toast.error("No valid combinations (fit/color) were found.");
  //   //   return null;
  //   // }

  //   // ---- Build variants to match server expectation
  // let vIndex = 0;

  // for (const fit of conf.fitTypes || []) {
  //   const colors = conf.fits?.[fit]?.colors || [];
  //   if (!colors.length) continue;

  //   for (const color of colors) {
  //     const frontSrc = conf.fits[fit]?.colorFront?.[color];
  //     const backSrc  = conf.fits[fit]?.colorBack?.[color];

  //     // Always send color/fitType
  //     formData.append(`variants[${vIndex}][color]`, String(color));
  //     formData.append(`variants[${vIndex}][fitType]`, String(fit));

  //     // FRONT (file) → server will save via saveFile(frontImg, "frontImg")
  //     if (frontSrc) {
  //       const frontBlob = await composeSideToBlob(frontSrc, "FRONT");
  //       if (frontBlob) {
  //         formData.append(
  //           `variants[${vIndex}][frontImg]`,
  //           frontBlob,
  //           `${designTitle}_${chosenMockup.name}_${fit}_${color}_front.png`
  //         );
  //       }
  //     }

  //     // BACK (file) → optional
  //     if (designBack && backSrc) {
  //       const backBlob = await composeSideToBlob(backSrc, "BACK");
  //       if (backBlob) {
  //         formData.append(
  //           `variants[${vIndex}][backImg]`,
  //           backBlob,
  //           `${designTitle}_${chosenMockup.name}_${fit}_${color}_back.png`
  //         );
  //       }
  //     }

  //     vIndex++;
  //   }
  // }

  // if (vIndex === 0) {
  //   toast.error("No valid fit/color combinations for the selected mockup.");
  //   return null;
  // }


  //   return formData;
  // };



  // Builds FormData for a SINGLE product create() call
// - Uses activeProduct.id (or the first product’s id) as mockupId
// - Sends variants[i][color|fitType|frontImg|backImg] (files) to match createProduct()
// - Sends root fields + tags[] + features[]
async function dataUrlToFile(dataUrl, filename = 'image.png') {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/png' });
}

const prepareMockupFiles = async () => {
  // basic guards
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

  // Choose ONE mockupId, since your createProduct() expects a single relation
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

  // ---- Root/meta (MUST match createProduct form keys)
  formData.append("title", designTitle);
  formData.append("description", features.description || "");
  formData.append("brandName", features.brandName || "");
  formData.append("price", String(features.price ?? 500));
  formData.append("visibility", selected !== "non-searchable" ? "true" : "false");
  formData.append("userId", String(currentUserId));
  formData.append("mockupId", String(chosenMockup.id)); // REQUIRED by server

 
formData.append('frontDesign', designImageFile, "designFront");
  if (designBackFile) {
formData.append('backDesign', designBackFile, "designback");}

  // Optional brand/commission fields that createProduct() understands
  if (brandId) formData.append("brandId", brandId);
  if (features.brandCommissionPct != null) {
    formData.append("brandCommissionPct", String(features.brandCommissionPct));
  }
  if (features.merchantCommissionPct != null) {
    formData.append("merchantCommissionPct", String(features.merchantCommissionPct));
  }

  // ---- tags[]
  (tags || []).forEach((tag, i) => {
    if (tag) formData.append(`tags[${i}]`, String(tag));
  });

  // ---- features[]
  [features.feature1, features.feature2].filter(Boolean).forEach((f, i) => {
    formData.append(`features[${i}]`, String(f));
  });

  // ---- Build variants to match server expectation
  let vIndex = 0;

  for (const fit of conf.fitTypes || []) {
    const colors = conf.fits?.[fit]?.colors || [];
    if (!colors.length) continue;

    for (const color of colors) {
      const frontSrc = conf.fits[fit]?.colorFront?.[color];
      const backSrc  = conf.fits[fit]?.colorBack?.[color];

      // Always send color/fitType
      formData.append(`variants[${vIndex}][color]`, String(color));
      formData.append(`variants[${vIndex}][fitType]`, String(fit));

      // FRONT (file) → server will save via saveFile(frontImg, "frontImg")
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

      // BACK (file) → optional
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
      // console.log("Creating product...");
      const formData = await prepareMockupFiles();
      // console.log(formData, "formdata");

      if (!formData) {
        console.warn("No form data available.");
        return;
      }

      const product = await createProduct(formData);

      if (product.success) {
        // console.log("Created product:", product.product);
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
                      <label
                        htmlFor="image-upload"
                        className="file-upload__label"
                      >
                        <input
                          ref={inputFileRef}
                          type="file"
                          id="image-upload"
                          className="file-upload__input"
                          hidden
                          onChange={handleFileChange}
                        />
                        {isLoading ? (
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
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
                    <button className="tag-iterm">
                      RGB color, 8 bits/channel
                    </button>
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
                  <h2>Preview for {activeProduct.name}</h2>

                  <div className="row gutter-x-30 gutter-y-30">
                    <div className="col-lg-6">
                      <div className="product-preview-panel__view-toggle">
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
                            disabled={!!designBack}
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

                    <div className="col-lg-6">
                      <div className="product-preview-panel__product-options">
                        {/* FIT TYPES */}
                        <div className="product-preview-panel__fit-type-selector">
                          <p className="product-preview-panel__label">
                            Choose fit types:
                          </p>
                          <div className="d-flex gap-3 flex-wrap">
                            {(activeConfig?.fitTypes ?? []).map((fit) => (
                              <label
                                key={fit}
                                className="fit-checkbox"
                                onMouseEnter={() => handleFitHover(fit)}
                                onMouseLeave={() => handleFitHover(null)}
                              >
                                <input
                                  type="radio"
                                  name="fitType"
                                  defaultChecked={
                                    (getActiveFit(
                                      activeProductIndex,
                                      activeConfig.fitTypes[0]
                                    ) ?? activeConfig.fitTypes[0]) === fit
                                  }
                                  onChange={() => handleFitChange(fit)}
                                />
                                <span className="custom-check"></span>
                                {fit.charAt(0) + fit.slice(1).toLowerCase()}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* COLORS */}
                        <div className="product-preview-panel__color-chooser">
                          <p className="product-preview-panel__label">
                            Choose colors:
                          </p>
                          <div className="color-options d-flex gap-2 flex-wrap">
                            {(activeColors ?? []).map((color) => (
                              <label key={color} className="color-option">
                                <input
                                  type="radio"
                                  name="productColor"
                                  value={color}
                                  onChange={() => handleColorChange(color)}
                                  style={{ display: "none" }}
                                />
                                <span
                                  className="color-circle"
                                  style={{
                                    backgroundColor: color,
                                    width: 24,
                                    height: 24,
                                    display: "inline-block",
                                    borderRadius: "50%",
                                    border: "1px solid #ccc",
                                  }}
                                  onMouseEnter={() => handleHoverColor(color)}
                                  onMouseLeave={() => handleHoverColor(null)}
                                  title={color}
                                />
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="product-preview-panel__price-input-field">
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
              )}

              {/* Product Details Form */}
              <div className="product-details__form mt-4">
                <div className="product-details__form-top">
                  <h2 className="product-details__form-title">
                    Artworld should be:
                  </h2>
                  <button
                    className="tag-box-button"
                    data-target=".product-details__form-two"
                  >
                    <i className="fas fa-caret-down"></i>
                  </button>
                </div>

                <form
                  action="#"
                  className="product-details__form-two toggle-list"
                >
                  <div className="row gutter-x-30 gutter-y-30">
                    <div className="col-lg-6">
                      <div className="product-details__form__content">
                        <h4 className="product-details__form__title">
                          Product details (required)
                        </h4>
                        <p className="product-details__form__text">
                          Product names will be appended to this design title
                          e.g. a design title of “Funny Cat” will be displayed
                          as “Funny Cat T-Shirt” on the t-shirt product details
                          page.
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
                          <span>
                            60 characters remaining (minimum 3 characters)
                          </span>
                        </div>

                        {/* <div className="form-control-two">
                          <label>Select Brand</label>
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


                            // <select name="brandDropdown" className="mt-2">
                            //   <option value="">-- Select a Brand --</option>
                            //   {brands?.map((brand) => (
                            //     <option key={brand} value={brand?.id}>
                            //       {brand?.name}
                            //     </option>
                            //   ))}
                            // </select>
                          )}

                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div> */}
                        <div className="form-control-two">
  <label>Select Brand</label>

  {user?.merchantProfile?.brandOption ? (
    // Case 1: brandOption = true → show radio buttons
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
        <BrandDropdown brands={brands} onBrandChange={(id) => setBrandId(id)} />
      )}
    </>
  ) : (
    // Case 2: brandOption = false → show only dropdown
    <BrandDropdown brands={brands} onBrandChange={(id) => setBrandId(id)} />
  )}

  <span>50 characters remaining (minimum 3 characters)</span>
</div>

                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="product-details__form__content">
                        <h4 className="product-details__form__title">
                          Product Features (optional)
                        </h4>
                        <p className="product-details__form__text">
                          Summarize the unique details of your design. They’ll
                          appear in a bulleted list, along with other product
                          information we automatically include.
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
                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                        <div className="form-control-two">
                          <label htmlFor="description">
                            Product description
                          </label>
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
                  <h2 className="product-details__form-title">
                    Artworld should be:
                  </h2>
                  <button className="tag-box-button" data-target=".keyword">
                    <i className="fas fa-caret-down"></i>
                  </button>
                </div>
                <p className="product-details__keyword__text">
                  When entering your product tags or keywords for SEO, you’re
                  taking a crucial step toward increasing your product’s
                  visibility <br /> and attracting more potential customers.
                </p>
                <div className="keyword toggle-list">
                  <label htmlFor="tagInput" className="tag-input-label">
                    *Product Keyword
                  </label>
                  <div className="tag-input-wrapper">
                    <div className="tag-box" id="tagBox">
                      {tags.map((tag, index) => {
                        return (
                          <Tag
                            key={index}
                            tag={tag}
                            onRemove={() => removeTag(index)}
                          />
                        );
                      })}

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
                  <button
                    className="tag-box-button"
                    data-target=".product-details-form"
                  >
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
                        <label
                          htmlFor="non-searchable"
                          className="availability__item"
                        >
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
                            <h3 className="availability__item__title">
                              Non-searchable
                            </h3>
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
                        <label
                          htmlFor="searchable"
                          className="availability__item"
                        >
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
                            <h3 className="availability__item__title">
                              Searchable
                            </h3>
                            <p className="availability__item__text">
                              Appears in Amazon search results
                            </p>
                            <p className="availability__item__text">
                              Customers can find these products through Sadamata
                              search results
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
                  {/* <button className="commerce-btn" onClick={saveImage}>
                    Save Image
                  </button> */}
                  {/* <button
                    className="commerce-btn"
                    onClick={downloadAllMockups}
                    disabled={isDownloading || !designImage}
                    title={!designImage ? "Upload a front design first" : ""}
                  >
                    {isDownloading
                      ? "Preparing ZIP..."
                      : "Download All Images (ZIP)"}
                  </button> */}
                </div>

                <p className="product-details__availability__text">
                  By submitting for production, you acknowledge you have all the
                  necessary rights to the original artwork, Brand name, design
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
