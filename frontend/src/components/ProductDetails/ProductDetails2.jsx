"use client";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import sizeChartImage from "@/assets/images/resources/sadamata-sizechart.png";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import user1 from "@/assets/images/resources/user-1-2.png";
import { isLightColor } from "@/lib/helper";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/useFavorites";
import AddToCartModal from "../FeatureProduct/AddToCartModal";
import { submitProductReview } from "@/app/actions/review/review.actions";
import { trackRecentlyViewedProduct } from "../RecentlyViewedProducts/RecentlyViewedProducts";
// --------------- Helpers ---------------
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
// const getImgSrc = (src) => {
//   if (!src) return `${ASSET_BASE}/uploads/placeholder.png`;
//   return `${ASSET_BASE}/${src.replace(/^\/+/, "")}`;
// };
const getImgSrc = (src) => {
  if (!src) return "/placeholder.png";

  // ✅ Next.js static import
  if (typeof src === "object" && src.src) return src.src;

  // ✅ signed/full url
  if (typeof src === "string" && /^https?:\/\//i.test(src)) return src;

  // ⛔ private key browser এ কাজ করবে না
  // তাই fallback দিচ্ছি (কারণ key হলে signed url server থেকে আসা উচিত)
  return "/placeholder.png";
};

const getShareUrl = () => {
  if (typeof window === "undefined") return "";
  return window.location.href;
};

const getShareText = (product) =>
  `${product?.title || "Check this product"} – ${getShareUrl()}`;

export const toPublicUrl = (path) => {
  if (!path) return `/uploads/placeholder.png`;
  const rel = path.replace(/^\/+/, "");

  return `${ASSET_BASE}/${rel}`;
};

const hexToName = (hex) => {
  const map = {
    "#000": "Black",
    "#000000": "Black",
    "#fff": "White",
    "#ffffff": "White",
    "#000080": "Navy",
    "#807e78": "Stone",
  };
  return map[hex?.toLowerCase?.()] ?? hex?.toUpperCase?.() ?? "Unknown";
};


const formatReviewDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
const REVIEW_TABS = [
  { key: "all", label: "All Reviews" },
  { key: "media", label: "With Photo & Video" },
  { key: "description", label: "With Description" },
];

const hasReviewMedia = (review) => Boolean(review?.mediaUrl);
const hasReviewDescription = (review) => Boolean(review?.comment?.trim());

const groupByFit = (variants = []) =>
  variants.reduce(
    (acc, v) => {
      const key = v?.fitType || "MEN";
      (acc[key] ||= []).push(v);
      return acc;
    },
    { MEN: [], WOMEN: [], YOUTH: [] }
  );

const colorsForFit = (vs = []) => {
  const seen = new Set();
  const list = [];
  vs.forEach((v) => {
    if (v?.color && !seen.has(v.color)) {
      seen.add(v.color);
      list.push(v.color);
    }
  });
  return list;
};

// --------------- Component ---------------
export default function ProductDetails2({ product, user, reviewOrderItemId = "", salesRank }) {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  console.log(product, "product");

  const reviews = product?.reviews || [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
      reviewCount
    : 0;
  const averageRatingText = averageRating.toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((review) => review.rating === rating).length
  );
  const ratingPercentages = ratingCounts.map((count) =>
    reviewCount ? Math.round((count / reviewCount) * 100) : 0
  );
  const circleOffset = 190 - (averageRating / 5) * 190;
  const hasReviewedCurrentItem = Boolean(
    reviewOrderItemId &&
      reviews.some((review) => review.orderItemId === reviewOrderItemId)
  );
  const canReviewCurrentItem = Boolean(
    reviewOrderItemId && user?.id && !hasReviewedCurrentItem
  );

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMediaFile, setReviewMediaFile] = useState(null);
  const [reviewPending, startReviewTransition] = useTransition();
  const [selectedReviewRatings, setSelectedReviewRatings] = useState([]);
  const [activeReviewTab, setActiveReviewTab] = useState("all");

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const ratingMatches =
          selectedReviewRatings.length === 0 ||
          selectedReviewRatings.includes(Number(review.rating));

        if (!ratingMatches) return false;

        if (activeReviewTab === "media") {
          return hasReviewMedia(review);
        }

        if (activeReviewTab === "description") {
          return hasReviewDescription(review) && !hasReviewMedia(review);
        }

        return true;
      }),
    [activeReviewTab, reviews, selectedReviewRatings]
  );

  const toggleReviewRating = (rating) => {
    setSelectedReviewRatings((current) =>
      current.includes(rating)
        ? current.filter((item) => item !== rating)
        : [...current, rating]
    );
  };
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [activeImage, setActiveImage] = useState(null);
  const [lockedImage, setLockedImage] = useState(null);

  const mainSwiperRef = useRef(null);

  useEffect(() => {
    if (canReviewCurrentItem) {
      setShowReviewModal(true);
      const reviewSection = document.getElementById("product-reviews");
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [canReviewCurrentItem]);

  const handleReviewMediaChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setReviewMediaFile(null);
      return;
    }

    if (file.type.startsWith("video/") && file.size > 2 * 1024 * 1024) {
      toast.error("Video file must be 2MB or smaller.");
      event.target.value = "";
      setReviewMediaFile(null);
      return;
    }

    setReviewMediaFile(file);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!user?.id) {
      toast.error("Please login to review this product.");
      return;
    }

    startReviewTransition(async () => {
      const result = await submitProductReview({
        productId: product?.id,
        orderItemId: reviewOrderItemId,
        rating: reviewRating,
        comment: reviewComment,
        mediaFile: reviewMediaFile,
      });

      if (!result?.ok) {
        toast.error(result?.error || "Failed to submit review.");
        return;
      }

      toast.success("Review submitted successfully.");
      setReviewComment("");
      setReviewMediaFile(null);
      setReviewRating(0);
      setShowReviewModal(false);
      router.refresh();
    });
  };

  const grouped = useMemo(
    () => groupByFit(product?.variants || []),
    [product?.variants]
  );
  const availableFits = useMemo(
    () =>
      ["MEN", "WOMEN", "YOUTH"].filter((k) => (grouped[k] || []).length > 0),
    [grouped]
  );

  // const initialFit = product?.variants?.[0]?.fitType || "MEN";
  // const [fit, setFit] = useState(initialFit);
  const initialFit = availableFits[0] || "MEN";
  const [fit, setFit] = useState(initialFit);
  const [size, setSize] = useState("");
  useEffect(() => {
    if (!availableFits.length) return;
    setFit((prev) => (availableFits.includes(prev) ? prev : availableFits[0]));
  }, [availableFits]);

  const fitVariants = grouped[fit] || [];
  const fitColors = useMemo(() => colorsForFit(fitVariants), [fitVariants]);
  const [color, setColor] = useState(fitColors[0] || "#000");

  console.log(product, "product details");

  // keep selected color valid as fit/colors change
  useEffect(() => {
    if (!fitColors.length) return;
    setColor((prev) => (fitColors.includes(prev) ? prev : fitColors[0]));
  }, [fitColors]);

  const currentVariant =
    fitVariants.find((v) => v.color === color) || fitVariants[0] || null;

  useEffect(() => {
    if (!product?.id) return;

    trackRecentlyViewedProduct({
      id: product.id,
      productId: product.productId,
      title: product.title,
      price: product.price,
      brand: product.Brand?.name || product.brandName || "Brand",
      brandId: product.Brand?.id || null,
      imageKey:
        currentVariant?.frontImg ||
        currentVariant?.backImg ||
        null,
      imageUrl:
        currentVariant?.frontImgUrl ||
        currentVariant?.backImgUrl ||
        product.previewUrl ||
        null,
      previewUrl: product.previewUrl || null,
      variants: product.variants || [],
    });
  }, [
    currentVariant?.backImgUrl,
    currentVariant?.frontImgUrl,
    product?.Brand?.id,
    product?.Brand?.name,
    product?.brandName,
    product?.id,
    product?.previewUrl,
    product?.price,
    product?.variants,
    product?.productId,
    product?.title,
  ]);

  const variantImages = useMemo(() => {
    if (!currentVariant) return [];

    return [
      { key: "front", label: "Front", src: currentVariant.frontImgUrl },
      { key: "back", label: "Back", src: currentVariant.backImgUrl },
    ].filter((x) => x.src); // যেটা নাই বাদ
  }, [currentVariant]);

  useEffect(() => {
    if (variantImages.length) {
      setLockedImage(variantImages[0]);
      setActiveImage(variantImages[0]);
    }
  }, [variantImages]);

  // Rule: MEN + exactly 4 colors => show all MEN colors (front only)
  //   const showAllForFit = fit === "MEN" && fitColors.length === 4;
  const showAllForFit = fitColors.length;

  // Build gallery (front-only) + color -> slide index
  const { galleryImages, colorToIndex } = useMemo(() => {
    if (!fitVariants.length) return { galleryImages: [], colorToIndex: {} };

    let slideIndex = 0;
    const map = {};
    const imgs = [];

    fitVariants.forEach((v) => {
      if (v.frontImgUrl) {
        if (!(v.color in map)) map[v.color] = slideIndex;
        imgs.push({
          src: v.frontImgUrl,
          alt: `${fit} ${hexToName(v.color)} – Front`,
          key: `${v.id}-front`,
          color: v.color,
        });
        slideIndex++;
      }
    });

    return { galleryImages: imgs, colorToIndex: map };
  }, [fit, fitVariants]);

  // Reset to first slide when fit/mode changes
  useEffect(() => {
    if (mainSwiperRef.current) mainSwiperRef.current.slideTo(0, 0);
  }, [fit, showAllForFit]);

  // Jump to clicked color’s slide when showing-all mode is active
  useEffect(() => {
    if (!showAllForFit) return;
    const idx = colorToIndex[color] ?? 0;
    if (mainSwiperRef.current) mainSwiperRef.current.slideTo(idx, 0);
    if (thumbsSwiper?.slideTo) thumbsSwiper.slideTo(idx, 0);
  }, [color, showAllForFit, colorToIndex, thumbsSwiper]);

  const [quantity, setQuantity] = useState(1);
  console.log(galleryImages, "galleryImages");

  // --------------- Cart Helper ---------------

  const handleBuyNow = () => {
    if (!fit) {
      toast.error("Please select fit type");
      return;
    }

    if (!color) {
      toast.error("Please select a color");
      return;
    }

    if (!size) {
      toast.error("Please select a size");
      return;
    }

    addToCart(product, {
      quantity,
      color,
      fit,
      size,
      image: currentVariant?.frontImg || "",
    });
  };

  const addToCart = (product, options) => {
    if (typeof window === "undefined") return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
      id: product?.id,
      title: product?.title,
      brand: product?.Brand?.name || product?.brandName || "—",
      price: product?.price,
      quantity: options.quantity,
      color: options.color,
      fit: options.fit,
      size: options.size,
      image: options.image, // 👈 correct front image for chosen fit + color
    };

    const existingIndex = cart.findIndex(
      (p) =>
        p.id === item.id &&
        p.color === item.color &&
        p.fit === item.fit &&
        p.size === item.size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/cart";
  };

  const fitOptions = useMemo(
    () => availableFits.map((f) => ({ value: f, label: f })),
    [availableFits]
  );

  // keep it controlled (same as your native select)
  const selectedFitOption = fitOptions.find((o) => o.value === fit) ?? null;
  // console.log(fit, "fit");

  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleShare = (type) => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText(product));
    console.log(url);

    let shareUrl = "";

    switch (type) {
      case "email":
        shareUrl = `mailto:?subject=${text}&body=${url}`;
        break;

      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;

      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;

      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
        break;

      case "copy":
        navigator.clipboard.writeText(getShareUrl());
        toast.success("Link copied to clipboard");
        setShareOpen(false);
        return;

      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  };

  const handleAddToCartOnly = () => {
    if (!fit) return toast.error("Please select fit type");
    if (!color) return toast.error("Please select color");
    if (!size) return toast.error("Please select size");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
      id: product.id,
      title: product.title,
      brand: product?.Brand?.name || product?.brandName || "—",
      price: product.price,
      quantity,
      fit,
      color,
      size,
      image: currentVariant?.frontImg || "",
    };

    const index = cart.findIndex(
      (i) =>
        i.id === item.id &&
        i.fit === item.fit &&
        i.color === item.color &&
        i.size === item.size
    );

    if (index > -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔔 notify header/cart icon
    window.dispatchEvent(new Event("cart-updated"));

    toast.success("Added to cart");
  };

  const staticAllImage = {
    key: "all",
    label: "All Views",
    src: sizeChartImage,
  };
  console.log(product);

  return (
    <>
      <section className='product-details py-5'>
        <Container>
          {/* Breadcrumbs */}
          <div className='product-header-top mb-3'>
            <ul className='commerce-breadcrumb list-unstyled '>
              <li>
                <a href='/'>Home</a>
              </li>
              {/* <li><a href="#">T-Shirts</a></li> */}
              <li>
                <span>{product?.title || "Product"}</span>
              </li>
            </ul>
          </div>

          <Row>
            {/* -------- Left: Gallery (front-only) -------- */}
            {/* <Col lg={6} className='mb-4 mb-lg-0'>
              <div className='product-details__product'>
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation
                  thumbs={
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? { swiper: thumbsSwiper }
                      : undefined
                  }
                  className='product-details__carousel mb-3'
                  onSwiper={(s) => (mainSwiperRef.current = s)}
                  key={`${fit}-${showAllForFit ? "all" : "one"}`}
                >
                  {galleryImages.map(({ src, alt, key }, idx) => {
                    const rel = (src || "").replace(/^\/+/, "");
                    const imgSrc = rel
                      ? `${ASSET_BASE}/${rel}`
                      : `${ASSET_BASE}/uploads/placeholder.png`;

                    return (
                      <SwiperSlide key={key}>
                        <div className='product-details__image'>
                          <Image
                            src={imgSrc}
                            alt={alt}
                            className='img-fluid overflow-hidden'
                            width={720}
                            height={620}
                            priority={idx === 0}
                            unoptimized
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={10}
                  watchSlidesProgress
                  className='product-details__thumb'
                  freeMode
                >
                  {galleryImages.map(({ src, alt, key, color }, idx) => {
                    const rel = (src || "").replace(/^\/+/, "");
                    const imgSrc = rel
                      ? `${ASSET_BASE}/${rel}`
                      : `${ASSET_BASE}/uploads/placeholder.png`;
                    return (
                      <SwiperSlide
                        key={`${key}-thumb`}
                        onClick={() => {
                          mainSwiperRef.current?.slideTo(idx);
                          thumbsSwiper?.slideTo?.(idx);
                          setColor(color);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className='product-details__thumb__item'>
                          <Image
                            src={imgSrc}
                            alt={`${alt} thumbnail`}
                            className='img-fluid'
                            width={200}
                            height={200}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </Col> */}
            <Col lg={6} className='mb-4 mb-lg-0'>
              <div className='product-details__product image-hover-layout'>
                {/* SMALL IMAGES */}
                <div className='thumbnail-column d-flex'>
                  {[...variantImages, staticAllImage].map((img) => (
                    <div
                      key={img.key}
                      className={`thumbnail-item ${
                        lockedImage?.key === img.key ? "active" : ""
                      }`}
                      onMouseEnter={() => setActiveImage(img)}
                      onMouseLeave={() => setActiveImage(lockedImage)}
                      onClick={() => {
                        setLockedImage(img);
                        setActiveImage(img);
                      }}
                    >
                      <Image
                        src={getImgSrc(img.src)}
                        alt={img.label}
                        width={80}
                        height={80}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>

                {/* BIG IMAGE */}
                <div className='main-image-box'>
                  {activeImage && (
                    <Image
                      src={getImgSrc(activeImage.src)}
                      alt={activeImage.label}
                      width={720}
                      height={720}
                      priority
                      unoptimized
                      className='img-fluid'
                    />
                  )}
                </div>
              </div>
            </Col>

            {/* -------- Right: Content & Controls -------- */}
            <Col lg={6}>
              <div className='product-details__content'>
                <p className='product-details__brand-name'>
                  Brand:{" "}
                  <span>
                    {product?.Brand?.id ? (
                      <Link href={`/brand/${product.Brand.id}`}>
                        {product?.Brand?.name || product?.brandName || "—"}
                      </Link>
                    ) : (
                      product?.Brand?.name || product?.brandName || "—"
                    )}
                  </span>
                </p>
                <h4 className='product-details__title'>
                  {product?.title || "Untitled"}
                </h4>
                <p className='product-details__status'>
                  Status:{" "}
                  <span>{product?.isActive ? "In Stock" : "Unavailable"}</span>
                </p>

                {/* Rating */}
                <div className='product-details__start d-none'>
                  <div className='product-details__start__item'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className='fas fa-star'></i>
                    ))}
                    <span>(120 Reviews)</span>
                  </div>
                  <p className='product-details__start__text'>
                    <span>150,000+ Satisfied</span> Customers Worldwide!
                  </p>
                </div>

                <div className='populer-feature'>
                  <h4 className='populer-feature__title'>Product Features</h4>
                  <ul className='populer-feature__list list-unstyled'>
                    <li>
                      <span className='dot'></span>{" "}
                      <strong>Fabric Type:</strong> Knit
                    </li>
                    <li>
                      <span className='dot'></span> <strong>Fit Type:</strong>{" "}
                      Regular ({product?.Mockup?.name})
                    </li>
                    <li>
                      <span className='dot'></span>{" "}
                      <strong>Closure Type:</strong> Pull On
                    </li>
                    <li>
                      <span className='dot'></span> <strong>Origin:</strong>{" "}
                      Bangladesh
                    </li>
                    <li>
                      <span className='dot'></span>{" "}
                      <strong>Manufacturer:</strong> Sadamata
                    </li>
                  </ul>
                </div>

                {/* Fit selector */}
                <div className='product-details__box'>
                  {/* Quantity */}
                  <div className='product-details__quantity '>
                    <h4 className='product-details__box__title'>Quantity:</h4>
                    <div className='product-details__quantity__box'>
                      <button
                        type='button'
                        className='sub'
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label='Increase quantity'
                      >
                        <i className='fas fa-angle-up'></i>
                      </button>
                      <input
                        type='text'
                        value={quantity}
                        readOnly
                        aria-live='polite'
                      />
                      <button
                        type='button'
                        className=' add'
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label='Decrease quantity'
                      >
                        <i className='fas fa-angle-down'></i>
                      </button>
                    </div>
                  </div>
                  <div className='product-details__size'>
                    <h4 className='product-details__box__title'>
                      Product Size:
                    </h4>
                    {/* <select
                      className='form-select'
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <option>Select Size</option>
                      {["S", "M", "L", "XL", "XXL", "3XL"].map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select> */}
                    <select
                      className='form-select'
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <option value='' disabled>
                        Select Size
                      </option>

                      {["S", "M", "L", "XL", "XXL", "3XL"].map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='product-details__size'>
                    <h4 className='product-details__box__title'>Fit Type:</h4>

                    <Select
                      className='fit-select'
                      classNamePrefix='fit'
                      options={fitOptions}
                      value={selectedFitOption}
                      onChange={(opt) =>
                        setFit(opt?.value ?? fitOptions[0]?.value ?? "")
                      }
                      isSearchable={false}
                      // orange theming for hover/selected states
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: 38,
                          borderColor: state.isFocused
                            ? "#ff8a00"
                            : base.borderColor,
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #ff8a00"
                            : "none",
                          ":hover": { borderColor: "#ff8a00" },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? "#ff8a00" // selected bg
                            : state.isFocused
                            ? "rgba(255,138,0,0.15)" // hover bg
                            : "transparent",
                          color: state.isSelected ? "#fff" : "#111",
                          ":active": {
                            backgroundColor: state.isSelected
                              ? "#ff8a00"
                              : "rgba(255,138,0,0.25)",
                          },
                        }),
                        menu: (base) => ({ ...base, zIndex: 10 }),
                        singleValue: (base) => ({ ...base, color: "#111" }),
                        dropdownIndicator: (base, state) => ({
                          ...base,
                          color: state.isFocused ? "#ff8a00" : base.color,
                          ":hover": { color: "#ff8a00" },
                        }),
                      }}
                    />
                  </div>

                  {/* Color swatches */}
                  <div className='product-details__color'>
                    <h4 className='product-details__box__title'>Colors:</h4>
                    <div className='d-flex gap-2 flex-wrap'>
                      {fitColors.map((c) => (
                        <label
                          key={c}
                          className='color-radio'
                          title={hexToName(c)}
                        >
                          <input
                            type='radio'
                            name='color'
                            checked={color === c}
                            onChange={() => setColor(c)}
                          />
                          <span
                            className='color-radio__swatch'
                            style={{ backgroundColor: c }}
                          >
                            {color === c && (
                              <span
                                className='color-radio__tick'
                                style={{
                                  color: isLightColor(c) ? "#000" : "#fff",
                                }}
                              >
                                ✓
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className='product-details__price mt-3'>
                  <span>
                    {product?.price != null ? `৳ ${product.price}` : ""}
                  </span>
                </div>

                {/* CTA */}
                <div className='product-details__btn'>
                  <div className='product-details__btn__item'>
                    <button
                      className='commerce-btn'
                      onClick={handleAddToCartOnly}
                    >
                      Add To Cart 
                    </button>
                  </div>
                  <div className='product-details__btn__item'>
                    <button className='commerce-btn' onClick={handleBuyNow}>
                      Buy Now 
                    </button>
                  </div>
                  <div className='product-details__btn__item'>
                    <button
                      className={`product-details__btn__info ${
                        isFavorite(product.id) ? "active" : ""
                      }`}
                      aria-label='Add to wishlist'
                      onClick={() => toggleFavorite(product)}
                    >
                      <i className='far fa-heart'></i>
                    </button>
                  </div>

                  <div
                    className='product-details__btn__item position-relative'
                    ref={shareRef}
                  >
                    <button
                      className='product-details__btn__info'
                      aria-label='Share'
                      onClick={() => setShareOpen((o) => !o)}
                    >
                      <i className='fas fa-share-alt'></i>
                    </button>

                    {shareOpen && (
                      <div className='share-dropdown'>
                        <button onClick={() => handleShare("email")}>
                          <i className='fas fa-envelope'></i> Email
                        </button>

                        <button onClick={() => handleShare("pinterest")}>
                          <i className='fab fa-pinterest'></i> Pinterest
                        </button>

                        <button onClick={() => handleShare("facebook")}>
                          <i className='fab fa-facebook'></i> Facebook
                        </button>

                        <button onClick={() => handleShare("twitter")}>
                          <i className='fab fa-x-twitter'></i> X
                        </button>

                        <button onClick={() => handleShare("copy")}>
                          <i className='fas fa-link'></i> Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className='product-info'>
        <Container>
          <div className='product-info__tabs'>
            <ul className='nav nav-tabs' id='myTab' role='tablist'>
              <li className='nav-item' role='presentation'>
                <button
                  className='active'
                  id='home-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#home'
                  type='button'
                  role='tab'
                  aria-controls='home'
                  aria-selected='true'
                >
                  Detail Product
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  id='profile-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#profile'
                  type='button'
                  role='tab'
                  aria-controls='profile'
                  aria-selected='false'
                >
                  Report an Issue with this Product or Seller
                </button>
              </li>
            </ul>
            <div className='tab-content' id='myTabContent'>
              <div
                className='tab-pane fade show active'
                id='home'
                role='tabpanel'
                aria-labelledby='home-tab'
              >
                <h2 className='product-info__title'>
                  {product?.title || "Untitled"}
                </h2>

                <div className='product-info__list__info'>
                  <h3 className='product-info__list__title'>About this item</h3>
                  <ul className='product-info__list'>
                    {!!product?.features?.length && (
                      <>
                        {product.features.map((f) => (
                          <li key={f.id}>{f.content}</li>
                        ))}
                      </>
                    )}
                    {/* <li>
                      Officially Licensed Sadamata The Lion King Apparel for
                      Women - Men - Youth - Toddler; Sadamata Villains T-Shirt;
                      Holiday; Seasonal; Christmas; Vintage; Sadamataland;
                      Sadamata+; Sadamata Plus; Sadamata World; Present;
                      Birthday; Scar T-Shirt; Lion; Hyena;
                    </li>
                    <li>15PXLK061</li>
                    <li>
                      Lightweight, Classic fit, Double-needle sleeve and bottom
                      hem
                    </li> */}
                    <li>
                      <a href='#'>See Size Chart</a>
                    </li>
                  </ul>
                </div>
                <div className='product-info__list__info'>
                  <h3 className='product-info__list__title'>
                    Product Description
                  </h3>
                  <p className='product-info__text'>
                    {product?.description || "No description"}
                  </p>
                </div>
                <div className='product-info__list__info'>
                  <h3 className='product-info__list__title'>
                   Care Instructions
                  </h3>
                    <ul className='product-info__list'>
                    <li>
                      Machine wash cold (max 30°C)
                    </li>
                    <li>
                      Wash with similar colors
                    </li>
                    <li>
                       Wash inside out
                    </li>
                    <li>
                     Do not bleach
                    </li>
                    <li>
             Tumble dry low or hang to dry
                    </li>
                    <li>
            Do not iron directly on print
                    </li>
                    <li>
         Warm iron on reverse side if needed
                    </li>
                    <li>
    Do not dry clean
                    </li>
                  </ul>
                </div>
                <div className='product-info__list__info'>
                  <h3 className='product-info__list__title'>Product details</h3>
                  <ul className='product-info__list'>
                    <li>
                      <span>Department : </span>{product?.Mockup?.name}
                    </li>
                    <li>
                      <span>Package Dimensions :</span> 10 x 8 x 2 inches

                    </li>
                    
                 
                    <li>
                      <span>Date First Available :</span>{" "}
                      {product?.updatedAt
                        ? new Date(product.updatedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </li>
                     <li>
                      <span>SMPIN : </span>
                      {product?.smpin || ""}
                    </li>
                    <li>
                      <span>Sales Rank (Sadamata) : </span>
                      {salesRank?.totalUnitsSold > 0
                        ? `#${salesRank.rank} in All Departments (${salesRank.totalUnitsSold} units sold)`
                        : ""}
                    </li>
                   
                    <li>
                      <span>Customer Reviews :</span> 
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className='tab-pane fade'
                id='profile'
                role='tabpanel'
                aria-labelledby='profile-tab'
              >
                <div className='product-info__form-box'>
                  <h3 className='product-info__form-box__title'>
                    Please tell us about the issue
                  </h3>
                  <form action='#' className='form-one'>
                    <div className='form-one__group'>
                      <div className='form-one__control form-one__control--full'>
                        <label htmlFor='words' className='form-one__label'>
                          What is the issue?
                        </label>
                        <div className='form-one__input-box'>
                          <textarea
                            name='massage'
                            id='words'
                            placeholder='Write your issue..'
                          ></textarea>
                        </div>
                      </div>
                      <div className='form-one__control form-one__control--full'>
                        <div className='product-info__form-box__btn'>
                          <button type='submit' className='commerce-btn'>
                            Submit Now 
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className='product-reviews ' id='product-reviews'>
        <div className='product-reviews__top'>
          <div className='container'>
            <div className='product-reviews__heading'>
              <h2 className='circle-rating__title'>Product Reviews</h2>
              {canReviewCurrentItem && (
                <button
                  type='button'
                  className='commerce-btn product-reviews__review-btn'
                  onClick={() => setShowReviewModal(true)}
                >
                  Review this product
                </button>
              )}
            </div>
            <div className='product-reviews__inner'>
              <div className='row'>
                <div className='col-lg-5'>
                  <div className='rating-card'>
                    <div className='circle-rating'>
                      <svg width='84' height='84'>
                        <circle
                          cx='42'
                          cy='42'
                          r='37'
                          stroke='#e6e9ee'
                          strokeWidth='6'
                          fill='none'
                        />
                        <circle
                          cx='42'
                          cy='42'
                          r='37'
                          stroke='#ffaa34'
                          strokeWidth='6'
                          fill='none'
                          strokeDasharray='190'
                          strokeDashoffset={circleOffset}
                          strokeLinecap='round'
                        />
                      </svg>
                      <div className='number'>{averageRatingText}</div>
                    </div>
                    <div className='circle-rating__content'>
                      <div className='circle-rating__start'>
                        {[...Array(5)].map((_, i) => (
                          <i
                            className={
                              i < Math.round(averageRating)
                                ? 'fas fa-star'
                                : 'far fa-star'
                            }
                            key={i}
                          ></i>
                        ))}
                      </div>
                      <p className='circle-rating__text'>
                        from {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='col-lg-7'>
                  <div className='rating-card__right'>
                    {[5, 4, 3, 2, 1].map((rating, index) => {
                      const widths = ratingPercentages;
                      const counts = ratingCounts;
                      return (
                        <div className='rating-row' key={rating}>
                          <div className='rating-label'>
                            <span>{rating}.0 </span>
                            <i className='fas fa-star'></i>
                          </div>
                          <div className='rating-bar-container'>
                            <div className='rating-bar'>
                              <span
                                style={{ width: `${widths[index]}%` }}
                              ></span>
                            </div>
                          </div>
                          <div className='rating-count'>{counts[index]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='product-reviews__bottom'>
          <div className='container'>
            <div className='product-reviews__inner-box'>
              {/* Filter Sidebar */}
              <div className='product-reviews__filter'>
                <aside className='sidebar__menu'>
                  <div className='sidebar__menu__header'>
                    <h3 className='sidebar__menu__title'>Reviews Filter</h3>
                  </div>
                  <ul className='sidebar__menu__area list-unstyled'>
                    {/* Rating Filter */}
                    <li className='sidebar__menu__area__item'>
                      <a href='#' className='sidebar__menu__title'>
                        Rating{" "}
                        <i className='icon-reshot-icon-arrow-chevron-right-WDGHUKQ634'></i>
                      </a>
                      <ul className='sidebar__menu__sub-menu list-unstyled'>
                        {[5, 4, 3, 2, 1].map((star, i) => (
                          <li className='checkbox' key={star}>
                            <input
                              type='checkbox'
                              name='review-rating-filter'
                              id={`rating${i === 0 ? "" : i}`}
                              checked={selectedReviewRatings.includes(star)}
                              onChange={() => toggleReviewRating(star)}
                            />
                            <label htmlFor={`rating${i === 0 ? "" : i}`}>
                              <span></span>
                              <i className='fas fa-star'></i>
                              {star}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </aside>
              </div>

              {/* Review List Section */}
              <div className='product-reviews__user'>
                <div className='review-header'>
                  <h2 className='review-title'>Review Lists</h2>
                  <div className='review-filters'>
                    {REVIEW_TABS.map((tab) => (
                      <button
                        type='button'
                        className={`filter-tab ${activeReviewTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveReviewTab(tab.key)}
                        key={tab.key}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='product-reviews__user__list'>
                  {filteredReviews.length ? (
                    filteredReviews.map((review) => {
                      const avatarSrc = review.user?.profileImage
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}/${review.user.profileImage}`
                        : user1;

                      return (
                        <div className='product-reviews__user__item' key={review.id}>
                          <div className='product-reviews__user__star'>
                            {[...Array(5)].map((_, i) => (
                              <i
                                className={
                                  i < review.rating ? 'fas fa-star' : 'far fa-star'
                                }
                                key={i}
                              ></i>
                            ))}
                          </div>
                          <p className='product-reviews__user__text'>
                            {review.comment}
                          </p>
                          <span className='product-reviews__user__date'>
                            {formatReviewDate(review.createdAt)}
                          </span>
                          {review.mediaUrl && (
                            <div className='product-reviews__media'>
                              {review.mediaType === 'VIDEO' ? (
                                <video src={review.mediaUrl} controls />
                              ) : (
                                <img src={review.mediaUrl} alt='Review media' />
                              )}
                            </div>
                          )}
                          <div className='product-reviews__user__avatar'>
                            <div className='product-reviews__user__info'>
                              <Image
                                src={avatarSrc}
                                width={50}
                                height={50}
                                alt='User Avatar'
                                unoptimized
                              />
                              <h5 className='product-reviews__user__name'>
                                {review.user?.name || 'Customer'}
                              </h5>
                            </div>
                            <div className='product-reviews__user__action'>
                              <button className='product-reviews__user__action__btn'>
                                <i className='fas fa-thumbs-up'></i> 0
                              </button>
                              <button className='product-reviews__user__action__btn'>
                                <i className='fas fa-thumbs-down'></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='product-reviews__user__item'>
                      <p className='product-reviews__user__text'>
                        {reviews.length
                          ? 'No reviews match the selected filters.'
                          : 'No reviews yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        centered
        className='add-to-cart__modal product-review-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleReviewSubmit}>
          <Modal.Body>
            <div className='product-info__form-box review-form-box'>
              <div className='form-one__group'>
                <div className='form-one__control form-one__control--full'>
                  <label className='form-one__label'>Your Rating</label>
                  <div className='review-form-stars' onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        type='button'
                        key={star}
                        className={`review-form-star-btn ${
                          star <= (hoverRating || reviewRating) ? 'active' : ''
                        }`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onFocus={() => setHoverRating(star)}
                        onBlur={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        aria-label={`${star} star`}
                      >
                        <i
                          className={
                            star <= (hoverRating || reviewRating) ? 'fas fa-star' : 'fas fa-star'
                          }
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>
                <div className='form-one__control form-one__control--full'>
                  <label htmlFor='review-media' className='form-one__label'>
                    Share Photo or Video
                  </label>
                  <div className='form-one__input-box review-media-input-box'>
                    <input
                      type='file'
                      id='review-media'
                      accept='image/*,video/mp4,video/webm,video/ogg'
                      onChange={handleReviewMediaChange}
                    />
                    <span>
                      {reviewMediaFile
                        ? reviewMediaFile.name
                        : 'Optional image or video. Video max 2MB.'}
                    </span>
                  </div>
                </div>
                <div className='form-one__control form-one__control--full'>
                  <label htmlFor='review-comment' className='form-one__label'>
                    Your Review
                  </label>
                  <div className='form-one__input-box'>
                    <textarea
                      id='review-comment'
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      placeholder='Write your review..'
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type='button'
              className='commerce-btn review-modal-cancel'
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </button>
            <button type='submit' className='commerce-btn text-white' disabled={reviewPending}>
              {reviewPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
