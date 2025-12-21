import { useState, useMemo } from "react";
import { LIMITS } from "../constants";

/**
 * Handles:
 * - title, description, features
 * - price, brand, availability
 * - tags
 * - validation before publish
 */
export function useProductForm() {
  /* ---------------- CORE FIELDS ---------------- */

  const [features, setFeatures] = useState({
    title: "",
    feature1: "",
    feature2: "",
    description: "",
    price: 990,
    brandName: "",
    brandCommissionPct: null,
    merchantCommissionPct: null,
  });

  const [brandOption, setBrandOption] = useState("non-brand");
  const [brandId, setBrandId] = useState(null);

  const [availability, setAvailability] = useState("searchable");

  /* ---------------- TAGS ---------------- */

  const [tags, setTags] = useState([]);
  const tagLimit = 10;

  const addTag = (tag) => {
    const clean = tag.trim();
    if (!clean) return;
    if (tags.length >= tagLimit) return;
    if (tags.includes(clean)) return;
    setTags((prev) => [...prev, clean]);
  };

  const removeTag = (index) =>
    setTags((prev) => prev.filter((_, i) => i !== index));

  /* ---------------- FIELD HANDLERS ---------------- */

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFeatures((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- VALIDATION ---------------- */

  const validation = useMemo(() => {
    const errors = [];

    if (!features.title || features.title.trim().length < 3) {
      errors.push("Design title must be at least 3 characters.");
    }

    if (!features.description || features.description.trim().length < 75) {
      errors.push("Description must be at least 75 characters.");
    }

    if (features.price < 990) {
      errors.push("Price must be at least BDT 990.");
    }

    if (
      brandOption === "non-brand" &&
      features.brandName.length > LIMITS.brandName
    ) {
      errors.push("Brand name exceeds character limit.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }, [features, brandOption]);

  /* ---------------- HELPERS ---------------- */

  const remainingChars = (value = "", limit) =>
    Math.max(0, limit - value.length);

  /* ---------------- PUBLIC API ---------------- */

  return {
    /* state */
    features,
    brandOption,
    brandId,
    availability,
    tags,

    /* setters */
    setFeatures,
    setBrandOption,
    setBrandId,
    setAvailability,

    /* tag handlers */
    addTag,
    removeTag,

    /* form handlers */
    handleFeatureChange,

    /* helpers */
    remainingChars,
    validation,
  };
}
