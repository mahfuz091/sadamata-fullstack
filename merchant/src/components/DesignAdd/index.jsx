"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import DashSidebar from "../DashSidebar/DashSidebar";

import { useMockupConfig } from "./hooks/useMockupConfig";
import { useDesignState } from "./hooks/useDesignState";
import { useProductForm } from "./hooks/useProductForm";

import { composeSideToBlob } from "./actions/composeMockup";
import { prioritizeBlack } from "./utils/colors";

import DesignUploader from "./components/DesignUploader";
import ProductGrid from "./components/ProductGrid";
import PreviewPanel from "./components/PreviewPanel";
import FitSelector from "./components/FitSelector";
import ColorSelector from "./components/ColorSelector";
import ProductDetailsForm from "./components/ProductDetailsForm";

import { createProduct } from "@/app/actions/product/product.actions";

/* ------------------------------------------------------------------ */

export default function DesignAdd({
  allMockup = [],
  currentUserId,
  brands = [],
  user,
}) {
  const router = useRouter();

  /* ---------------- MOCKUP CONFIG ---------------- */
  const mockupConfig = useMockupConfig(allMockup);

  /* ---------------- DESIGN STATE ---------------- */
  const {
    designImage,
    setDesignImage,
    designBack,
    setDesignBack,
    positions,
    setPositions,
  } = useDesignState();

  /* ---------------- FORM STATE ---------------- */
  const form = useProductForm();

  /* ---------------- UI STATE ---------------- */
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [selectedFits, setSelectedFits] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [hoverFit, setHoverFit] = useState(null);
  const [hoverColor, setHoverColor] = useState(null);
  const [isBackView, setIsBackView] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  /* ---------------- CANVAS REFS ---------------- */
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);

  /* ---------------- ACTIVE PRODUCT ---------------- */
  const activeProduct =
    activeProductIndex !== null ? allMockup[activeProductIndex] : null;

  const activeConfig = useMemo(() => {
    if (!activeProduct) return null;
    return mockupConfig[activeProduct.name.toLowerCase()] ?? null;
  }, [activeProduct, mockupConfig]);

  /* ---------------- ACTIVE FIT ---------------- */
  const activeFit = useMemo(() => {
    if (!activeProductIndex || !activeConfig) return null;

    const selected = selectedFits[activeProductIndex] ?? [];
    if (hoverFit) return hoverFit;

    return selected[0] ?? activeConfig.fitTypes[0];
  }, [activeProductIndex, activeConfig, selectedFits, hoverFit]);

  /* ---------------- ACTIVE COLORS ---------------- */
  const availableColors = useMemo(() => {
    if (!activeConfig || !activeFit) return [];
    return prioritizeBlack(activeConfig.fits[activeFit]?.colors ?? []);
  }, [activeConfig, activeFit]);

  const activeColors = selectedColors[activeProductIndex]?.[activeFit] ?? [];

  /* ---------------- DEFAULT SELECTION INIT ---------------- */
  useEffect(() => {
    if (activeProductIndex === null || !activeConfig) return;

    if (!selectedFits[activeProductIndex]) {
      setSelectedFits((p) => ({
        ...p,
        [activeProductIndex]: [activeConfig.fitTypes[0]],
      }));
    }

    if (!selectedColors[activeProductIndex]) {
      setSelectedColors((p) => ({
        ...p,
        [activeProductIndex]: {
          [activeConfig.fitTypes[0]]: [availableColors[0]],
        },
      }));
    }
  }, [activeProductIndex, activeConfig]);

  /* ---------------- FIT TOGGLE ---------------- */
  const toggleFit = (fit) => {
    setSelectedFits((prev) => {
      const current = prev[activeProductIndex] ?? [];
      const exists = current.includes(fit);
      return {
        ...prev,
        [activeProductIndex]: exists
          ? current.filter((f) => f !== fit)
          : [...current, fit],
      };
    });
  };

  /* ---------------- COLOR TOGGLE ---------------- */
  const toggleColor = (color) => {
    setSelectedColors((prev) => {
      const productColors = prev[activeProductIndex] ?? {};
      const fitColors = productColors[activeFit] ?? [];

      const exists = fitColors.includes(color);
      return {
        ...prev,
        [activeProductIndex]: {
          ...productColors,
          [activeFit]: exists
            ? fitColors.filter((c) => c !== color)
            : [...fitColors, color],
        },
      };
    });
  };

  /* ---------------- FILE HANDLERS ---------------- */
  const handleFrontUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setDesignImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBackUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setDesignBack(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- PREPARE FORM DATA ---------------- */
  const prepareMockupFiles = async () => {
    if (!activeProduct || !activeConfig) return null;
    if (!designImage && !designBack) return null;

    const formData = new FormData();
    const title = form.features.title.trim();

    formData.append("title", title);
    formData.append("description", form.features.description);
    formData.append("price", String(form.features.price));
    formData.append("visibility", form.availability === "searchable");
    formData.append("userId", String(currentUserId));
    formData.append("mockupId", String(activeProduct.id));

    if (form.brandId) formData.append("brandId", form.brandId);
    if (form.features.brandName)
      formData.append("brandName", form.features.brandName);

    let vIndex = 0;

    for (const fit of selectedFits[activeProductIndex] ?? []) {
      const colors = selectedColors[activeProductIndex]?.[fit] ?? [];

      for (const color of colors) {
        const frontSrc = activeConfig.fits[fit].front[color];
        const backSrc = activeConfig.fits[fit].back[color];

        formData.append(`variants[${vIndex}][fitType]`, fit);
        formData.append(`variants[${vIndex}][color]`, color);

        if (designImage && frontSrc) {
          const frontBlob = await composeSideToBlob({
            baseSrc: frontSrc,
            overlaySrc: designImage,
            side: "FRONT",
            fit,
            positions,
          });
          if (frontBlob) {
            formData.append(
              `variants[${vIndex}][frontImg]`,
              frontBlob,
              `${title}_${fit}_${color}_front.png`
            );
          }
        }

        if (designBack && backSrc) {
          const backBlob = await composeSideToBlob({
            baseSrc: backSrc,
            overlaySrc: designBack,
            side: "BACK",
            fit,
            positions,
          });
          if (backBlob) {
            formData.append(
              `variants[${vIndex}][backImg]`,
              backBlob,
              `${title}_${fit}_${color}_back.png`
            );
          }
        }

        vIndex++;
      }
    }

    return vIndex > 0 ? formData : null;
  };

  /* ---------------- PUBLISH ---------------- */
  const handlePublish = async () => {
    if (!form.validation.valid) {
      toast.error(form.validation.errors[0]);
      return;
    }

    try {
      setIsPublishing(true);
      const formData = await prepareMockupFiles();
      if (!formData) throw new Error("No variants generated");

      const res = await createProduct(formData);
      if (!res?.success) throw new Error(res?.message);

      toast.success("Product created successfully");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to publish product");
    } finally {
      setIsPublishing(false);
    }
  };

  /* ---------------- JSX ---------------- */
  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>

          <div className='col-lg-9'>
            <DesignUploader
              preview={designImage}
              onUpload={handleFrontUpload}
            />

            <ProductGrid
              products={allMockup}
              onSelect={setActiveProductIndex}
            />

            {activeProduct && (
              <>
                <PreviewPanel
                  canvasRef={isBackView ? backCanvasRef : frontCanvasRef}
                  isBackView={isBackView}
                  onFront={() => setIsBackView(false)}
                  onBack={() => setIsBackView(true)}
                  onBackUpload={handleBackUpload}
                  onRemoveBack={() => setDesignBack(null)}
                  hasBackDesign={!!designBack}
                />

                <FitSelector
                  fits={activeConfig.fitTypes}
                  selectedFits={selectedFits[activeProductIndex] ?? []}
                  onToggle={toggleFit}
                  onHover={setHoverFit}
                />

                <ColorSelector
                  colors={availableColors}
                  selectedColors={activeColors}
                  onToggle={toggleColor}
                  onHover={setHoverColor}
                />
              </>
            )}

            <ProductDetailsForm {...form} brands={brands} />

            <button
              className='commerce-btn'
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
