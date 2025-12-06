"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

/**
 * HotelUpdate.jsx
 * - Loads hotel by id (from route params)
 * - Prefills form
 * - Supports:
 *    - keeping existing images (URLs)
 *    - removing existing images
 *    - uploading new images (Files)
 *    - reordering images (existing + new)
 * - Submits multipart/form-data:
 *    - existingImages: JSON string array of URLs to keep in the chosen order
 *    - images: appended new File objects (in the order they should be placed AFTER existingImages)
 *    - other fields as simple form fields
 *
 * Make sure to set NEXT_PUBLIC_API_BASE_URL in .env (e.g. NEXT_PUBLIC_API_BASE_URL=http://localhost:5000)
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function HotelUpdate() {
  const params = useParams();
  const router = useRouter();
  const id = params?.slug; // assuming route like /dashboard/hotels/[id]/edit
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // images array of up to 5 slots; each slot is:
  // null | { type: 'url', url: string } | { type: 'file', file: File, preview: string }
  const [images, setImages] = useState([null, null, null, null, null]);

  const [hotelInfo, setHotelInfo] = useState({
    name: "",
    shortDescription: "",
    phone: "",
    reservationPhone: "",
    reservationEmail: "",
    domain: "",
    email: "",
    address: "",
    location: "",
    startingPrice: 0,
    hasWifi: false,
    hasAC: false,
    includesBreakfast: false,
    hasSwimmingPool: false,
    includesWelcomeDrinks: false,
    accessibility: false,
    roomService: false,
    elevator: false,
  });

  useEffect(() => {
    if (!id) return;
    // fetch hotel
    const abort = new AbortController();
    async function load() {
      try {
        setFetching(true);
        const res = await fetch(
          `${API_BASE.replace(/\/+$/, "")}/api/v1/hotels/${id}`,
          {
            signal: abort.signal,
          }
        );
        if (!res.ok) throw new Error(`Failed to load hotel (${res.status})`);
        const data = await res.json();

        // map server fields to state (adjust if your shape differs)
        setHotelInfo({
          name: data.name ?? "",
          shortDescription: data.shortDescription ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          reservationPhone: data.reservationPhone ?? "",
          reservationEmail: data.reservationEmail ?? "",
          domain: data.domain ?? "",
          address: data.address ?? "",
          location: data.location ?? "",
          startingPrice: data.startingPrice ?? 0,
          hasWifi: !!data.hasWifi,
          hasAC: !!data.hasAC,
          includesBreakfast: !!data.includesBreakfast,
          hasSwimmingPool: !!data.hasSwimmingPool,
          includesWelcomeDrinks: !!data.includesWelcomeDrinks,
          accessibility: !!data.accessibility,
          roomService: !!data.roomService,
          elevator: !!data.elevator,
        });

        // fill images array from data.images (if fewer than 5, rest stay null)
        const imgs = Array.from({ length: 5 }, (_, i) => null);
        if (Array.isArray(data.images)) {
          for (let i = 0; i < Math.min(5, data.images.length); i++) {
            imgs[i] = { type: "url", url: data.images[i] };
          }
        }
        setImages(imgs);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          toast.error(err.message || "Failed to load hotel");
        }
      } finally {
        setFetching(false);
      }
    }
    load();
    return () => abort.abort();
  }, [id]);

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelInfo((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setImageAt = (index, item) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = item;
      return copy;
    });
  };

  // update onFileChange so we preserve originalId when replacing a URL slot
  const onFileChange = (index, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImages((prev) => {
      const copy = [...prev];
      const prevSlot = copy[index];
      const originalId =
        prevSlot && prevSlot.type === "url" ? prevSlot.url.id : undefined;
      // store originalId so backend knows which imageId is being replaced
      copy[index] = { type: "file", file, preview, originalId };
      return copy;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const copy = [...prev];
      const cur = copy[index];
      if (cur && cur.type === "file") {
        // revoke preview URL
        try {
          URL.revokeObjectURL(cur.preview);
        } catch {}
      }
      copy[index] = null;
      return copy;
    });
  };

  const moveImage = (index, direction) => {
    // direction -1 up, +1 down
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const tmp = copy[newIndex];
      copy[newIndex] = copy[index];
      copy[index] = tmp;
      return copy;
    });
  };

  //   const onSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!id) return toast.error("Missing hotel id");
  //     setLoading(true);

  //     try {
  //       // Build lists: existing image URLs (kept) in order; new files in order
  //       const existingUrls = images
  //         .filter((it) => it && it.type === "url")
  //         .map((it) => it.url);

  //       const newFiles = images
  //         .filter((it) => it && it.type === "file")
  //         .map((it) => it.file);

  //       const formData = new FormData();
  //       // append hotel fields
  //       Object.entries(hotelInfo).forEach(([k, v]) => {
  //         formData.append(
  //           k,
  //           typeof v === "boolean" ? String(v) : String(v ?? "")
  //         );
  //       });

  //       // append existingImages JSON (so backend knows which URLs to keep & order)
  //       formData.append("existingImages", JSON.stringify(existingUrls));

  //       // append new files (order preserved)
  //       newFiles.forEach((f) => formData.append("images", f, f.name));

  //       // PATCH/PUT to backend - I use PATCH here
  //       const endpoint = `${API_BASE.replace(/\/+$/, "")}/api/v1/hotels/${id}`;
  //       const res = await fetch(endpoint, {
  //         method: "PUT",
  //         body: formData,
  //       });

  //       if (!res.ok) {
  //         const txt = await res.text().catch(() => "");
  //         throw new Error(txt || `Failed to update hotel (status ${res.status})`);
  //       }

  //       toast.success("Hotel updated");
  //       router.push("/dashboard/hotels");
  //     } catch (err) {
  //       console.error(err);
  //       toast.error(err.message || "Failed to update hotel");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // onSubmit - build imageSlots and append files
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id) return toast.error("Missing hotel id");
    setLoading(true);

    try {
      // We'll append new files in the order we encounter file slots and assign fileIndex sequentially
      const formData = new FormData();

      // append hotel fields
      Object.entries(hotelInfo).forEach(([k, v]) => {
        formData.append(
          k,
          typeof v === "boolean" ? String(v) : String(v ?? "")
        );
      });

      // build imageSlots and collect files
      const filesToUpload = [];
      const imageSlots = images.map((slot) => {
        if (!slot) return { type: "empty" };

        if (slot.type === "url") {
          // slot.url is the image object returned from server (should include id + path)
          return { type: "keep", id: slot.url.id };
        }

        if (slot.type === "file") {
          // if originalId exists => replace that imageId, else new image
          const fileIndex = filesToUpload.length; // position in files array
          filesToUpload.push(slot.file);

          if (slot.originalId) {
            return { type: "replace", id: slot.originalId, fileIndex };
          } else {
            return { type: "new", fileIndex };
          }
        }

        return { type: "empty" };
      });

      // append the imageSlots JSON
      formData.append("imageSlots", JSON.stringify(imageSlots));

      // append files in same order as fileIndex assignment
      filesToUpload.forEach((f) => formData.append("images", f, f.name));

      // PUT to backend
      const endpoint = `${API_BASE.replace(/\/+$/, "")}/api/v1/hotels/${id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Failed to update hotel (status ${res.status})`);
      }

      toast.success("Hotel updated");
      // navigate to listing AND refresh server data so getAllHotels() runs again
      await router.push("/dashboard/hotels"); // wait for navigation to finish
      router.refresh(); // re-fetch server components / data for the page
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update hotel");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className='p-6'>Loading hotel…</div>;
  }

  function buildImageUrl(path) {
    if (!path) return null;
    const normalized = String(path).replace(/^\/+/, "");
    return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
  }

  return (
    <form onSubmit={onSubmit} className='text-slate-500 mb-28 mx-auto'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>
        Update Hotel
      </h1>

      <p className='mt-7'>Hotel Images (Reorder using ▲ / ▼)</p>

      <div className='flex gap-3 mt-4 items-start'>
        {images.map((slot, idx) => (
          <div key={idx} className='flex flex-col items-center gap-2'>
            <label htmlFor={`img-${idx}`} className='cursor-pointer'>
              <div className='h-28 w-52 border border-slate-200 rounded overflow-hidden bg-gray-50'>
                {slot ? (
                  slot.type === "url" ? (
                    // use remote image URL
                    // next/image requires known domains in next.config.js; fallback to <img> if domain not allowed
                    // We'll use <img> for remote urls to avoid config friction.
                    <img
                      src={`${buildImageUrl(slot.url.path)}`}
                      alt={`hotel image ${idx + 1}`}
                      className='object-cover w-full h-full'
                    />
                  ) : (
                    <img
                      src={slot.preview}
                      alt={`preview ${idx + 1}`}
                      className='object-cover w-full h-full'
                    />
                  )
                ) : (
                  <img
                    src={assets.upload_area}
                    alt='upload placeholder'
                    className='object-cover w-full h-full'
                  />
                )}
              </div>
            </label>

            <input
              type='file'
              accept='image/*'
              id={`img-${idx}`}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileChange(idx, f);
              }}
              hidden
            />

            <div className='flex gap-1'>
              <button
                type='button'
                onClick={() => moveImage(idx, -1)}
                className='p-1 border rounded text-sm'
                aria-label={`Move image ${idx + 1} up`}
              >
                <ArrowLeft />
              </button>
              <button
                type='button'
                onClick={() => moveImage(idx, +1)}
                className='p-1 border rounded text-sm'
                aria-label={`Move image ${idx + 1} down`}
              >
                <ArrowRight />
              </button>
              <button
                type='button'
                onClick={() => removeImage(idx)}
                className='p-1 border rounded text-sm text-red-600'
                aria-label={`Remove image ${idx + 1}`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <label className='flex flex-col gap-2 my-6'>
        Name
        <input
          type='text'
          name='name'
          value={hotelInfo.name}
          onChange={onChangeHandler}
          placeholder='Enter hotel name'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
          required
        />
      </label>

      <label className='flex flex-col gap-2 my-6'>
        Short Description
        <textarea
          name='shortDescription'
          value={hotelInfo.shortDescription}
          onChange={onChangeHandler}
          placeholder='Enter short description'
          rows={4}
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none resize-none'
        />
      </label>

      <label className='flex flex-col gap-2 my-6'>
        Phone
        <input
          type='text'
          name='phone'
          value={hotelInfo.phone}
          onChange={onChangeHandler}
          placeholder='Enter phone number'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>
      <label className='flex flex-col gap-2 my-6'>
        Phone
        <input
          type='text'
          name='reservationPhone'
          value={hotelInfo.reservationPhone}
          onChange={onChangeHandler}
          placeholder='Enter phone number'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>

      <label className='flex flex-col gap-2 my-6'>
        Email
        <input
          type='email'
          name='email'
          value={hotelInfo.email}
          onChange={onChangeHandler}
          placeholder='Enter email address'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>
      <label className='flex flex-col gap-2 my-6'>
        Email
        <input
          type='email'
          name='reservationEmail'
          value={hotelInfo.reservationEmail}
          onChange={onChangeHandler}
          placeholder='Enter email address'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>
      <label className='flex flex-col gap-2 my-6'>
        Domain
        <input
          type='text'
          name='domain'
          value={hotelInfo.domain}
          onChange={onChangeHandler}
          placeholder='Enter domain'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>

      <label className='flex flex-col gap-2 my-6'>
        Address
        <input
          type='text'
          name='address'
          value={hotelInfo.address}
          onChange={onChangeHandler}
          placeholder='Enter hotel address'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>

      <label className='flex flex-col gap-2 my-6'>
        Location
        <input
          type='text'
          name='location'
          value={hotelInfo.location}
          onChange={onChangeHandler}
          placeholder='Enter hotel location'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>

      <label className='flex flex-col gap-2 my-6'>
        Starting Price (BDT)
        <input
          type='number'
          name='startingPrice'
          value={hotelInfo.startingPrice}
          onChange={onChangeHandler}
          placeholder='0'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
        />
      </label>

      <div className='grid grid-cols-2 gap-3 mt-4'>
        {[
          "hasWifi",
          "hasAC",
          "includesBreakfast",
          "hasSwimmingPool",
          "includesWelcomeDrinks",
          "accessibility",
          "roomService",
          "elevator",
        ].map((feature) => (
          <label key={feature} className='flex items-center gap-2'>
            <input
              type='checkbox'
              name={feature}
              checked={hotelInfo[feature]}
              onChange={onChangeHandler}
            />
            {feature.replace(/([A-Z])/g, " $1")}
          </label>
        ))}
      </div>

      <div className='mt-6'>
        <button
          disabled={loading}
          type='submit'
          className='mt-5 cursor-pointer !text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
        >
          {loading ? "Updating..." : "Update Hotel"}
        </button>
      </div>
    </form>
  );
}
