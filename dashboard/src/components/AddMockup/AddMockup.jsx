"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { assets } from "@/assets/assets"; // use same upload placeholder as hotel form
import { createMockup } from "@/app/actions/mockup/mockup.actions";

const FIT_TYPES = ["MEN", "WOMEN", "YOUTH"];

export default function AddMockup() {
  const router = useRouter();

  const [mockupName, setMockupName] = useState("");
  const [variants, setVariants] = useState([
    { color: "", fitType: "MEN", frontImg: null, backImg: null },
  ]);
  const [loading, setLoading] = useState(false);

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleFileChange = (index, field, file) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: file || null };
      return next;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { color: "", fitType: "MEN", frontImg: null, backImg: null },
    ]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!mockupName.trim()) {
      toast.error("Mockup name is required");
      return;
    }

    if (!variants.length) {
      toast.error("At least one variant is required");
      return;
    }

    // simple validation: color & frontImg
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.color.trim()) {
        toast.error(`Variant ${i + 1}: color is required`);
        return;
      }
      if (!v.frontImg) {
        toast.error(`Variant ${i + 1}: front image is required`);
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", mockupName.trim());

      variants.forEach((v, index) => {
        formData.append(`variants[${index}][color]`, v.color.trim());
        formData.append(`variants[${index}][fitType]`, v.fitType);

        if (v.frontImg instanceof File) {
          formData.append(
            `variants[${index}][frontImg]`,
            v.frontImg,
            v.frontImg.name
          );
        }

        if (v.backImg instanceof File) {
          formData.append(
            `variants[${index}][backImg]`,
            v.backImg,
            v.backImg.name
          );
        }
      });

      const res = await createMockup(formData);

      if (res?.success === false) {
        toast.error(res.message || "Failed to create mockup");
        setLoading(false);
        return;
      }

      toast.success("Mockup created successfully!");
      await router.push("/dashboard/mockups");
      router.refresh();
    } catch (err) {
      console.error("createMockup error:", err);
      toast.error(err?.message || "Error creating mockup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='text-slate-500 mb-28'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>
        Add New Mockup
      </h1>

      {/* Mockup Name */}
      <label className='flex flex-col gap-2 my-6'>
        Mockup Name
        <input
          type='text'
          name='name'
          value={mockupName}
          onChange={(e) => setMockupName(e.target.value)}
          placeholder='Enter mockup name (e.g. Oversized Tee)'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
          required
        />
      </label>

      {/* Variants */}
      <div className='mt-6 space-y-6'>
        <h2 className='text-lg font-semibold text-slate-700'>
          Mockup Variants
        </h2>

        {variants.map((variant, index) => (
          <div
            key={index}
            className='border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4'
          >
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-slate-800'>
                Variant {index + 1}
              </h3>
              {variants.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeVariant(index)}
                  className='text-red-600 text-sm hover:underline'
                >
                  Remove
                </button>
              )}
            </div>

            {/* Color & FitType */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <label className='flex flex-col gap-1'>
                Color (hex or name)
                <input
                  type='text'
                  name={`variants[${index}][color]`}
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                  placeholder="#000000 or 'black'"
                  className='w-full p-2 px-3 border border-slate-200 rounded outline-none'
                  required
                />
              </label>

              <label className='flex flex-col gap-1'>
                Fit Type
                <select
                  name={`variants[${index}][fitType]`}
                  value={variant.fitType}
                  onChange={(e) =>
                    handleVariantChange(index, "fitType", e.target.value)
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
                <span className='text-sm font-medium'>Front Image *</span>
                <label className='cursor-pointer inline-block'>
                  <div className='w-full h-40 border border-slate-200 rounded flex items-center justify-center overflow-hidden bg-white'>
                    {variant.frontImg ? (
                      <Image
                        src={URL.createObjectURL(variant.frontImg)}
                        alt='Front preview'
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
                      handleFileChange(
                        index,
                        "frontImg",
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
                    {variant.backImg ? (
                      <Image
                        src={URL.createObjectURL(variant.backImg)}
                        alt='Back preview'
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
                      handleFileChange(
                        index,
                        "backImg",
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          type='button'
          onClick={addVariant}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700'
        >
          + Add Variant
        </button>
      </div>

      <button
        disabled={loading}
        type='submit'
        className='mt-8 cursor-pointer !text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000] disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {loading ? "Creating..." : "Create Mockup"}
      </button>
    </form>
  );
}
