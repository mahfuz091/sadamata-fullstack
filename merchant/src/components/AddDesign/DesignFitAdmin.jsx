"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, FabricImage } from "fabric";
import DashSidebar from "../DashSidebar/DashSidebar";
import Tag from "./Tag";
import { toast } from "sonner";
import {
  createProduct,
  updateProduct,
} from "@/app/actions/product/product.actions";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import BrandDropdown from "./BrandDropDown";
import { useRouter } from "next/navigation";
import { validatePngFile } from "@/utils/validation";

/* ================= CONFIG ================= */

const MAX_DESIGN_PX = 200;
const MIN_OUTPUT_PX = 4500;

/* ================= HELPERS ================= */

const buildImageUrl = (raw) => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) {
    const u = new URL(raw);
    return `/mockup/${u.pathname.replace(/^\/?mockups\//, "")}`;
  }
  return `/mockup/${raw.replace(/^\/?mockups\//, "")}`;
};

const loadHTMLImage = (src) =>
  new Promise((res) => {
    if (!src) return res(null);
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });

/* ================= COMPONENT ================= */

export default function DesignFitAdmin({
  mode = "create", // "create" | "edit"
  product = null,
  allMockup = [],
  currentUserId,
  brands = [],
  user,
}) {
  const router = useRouter();

  /* ================= STATE ================= */

  const [activeProductIndex, setActiveProductIndex] = useState(null);

  const [designImage, setDesignImage] = useState(null);
  const [designBack, setDesignBack] = useState(null);
  const [designImageFile, setDesignImageFile] = useState(null);
  const [designBackFile, setDesignBackFile] = useState(null);

  const [selectedFitType, setSelectedFitType] = useState({});
  const [selectedColor, setSelectedColor] = useState({});
  const [fitClickHistory, setFitClickHistory] = useState({});

  const [tags, setTags] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const [features, setFeatures] = useState({
    title: "",
    feature1: "",
    feature2: "",
    description: "",
    price: "",
    brandName: "",
  });

  const canvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const canvasRefs = useRef([]);

  /* ================= EDIT HYDRATION ================= */

  useEffect(() => {
    if (mode !== "edit" || !product) return;

    setFeatures({
      title: product.title || "",
      feature1: product.features?.[0]?.content || "",
      feature2: product.features?.[1]?.content || "",
      description: product.description || "",
      price: product.price || "",
      brandName: product.brandName || "",
    });

    setTags(product.tags?.map((t) => t.value) || []);

    if (product.frontDesign) setDesignImage(buildImageUrl(product.frontDesign));
    if (product.backDesign) setDesignBack(buildImageUrl(product.backDesign));

    const fitMap = {};
    const colorMap = {};

    product.variants?.forEach((v) => {
      fitMap[0] ??= [];
      if (!fitMap[0].includes(v.fitType)) fitMap[0].push(v.fitType);

      colorMap[0] ??= {};
      colorMap[0][v.fitType] ??= [];
      if (!colorMap[0][v.fitType].includes(v.color))
        colorMap[0][v.fitType].push(v.color);
    });

    setSelectedFitType(fitMap);
    setSelectedColor(colorMap);
    setActiveProductIndex(0);
  }, [mode, product]);

  /* ================= MOCKUP CONFIG ================= */

  const mockupsByProduct = useMemo(() => {
    const data = {};
    allMockup.forEach((p) => {
      if (!p?.name || !Array.isArray(p.variants)) return;
      const fits = {};
      const fitTypes = [];

      p.variants.forEach((v) => {
        const fit = v.fitType;
        const color = v.color;
        if (!fit || !color) return;

        fits[fit] ??= { colors: [], front: {}, back: {} };
        if (!fits[fit].colors.includes(color)) fits[fit].colors.push(color);

        fits[fit].front[color] = buildImageUrl(v.frontImg);
        fits[fit].back[color] = buildImageUrl(v.backImg);
        if (!fitTypes.includes(fit)) fitTypes.push(fit);
      });

      data[p.name.toLowerCase()] = { fits, fitTypes };
    });
    return data;
  }, [allMockup]);

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

  /* ================= SUBMIT ================= */

  const prepareFormData = async () => {
    const mockup = allMockup[0];
    const conf = mockupsByProduct[mockup.name.toLowerCase()];
    if (!conf) return null;

    const fd = new FormData();
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

    if (mode === "edit" && product?.id) fd.append("productId", product.id);

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

  const handleSubmit = async () => {
    if (isPublishing) return;
    setIsPublishing(true);

    const fd = await prepareFormData();
    if (!fd) return setIsPublishing(false);

    const res =
      mode === "edit" ? await updateProduct(fd) : await createProduct(fd);

    if (res?.success) {
      toast.success(mode === "edit" ? "Product updated" : "Product created");
      router.push("/dashboard");
    } else {
      toast.error(res?.message || "Operation failed");
    }

    setIsPublishing(false);
  };

  /* ================= JSX ================= */

  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>

          <div className='col-lg-9'>
            <h2 className='mb-4'>
              {mode === "edit" ? "Edit Product" : "Create Products"}
            </h2>

            {/* UPLOAD */}
            <input
              type='file'
              accept='image/png'
              onChange={(e) => handleFrontFile(e.target.files[0])}
            />

            {/* PRODUCT GRID */}
            <div className='d-flex gap-4 mt-4'>
              {allMockup.map((m, i) => (
                <button
                  key={m.id}
                  className='commerce-btn'
                  onClick={() => setActiveProductIndex(i)}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* DETAILS FORM */}
            <div className='mt-4'>
              <input
                type='text'
                placeholder='Design title'
                value={features.title}
                onChange={(e) =>
                  setFeatures((p) => ({ ...p, title: e.target.value }))
                }
              />

              <textarea
                placeholder='Description'
                value={features.description}
                onChange={(e) =>
                  setFeatures((p) => ({ ...p, description: e.target.value }))
                }
              />

              <input
                type='number'
                placeholder='Price'
                value={features.price}
                onChange={(e) =>
                  setFeatures((p) => ({ ...p, price: e.target.value }))
                }
              />
            </div>

            {/* TAGS */}
            <div className='mt-3'>
              {tags.map((t, i) => (
                <Tag
                  key={i}
                  tag={t}
                  onRemove={() => setTags(tags.filter((_, x) => x !== i))}
                />
              ))}
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setTags([...tags, e.target.value]);
                    e.target.value = "";
                  }
                }}
              />
            </div>

            {/* SUBMIT */}
            <button
              className='commerce-btn mt-4'
              onClick={handleSubmit}
              disabled={isPublishing}
            >
              {isPublishing
                ? "Processing..."
                : mode === "edit"
                ? "Update Product"
                : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
