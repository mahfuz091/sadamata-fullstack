"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Popconfirm } from "antd";

import {
  updateMockup,
  updateVariant,
  deleteVariant,
  addVariant,
  createVariant,
} from "@/app/actions/mockup/mockup.actions";
import { assets } from "@/assets/assets";

const FIT_TYPES = ["MEN", "WOMEN", "YOUTH"];

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

// function getImageUrl(path) {
//   if (!path) return undefined;
//   if (path.startsWith("http")) return path;
//   const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
//   return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
// }
function getImageUrl(path) {
  if (!path) return undefined;

  // ✅ keep blob/data urls as-is (for previews)
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;

  // existing remote
  if (path.startsWith("http")) return path;

  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
}

export default function EditMockup({ mockup }) {
  const router = useRouter();

  const [name, setName] = useState(mockup?.name || "");
  const [savingName, setSavingName] = useState(false);

  const [variants, setVariants] = useState(
    (mockup?.variants || []).map((v) => ({
      id: v.id,
      color: v.color,
      fitType: v.fitType,
      frontImgUrl: v.frontImg || null,
      backImgUrl: v.backImg || null,
      frontFile: null,
      backFile: null,
      saving: false,
    }))
  );

  const [deletingIds, setDeletingIds] = useState([]);

  // Add a new empty variant to the state
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(), // ✅ local key
        isNew: true, // ✅ mark as new
        color: "",
        fitType: "MEN",
        frontImgUrl: null,
        backImgUrl: null,
        frontFile: null,
        backFile: null,
        saving: false,
      },
    ]);
  };

  // Handle variant changes (color, fitType, image files)
  const handleVariantFieldChange = (index, field, value) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleVariantFileChange = (index, field, file) => {
    setVariants((prev) => {
      const next = [...prev];
      const v = { ...next[index] };

      if (field === "frontFile") {
        v.frontFile = file || null;
        if (file) v.frontImgUrl = URL.createObjectURL(file);
      }

      if (field === "backFile") {
        v.backFile = file || null;
        if (file) v.backImgUrl = URL.createObjectURL(file);
      }

      next[index] = v;
      return next;
    });
  };

  // Save a variant (send it to the backend)
  const handleSaveVariant = async (index) => {
    const v = variants[index];

    if (!v.color.trim()) return toast.error("Color is required");

    // ✅ new variant হলে front image required
    if (v.isNew && !(v.frontFile instanceof File)) {
      return toast.error("Front image is required for new variant");
    }

    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], saving: true };
      return next;
    });

    try {
      const fd = new FormData();
      fd.append("color", v.color.trim());
      fd.append("fitType", v.fitType);

      if (v.frontFile instanceof File)
        fd.append("frontImg", v.frontFile, v.frontFile.name);
      if (v.backFile instanceof File)
        fd.append("backImg", v.backFile, v.backFile.name);

      let res;

      if (v.isNew) {
        // ✅ CREATE (add new variant under this mockup)
        fd.append("mockupId", mockup.id);
        res = await createVariant(fd);
      } else {
        // ✅ UPDATE (existing)
        fd.append("id", v.id);
        res = await updateVariant(fd);
      }

      if (!res?.success) {
        toast.error(res?.message || "Failed");
        return;
      }

      const saved = res.variant;

      setVariants((prev) => {
        const next = [...prev];
        next[index] = {
          id: saved.id,
          isNew: false,
          color: saved.color,
          fitType: saved.fitType,
          frontImgUrl: saved.frontImg,
          backImgUrl: saved.backImg,
          frontFile: null,
          backFile: null,
          saving: false,
        };
        return next;
      });

      toast.success(v.isNew ? "Variant added" : "Variant updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error");
    } finally {
      setVariants((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], saving: false };
        return next;
      });
    }
  };

  // Delete a variant
  const handleDeleteVariant = async (variantId) => {
    setDeletingIds((prev) => [...prev, variantId]);
    try {
      const res = await deleteVariant(variantId);

      if (!res || res.success === false) {
        toast.error(res?.message || "Failed to delete variant");
        return;
      }

      toast.success("Variant deleted");
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      router.refresh();
    } catch (err) {
      console.error("deleteVariant error:", err);
      toast.error("Failed to delete variant");
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== variantId));
    }
  };

  const handleDeleteVariantClick = async (v) => {
    if (v.isNew) {
      setVariants((prev) =>
        prev.filter((x) => (x.id ?? x.tempId) !== (v.id ?? v.tempId))
      );
      return;
    }
    await handleDeleteVariant(v.id);
  };

  return (
    <div className='text-slate-500 mb-28 mx-auto max-w-4xl'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>
        Edit Mockup
      </h1>

      {/* Mockup name form */}
      <form className='mb-8'>
        <label className='flex flex-col gap-2 my-4'>
          Mockup Name
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
            required
          />
        </label>

        <button
          type='button'
          disabled={savingName}
          className='cursor-pointer !text-[#fff] transition rounded-[10px] text-[15px] bg-[#f37927] py-[8px] px-[18px] hover:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed'
        >
          Save Mockup
        </button>
      </form>

      {/* Variants */}
      <h2 className='text-lg font-semibold text-slate-700 mb-4'>Variants</h2>

      <div className='space-y-6'>
        {variants.length === 0 && (
          <p className='text-sm text-slate-500'>No variants for this mockup.</p>
        )}

        {variants.map((v, index) => {
          const deleting = deletingIds.includes(v.id);
          const frontSrc = v.frontImgUrl ? getImageUrl(v.frontImgUrl) : null;
          const backSrc = v.backImgUrl ? getImageUrl(v.backImgUrl) : null;
          return (
            <div
              key={v.id ?? v.tempId}
              className='border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4'
            >
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-slate-800'>
                  Variant {index + 1}
                </h3>
                <Popconfirm
                  title='Delete this variant?'
                  description='This action cannot be undone.'
                  okText='Yes'
                  cancelText='No'
                  onConfirm={() => handleDeleteVariantClick(v)}
                  disabled={deleting}
                >
                  <button
                    type='button'
                    disabled={deleting}
                    className='text-red-600 text-sm hover:underline disabled:opacity-60'
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </Popconfirm>
              </div>

              {/* Color & fit type */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <label className='flex flex-col gap-1'>
                  Color (hex or name)
                  <input
                    type='text'
                    value={v.color}
                    onChange={(e) =>
                      handleVariantFieldChange(index, "color", e.target.value)
                    }
                    className='w-full p-2 px-3 border border-slate-200 rounded outline-none'
                    required
                  />
                </label>

                <label className='flex flex-col gap-1'>
                  Fit Type
                  <select
                    value={v.fitType}
                    onChange={(e) =>
                      handleVariantFieldChange(index, "fitType", e.target.value)
                    }
                    className='w-full p-2 px-3 border border-slate-200 rounded outline-none'
                  >
                    {FIT_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft.charAt(0) + ft.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Images */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Front */}
                <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium'>Front Image</span>
                  <label className='cursor-pointer inline-block'>
                    <div className='w-full h-40 border border-slate-200 rounded flex items-center justify-center overflow-hidden bg-white'>
                      {frontSrc ? (
                        <Image
                          src={frontSrc}
                          // src={URL.createObjectURL(frontSrc)}
                          alt='Front'
                          width={160}
                          height={160}
                          className='object-cover '
                        />
                      ) : (
                        <Image
                          src={assets.upload_area}
                          alt='Upload front'
                          width={300}
                          height={160}
                          className='object-contain opacity-80'
                        />
                      )}
                    </div>
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) =>
                        handleVariantFileChange(
                          index,
                          "frontFile",
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </label>
                </div>

                {/* Back */}
                <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium'>
                    Back Image (optional)
                  </span>
                  <label className='cursor-pointer inline-block'>
                    <div className='w-full h-40 border border-slate-200 rounded flex items-center justify-center overflow-hidden bg-white'>
                      {backSrc ? (
                        <Image
                          src={backSrc}
                          alt='Back'
                          width={160}
                          height={160}
                          className='object-cover '
                        />
                      ) : (
                        <Image
                          src={assets.upload_area}
                          alt='Upload back'
                          width={300}
                          height={160}
                          className='object-contain opacity-80'
                        />
                      )}
                    </div>
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) =>
                        handleVariantFileChange(
                          index,
                          "backFile",
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <button
                type='button'
                onClick={() => handleSaveVariant(index)}
                disabled={v.saving}
                className='mt-2 cursor-pointer !text-[#fff] transition rounded-[8px] text-[14px] bg-[#f37927] py-[7px] px-[16px] hover:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {v.saving ? "Saving..." : "Save Variant"}
              </button>
            </div>
          );
        })}
      </div>

      <div className='flex justify-end mt-4'>
        {/* Add Variant button */}
        <button
          type='button'
          onClick={addVariant}
          className='px-4 py-2 bg-[#f37927] text-white! rounded-lg text-sm hover:bg-[#000] transition cursor-pointer!'
        >
          + Add Variant
        </button>
      </div>
    </div>
  );
}
