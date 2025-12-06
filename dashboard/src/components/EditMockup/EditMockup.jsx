// app/dashboard/mockups/edit/[id]/edit-mockup-client.jsx
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
} from "@/app/actions/mockup/mockup.actions";
import { assets } from "@/assets/assets";

const FIT_TYPES = ["MEN", "WOMEN", "YOUTH"];

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

  /* ========== helpers ========== */

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

  /* ========== update mockup name ========== */

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Mockup name is required");
      return;
    }

    setSavingName(true);
    try {
      const fd = new FormData();
      fd.append("id", mockup.id);
      fd.append("name", name.trim());

      const res = await updateMockup(fd);

      if (!res || res.success === false) {
        toast.error(res?.message || "Failed to update mockup");
        return;
      }

      toast.success("Mockup updated");
      router.refresh();
    } catch (err) {
      console.error("updateMockup error:", err);
      toast.error(err?.message || "Failed to update mockup");
    } finally {
      setSavingName(false);
    }
  };

  /* ========== update single variant ========== */

  const handleSaveVariant = async (index) => {
    const v = variants[index];
    if (!v.color.trim()) {
      toast.error("Color is required");
      return;
    }

    try {
      setVariants((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], saving: true };
        return next;
      });

      const fd = new FormData();
      fd.append("id", v.id);
      fd.append("color", v.color.trim());
      fd.append("fitType", v.fitType);

      if (v.frontFile instanceof File) {
        fd.append("frontImg", v.frontFile, v.frontFile.name);
      }
      if (v.backFile instanceof File) {
        fd.append("backImg", v.backFile, v.backFile.name);
      }

      const res = await updateVariant(fd);

      if (!res || res.success === false) {
        toast.error(res?.message || "Failed to update variant");
        return;
      }

      // if your updateVariant returns { id, color, fitType, frontImg, backImg }
      const updated = res.variant || res;

      setVariants((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          color: updated.color ?? v.color,
          fitType: updated.fitType ?? v.fitType,
          frontImgUrl: updated.frontImg ?? v.frontImgUrl,
          backImgUrl: updated.backImg ?? v.backImgUrl,
          frontFile: null,
          backFile: null,
          saving: false,
        };
        return next;
      });

      toast.success("Variant updated");
      router.refresh();
    } catch (err) {
      console.error("updateVariant error:", err);
      toast.error(err?.message || "Failed to update variant");
      setVariants((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], saving: false };
        return next;
      });
    }
  };

  /* ========== delete variant ========== */

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

  /* ========== render ========== */

  return (
    <div className='text-slate-500 mb-28 mx-auto max-w-4xl'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>
        Edit Mockup
      </h1>

      {/* Mockup name form */}
      <form onSubmit={handleSaveName} className='mb-8'>
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
          type='submit'
          disabled={savingName}
          className='cursor-pointer !text-[#fff] transition rounded-[10px] text-[15px] bg-[#0B7956] py-[8px] px-[18px] hover:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {savingName ? "Saving..." : "Save Mockup"}
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
          return (
            <div
              key={v.id}
              className='border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4'
            >
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-slate-800'>
                  Variant {index + 1}
                </h3>
                {/* <button
                  type='button'
                  onClick={() => handleDeleteVariant(v.id)}
                  className='text-red-600 text-sm hover:underline disabled:opacity-60'
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button> */}
                <Popconfirm
                  title='Delete this variant?'
                  description='This action cannot be undone.'
                  okText='Yes'
                  cancelText='No'
                  onConfirm={() => handleDeleteVariant(v.id)}
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
                      {v.frontImgUrl ? (
                        <Image
                          src={v.frontImgUrl}
                          alt='Front'
                          width={300}
                          height={160}
                          className='object-cover w-full h-full'
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
                      {v.backImgUrl ? (
                        <Image
                          src={v.backImgUrl}
                          alt='Back'
                          width={300}
                          height={160}
                          className='object-cover w-full h-full'
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
                className='mt-2 cursor-pointer !text-[#fff] transition rounded-[8px] text-[14px] bg-[#0B7956] py-[7px] px-[16px] hover:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {v.saving ? "Saving..." : "Save Variant"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
