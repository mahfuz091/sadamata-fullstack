// app/dashboard/corporate-client-feedback/add-client-feedback.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { assets } from "@/assets/assets"; // if you have a default upload placeholder like in AddRoom
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * AddClientFeedback
 *
 * - Follows the style & patterns used in your AddRoom component.
 * - POSTs multipart/form-data to /api/v1/corporate-client-feedback
 * - On success: navigates to /dashboard/corporate-client-feedback and refreshes.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AddClientFeedback() {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    clientName: "",
    companyName: "",
    feedback: "",
  });

  const [loading, setLoading] = useState(false);

  function previewSrc(fileOrPath) {
    if (!fileOrPath)
      return assets?.upload_area ?? "/images/upload-placeholder.png";
    if (typeof fileOrPath === "string") return fileOrPath;
    try {
      return URL.createObjectURL(fileOrPath);
    } catch {
      return assets?.upload_area ?? "/images/upload-placeholder.png";
    }
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onFileChange = (file) => {
    if (!file) return;
    setLogoFile(file);
    try {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } catch {
      setPreview(null);
    }
  };

  const removeLogo = () => {
    if (preview) {
      try {
        URL.revokeObjectURL(preview);
      } catch {}
    }
    setLogoFile(null);
    setPreview(null);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.clientName?.trim())
        throw new Error("Please enter client/company name");
      if (!form.feedback?.trim())
        throw new Error("Please enter feedback/testimonial");

      const fd = new FormData();
      fd.append("clientName", form.clientName.trim());
      fd.append("companyName", form.clientName.trim());
      fd.append("feedback", form.feedback.trim());
      if (logoFile instanceof File) fd.append("logo", logoFile, logoFile.name);

      const res = await fetch(
        `${API_BASE.replace(/\/+$/, "")}/api/v1/client-feedback`,
        {
          method: "POST",
          body: fd,
        }
      );
      console.log(res, "res");

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          txt || `Failed to create feedback (status ${res.status})`
        );
      }

      toast.success("Client feedback created");
      await router.push("/dashboard/client-feedback");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to create feedback");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className='text-slate-500 mb-28 mx-auto'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>
        Add Client Feedback
      </h1>

      <label className='flex flex-col gap-2 my-4'>
        Client name
        <input
          type='text'
          name='clientName'
          value={form.clientName}
          onChange={onChangeHandler}
          placeholder='ACME Ltd'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
          required
        />
      </label>
      <label className='flex flex-col gap-2 my-4'>
        Company name
        <input
          type='text'
          name='companyName'
          value={form.companyName}
          onChange={onChangeHandler}
          placeholder='ACME Ltd'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
          required
        />
      </label>

      <label className='flex flex-col gap-2 my-4'>
        Feedback / Testimonial
        <textarea
          name='feedback'
          value={form.feedback}
          onChange={onChangeHandler}
          rows={4}
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none resize-none'
          placeholder='Short testimonial text...'
          required
        />
      </label>

      <p className='mt-6'>Logo (optional)</p>

      <div className='flex gap-3 mt-4 items-start'>
        <div className='flex flex-col items-center gap-2'>
          <label htmlFor='logo-upload' className='cursor-pointer'>
            <Image
              width={600}
              height={300}
              className='h-28 w-52 border border-slate-200 rounded cursor-pointer object-cover'
              src={previewSrc(preview)}
              alt='logo slot'
            />
          </label>

          <input
            type='file'
            accept='image/*'
            id='logo-upload'
            onChange={(e) => onFileChange(e.target.files?.[0])}
            hidden
          />

          <div className='flex gap-1'>
            <button
              type='button'
              onClick={removeLogo}
              className='p-1 border rounded text-sm text-red-600 cursor-pointer'
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <button
          disabled={loading}
          type='submit'
          className='!text-[#fff] cursor-pointer transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
        >
          {loading ? "Creating..." : "Add Feedback"}
        </button>
      </div>
    </form>
  );
}
