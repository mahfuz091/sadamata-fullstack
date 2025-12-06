"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// FeedbackUpdate.jsx
// - Loads a client feedback by route param `id` or `slug`
// - Prefills form with clientName, feedback, and logo
// - Allows replacing the logo file, previewing it, or removing it
// - Sends a PUT request with FormData to update the record

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function FeedbackUpdate() {
  const params = useParams();
  const router = useRouter();
  const id = params?.slug || params?.id;

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    companyName: "",
    feedback: "",
  });
  // logoSlot: null | { type: 'url', path, previewUrl } | { type: 'file', file, previewUrl }
  const [logoSlot, setLogoSlot] = useState(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();

    async function load() {
      try {
        setFetching(true);
        const res = await fetch(
          `${API_BASE.replace(/\/+$/, "")}/api/v1/client-feedback/${id}`,
          {
            signal: ac.signal,
          }
        );
        if (!res.ok) throw new Error(`Failed to load feedback (${res.status})`);
        const data = await res.json();

        setForm({
          clientName: data.clientName ?? "",
          companyName: data.companyName ?? "",
          feedback: data.feedback ?? "",
        });

        if (data.logo) {
          setLogoSlot({
            type: "url",
            path: data.logo,
            previewUrl: buildImageUrl(data.logo),
          });
        } else {
          setLogoSlot(null);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          toast.error(err.message || "Failed to load feedback");
        }
      } finally {
        setFetching(false);
      }
    }

    load();
    return () => ac.abort();
  }, [id]);

  function buildImageUrl(path) {
    if (!path) return null;
    const normalized = String(path).replace(/^\/+/, "");
    return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onFileChange(file) {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (logoSlot && logoSlot.type === "file") {
      try {
        URL.revokeObjectURL(logoSlot.previewUrl);
      } catch (_) {}
    }
    setLogoSlot({ type: "file", file, previewUrl });
    setLogoRemoved(false);
  }

  function removeLogo() {
    if (logoSlot && logoSlot.type === "file") {
      try {
        URL.revokeObjectURL(logoSlot.previewUrl);
      } catch (_) {}
    }
    setLogoSlot(null);
    setLogoRemoved(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!id) return toast.error("Missing feedback id");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("clientName", form.clientName ?? "");
      formData.append("companyName", form.companyName ?? "");
      formData.append("feedback", form.feedback ?? "");

      if (logoSlot && logoSlot.type === "file") {
        formData.append("logo", logoSlot.file, logoSlot.file.name);
      }

      if (logoRemoved && !logoSlot) {
        formData.append("removeLogo", "true");
      }

      const endpoint = `${API_BASE.replace(
        /\/+$/,
        ""
      )}/api/v1/client-feedback/${id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          txt || `Failed to update feedback (status ${res.status})`
        );
      }

      toast.success("Feedback updated");
      router.push("/dashboard/client-feedback");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update feedback");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className='p-6'>Loading feedback…</div>;

  return (
    <form onSubmit={onSubmit} className=' mx-auto text-slate-700'>
      <h2 className='text-2xl font-semibold mb-4'>Update Client Feedback</h2>

      <label className='flex flex-col gap-2 mb-4'>
        Client Name
        <input
          name='clientName'
          value={form.clientName}
          onChange={onChange}
          required
          className='p-2 border rounded'
          placeholder='Client name'
        />
      </label>
      <label className='flex flex-col gap-2 mb-4'>
        Company Name
        <input
          name='companyName'
          value={form.companyName}
          onChange={onChange}
          required
          className='p-2 border rounded'
          placeholder='Company name'
        />
      </label>

      <label className='flex flex-col gap-2 mb-4'>
        Feedback
        <textarea
          name='feedback'
          value={form.feedback}
          onChange={onChange}
          rows={4}
          className='p-2 border rounded resize-none'
          placeholder='Client feedback text'
        />
      </label>

      <div className='mb-4'>
        <p className='mb-2'>Logo</p>
        <div className='flex items-start gap-4'>
          <div className='h-28 w-28 rounded border overflow-hidden bg-gray-50 flex items-center justify-center'>
            {logoSlot ? (
              <img
                src={logoSlot.previewUrl}
                alt='logo'
                className='object-cover w-full h-full'
              />
            ) : (
              <div className='text-xs text-gray-400 px-2 text-center'>
                No logo
              </div>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <label className='cursor-pointer inline-block px-3 py-1 border rounded'>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFileChange(f);
                }}
              />
              Replace / Upload
            </label>

            <button
              type='button'
              onClick={removeLogo}
              className='px-3 py-1 border rounded text-sm text-red-600'
            >
              Remove Logo
            </button>

            <small className='text-xs text-gray-500'>
              PNG/JPG recommended. Replacing will upload a new file.
            </small>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <button
          disabled={loading}
          type='submit'
          className='!text-[#fff] cursor-pointer transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
        >
          {loading ? "Updating..." : "Update Feedback"}
        </button>
      </div>
    </form>
  );
}
