"use client";

import { Modal, Button } from "react-bootstrap";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { getProductImage, isLightColor } from "@/lib/helper";

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

/* ---------------- HELPERS ---------------- */

const hexToName = (hex) => {
  const map = {
    "#000": "Black",
    "#000000": "Black",
    "#fff": "White",
    "#ffffff": "White",
    "#ff0000": "Red",
    "#00ff00": "Green",
    "#0000ff": "Blue",
  };
  return map[hex?.toLowerCase?.()] ?? hex;
};

const groupByFit = (variants = []) =>
  variants.reduce(
    (acc, v) => {
      const k = v.fitType || "MEN";
      (acc[k] ||= []).push(v);
      return acc;
    },
    { MEN: [], WOMEN: [], YOUTH: [] }
  );

const uniqueColors = (variants = []) => [
  ...new Set(variants.map((v) => v.color).filter(Boolean)),
];

const toImg = (path) => {
  if (!path) return `${ASSET_BASE}/uploads/placeholder.png`;
  return `${ASSET_BASE}/${path.replace(/^\/+/, "")}`;
};

/* ---------------- COMPONENT ---------------- */

export default function AddToCartModal({ show, onHide, product }) {
  const grouped = useMemo(() => groupByFit(product?.variants || []), [product]);

  const availableFits = useMemo(
    () => Object.keys(grouped).filter((f) => grouped[f].length),
    [grouped]
  );

  /* -------- State (NO DEFAULTS) -------- */

  const [fit, setFit] = useState(null);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  /* -------- Auto-select FIT if only one -------- */

  useEffect(() => {
    if (availableFits.length === 1) {
      setFit(availableFits[0]);
    } else {
      setFit(null);
    }
  }, [availableFits]);

  /* -------- Colors for selected fit -------- */

  const fitColors = useMemo(() => {
    if (!fit) return [];
    return uniqueColors(grouped[fit]);
  }, [grouped, fit]);

  /* -------- Auto-select COLOR if only one -------- */

  useEffect(() => {
    if (fitColors.length === 1) {
      setColor(fitColors[0]);
    } else {
      setColor(null);
    }
  }, [fitColors]);

  /* -------- Current Variant -------- */

  const currentVariant =
    grouped[fit]?.find((v) => v.color === color) || grouped[fit]?.[0] || null;

  const rawImg = getProductImage(product);
  const rel = (rawImg || "").replace(/^\/+/, "");
  const imgSrc = rel
    ? `${ASSET_BASE}/${rel}`
    : `${ASSET_BASE}/uploads/placeholder.png`;

  /* -------- Add to Cart -------- */

  const handleAddToCart = () => {
    if (!fit) return toast.error("Please select fit type");
    if (!color) return toast.error("Please select color");
    if (!size) return toast.error("Please select size");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
      id: product.id,
      title: product.title,
      price: product.price,
      fit,
      color,
      size,
      quantity: qty,
      image: currentVariant?.frontImg || currentVariant?.backImg || "",
    };

    const index = cart.findIndex(
      (i) =>
        i.id === item.id &&
        i.fit === item.fit &&
        i.color === item.color &&
        i.size === item.size
    );

    if (index > -1) cart[index].quantity += qty;
    else cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));

    // notify header (and others) that cart changed
    window.dispatchEvent(new Event("cart-updated"));

    toast.success("Added to cart");
    onHide();
  };

  const resetState = () => {
    setFit(null);
    setColor(null);
    setSize(null);
    setQty(1);
  };

  /* ---------------- JSX ---------------- */

  return (
    <Modal show={show} onHide={onHide} centered className='add-to-cart__modal'>
      <Modal.Header closeButton>
        <Modal.Title>Add to Cart</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className='d-flex gap-3'>
          <Image
            src={imgSrc}
            width={120}
            height={120}
            alt={product.title || "Product image"}
            className='img-fluid'
            unoptimized
          />

          <div>
            <h6>{product?.title}</h6>
            <p className='mb-2'>৳ {product?.price}</p>

            {/* -------- FIT -------- */}
            <div className='mb-2'>
              <strong>Fit:</strong>
              <div className='d-flex gap-2 mt-1'>
                {availableFits.map((f) => (
                  <button
                    key={f}
                    className={`btn btn-sm ms-1 ${
                      fit === f ? "btn-base" : "btn-outline-base"
                    }`}
                    onClick={() => setFit(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* -------- COLOR -------- */}
            <div className='mb-2'>
              <strong>Color:</strong>
              <div className='d-flex gap-2 mt-1'>
                {fitColors.length === 0 && (
                  <span
                    className='color-radio__swatch'
                    style={{ backgroundColor: "black" }}
                  >
                    <span className='color-radio__tick'>✓</span>
                  </span>
                )}
                {fitColors.map((c) => (
                  <label key={c} className='color-radio' title={hexToName(c)}>
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

            {/* -------- SIZE -------- */}
            <div className='mb-2'>
              <strong>Size:</strong>
              <div className='d-flex gap-2 mt-1'>
                {["S", "M", "L", "XL", "XXL"].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ms-1 ${
                      size === s ? "btn-base" : "btn-outline-base"
                    }`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* -------- QTY -------- */}
            <div className='mb-2'>
              <strong>Qty:</strong>
              <div className='d-flex align-items-center gap-2 mt-1'>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className='btn btn-sm btn-base'
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className='btn btn-sm btn-base'
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={() => {
            resetState();
            onHide();
          }}
        >
          Cancel
        </Button>
        <Button variant='warning' onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
