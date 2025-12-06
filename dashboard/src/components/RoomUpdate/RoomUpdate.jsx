"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

/**
 * RoomUpdate.jsx
 *
 * - Loads room by id (from route param `slug` or `id`)
 * - Prefills form with room data
 * - Supports:
 *    - keeping existing images (RoomImage {id, path})
 *    - replacing an existing image with a file (we send imageUpdates -> {imageId, fileIndex})
 *    - uploading new images (files appended under "files")
 *    - removing a slot (sets it to empty)
 * - NOTE: Reordering of existing RoomImage rows is NOT supported by server code in your provided
 *   updateRoom implementation. New files will be appended after existing images. To support reorder
 *   you must change the backend to accept an ordered array of image ids / update RoomImage.order.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function RoomUpdate() {
  const params = useParams();
  const router = useRouter();
  // expecting route param name: id or slug; adjust if different
  const id = params?.slug || params?.id;

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // images: up to 5 slots (or more if you prefer). Each slot:
  // null | { type: 'url', url: { id, path } } | { type: 'file', file: File, preview: string, originalId?: string }
  const [images, setImages] = useState([null, null, null, null, null]);

  const [roomInfo, setRoomInfo] = useState({
    hotelId: "", // keep so slug uniqueness can be computed on backend if needed
    name: "",
    description: "",
    totalUnits: 1,
    guestText: "",
    guestMax: "",
    hasWifi: false,
    hasAC: false,
    includesBreakfast: false,
    hasSwimmingPool: false,
    includesWelcomeDrinks: false,
    accessibility: false,
    roomService: false,
    elevator: false,
    regularPrice: 0,
    discountPrice: "",
    currency: "BDT",
    isTaxIncluded: true,
    status: "ACTIVE",
    isFeatured: false,
    offerRoom: false,
    special: false,
  });

  // optional inventoryUpdates input (JSON). You may replace with structured UI if needed.
  const [inventoryJson, setInventoryJson] = useState("");

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();
    async function load() {
      try {
        setFetching(true);
        const res = await fetch(
          `${API_BASE.replace(/\/+$/, "")}/api/v1/rooms/${id}`,
          {
            signal: ac.signal,
          }
        );
        if (!res.ok) throw new Error(`Failed to load room (${res.status})`);
        const data = await res.json();

        // map fields
        setRoomInfo((p) => ({
          ...p,
          hotelId: data.hotelId ?? p.hotelId,
          name: data.name ?? "",
          description: data.description ?? "",
          totalUnits: data.totalUnits ?? 1,
          guestText: data.guestText ?? "",
          guestMax: data.guestMax ?? "",
          hasWifi: !!data.hasWifi,
          hasAC: !!data.hasAC,
          includesBreakfast: !!data.includesBreakfast,
          hasSwimmingPool: !!data.hasSwimmingPool,
          includesWelcomeDrinks: !!data.includesWelcomeDrinks,
          accessibility: !!data.accessibility,
          roomService: !!data.roomService,
          elevator: !!data.elevator,
          regularPrice: data.regularPrice ?? 0,
          discountPrice: data.discountPrice ?? "",
          currency: data.currency ?? "BDT",
          isTaxIncluded: !!data.isTaxIncluded,
          status: data.status ?? "ACTIVE",
          isFeatured: !!data.isFeatured,
          offerRoom: !!data.offerRoom,
          special: !!data.special,
        }));

        // populate images slots from data.images (RoomImage[]). Fill up to slots length.
        const slotCount = Math.max(
          5,
          Array.isArray(data.images) ? data.images.length : 0
        );
        const imgs = Array.from({ length: slotCount }, (_, i) => null);
        if (Array.isArray(data.images)) {
          for (let i = 0; i < data.images.length; i++) {
            const img = data.images[i];
            // we expect each img to be { id, path, order }
            imgs[i] = { type: "url", url: { id: img.id, path: img.path } };
          }
        }
        setImages(imgs);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          toast.error(err.message || "Failed to load room");
        }
      } finally {
        setFetching(false);
      }
    }
    load();
    return () => ac.abort();
  }, [id]);

  function onChangeHandler(e) {
    const { name, value, type, checked } = e.target;
    setRoomInfo((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function setImageAt(index, item) {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = item;
      return copy;
    });
  }

  function onFileChange(index, file) {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImages((prev) => {
      const copy = [...prev];
      const prevSlot = copy[index];
      const originalId =
        prevSlot && prevSlot.type === "url" ? prevSlot.url.id : undefined;
      copy[index] = { type: "file", file, preview, originalId };
      return copy;
    });
  }

  function removeImage(index) {
    setImages((prev) => {
      const copy = [...prev];
      const cur = copy[index];
      if (cur && cur.type === "file") {
        try {
          URL.revokeObjectURL(cur.preview);
        } catch {}
      }
      copy[index] = null;
      return copy;
    });
  }

  function moveImage(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const tmp = copy[newIndex];
      copy[newIndex] = copy[index];
      copy[index] = tmp;
      return copy;
    });
  }

  // build full URL helper (for displaying existing images)
  function buildImageUrl(path) {
    if (!path) return null;
    const normalized = String(path).replace(/^\/+/, "");
    return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
  }

  // Submit: build imageUpdates (for replacing existing images), files array under "files"
  async function onSubmit(e) {
    e.preventDefault();
    if (!id) return toast.error("Missing room id");
    setLoading(true);

    try {
      const formData = new FormData();

      // append scalar fields expected by backend (roomData)
      const scalarFields = [
        "hotelId",
        "name",
        "description",
        "totalUnits",
        "guestText",
        "guestMax",
        "regularPrice",
        "discountPrice",
        "currency",
        "isTaxIncluded",
        "status",
        "isFeatured",
        "offerRoom",
        "special",
        "hasWifi",
        "hasAC",
        "includesBreakfast",
        "hasSwimmingPool",
        "includesWelcomeDrinks",
        "accessibility",
        "roomService",
        "elevator",
      ];

      for (const key of scalarFields) {
        const val = roomInfo[key];
        // keep booleans and numbers as strings that backend will cast/normalize
        formData.append(
          key,
          val === undefined || val === null ? "" : String(val)
        );
      }

      // inventoryUpdates: if user provided JSON, append as inventoryUpdates
      if (inventoryJson && inventoryJson.trim()) {
        // validate JSON
        try {
          const inv = JSON.parse(inventoryJson);
          // the controller accepts inventoryUpdates either as JSON string or array; we append as string
          formData.append("inventoryUpdates", JSON.stringify(inv));
        } catch (err) {
          throw new Error("Inventory JSON is invalid");
        }
      }

      // build filesToUpload and imageUpdates
      const filesToUpload = [];
      const imageUpdates = []; // { imageId, fileIndex }

      // For each image slot:
      // - if slot.type==='file' and slot.originalId -> push file and add imageUpdates entry to replace
      // - if slot.type==='file' and no originalId -> push file (appended new image)
      // - if slot.type==='url' and user kept it -> do nothing (we're not sending reorder info)
      // - if slot === null -> do nothing (we treat as empty)
      //
      // NOTE: backend will not reorder existing images; it only replaces specified imageId or appends new files.
      for (let i = 0; i < images.length; i++) {
        const slot = images[i];
        if (!slot) continue;
        if (slot.type === "file") {
          const fileIndex = filesToUpload.length; // next index
          filesToUpload.push(slot.file);
          if (slot.originalId) {
            imageUpdates.push({ imageId: slot.originalId, fileIndex });
          } // else new file appended, no imageUpdate needed
        }
      }

      // append imageUpdates JSON (backend expects imageUpdates in body)
      if (imageUpdates.length > 0) {
        formData.append("imageUpdates", JSON.stringify(imageUpdates));
      }

      // append files under field name 'files' because your route uses upload.array('files', ...)
      filesToUpload.forEach((f) => {
        formData.append("files", f, f.name);
      });

      // PATCH/PUT to backend
      const endpoint = `${API_BASE.replace(/\/+$/, "")}/api/v1/rooms/${id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Failed to update room (status ${res.status})`);
      }

      toast.success("Room updated");
      // navigate back to rooms list and refresh SSR data
      await router.push("/dashboard/rooms");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <div className='p-6'>Loading room…</div>;
  }

  return (
    <form onSubmit={onSubmit} className='text-slate-500 mb-28 mx-auto'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>
        Update Room
      </h1>

      <p className='mt-7'>Room Images (Replace or add new files)</p>

      <div className='flex gap-3 mt-4 items-start'>
        {images.map((slot, idx) => (
          <div key={idx} className='flex flex-col items-center gap-2'>
            <label htmlFor={`img-${idx}`} className='cursor-pointer'>
              <div className='h-28 w-52 border border-slate-200 rounded overflow-hidden bg-gray-50'>
                {slot ? (
                  slot.type === "url" ? (
                    <img
                      src={buildImageUrl(slot.url.path)}
                      alt={`room image ${idx + 1}`}
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
                  <div className='flex items-center justify-center h-full w-full text-sm text-gray-400'>
                    Click to upload
                  </div>
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
          value={roomInfo.name}
          onChange={onChangeHandler}
          placeholder='Enter room name'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
          required
        />
      </label>

      <label className='flex flex-col gap-2 my-6'>
        Description
        <textarea
          name='description'
          value={roomInfo.description}
          onChange={onChangeHandler}
          placeholder='Enter room description'
          rows={4}
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none resize-none'
        />
      </label>

      <div className='grid grid-cols-2 gap-3'>
        <label className='flex flex-col gap-2'>
          Total Units
          <input
            type='number'
            name='totalUnits'
            value={roomInfo.totalUnits}
            onChange={onChangeHandler}
            className='p-2 border rounded'
            min={1}
          />
        </label>

        <label className='flex flex-col gap-2'>
          Guest Text
          <input
            type='text'
            name='guestText'
            value={roomInfo.guestText}
            onChange={onChangeHandler}
            className='p-2 border rounded'
          />
        </label>

        <label className='flex flex-col gap-2'>
          Guest Max
          <input
            type='number'
            name='guestMax'
            value={roomInfo.guestMax ?? ""}
            onChange={onChangeHandler}
            className='p-2 border rounded'
          />
        </label>

        <label className='flex flex-col gap-2'>
          Regular Price
          <input
            type='number'
            name='regularPrice'
            value={roomInfo.regularPrice}
            onChange={onChangeHandler}
            className='p-2 border rounded'
          />
        </label>

        <label className='flex flex-col gap-2'>
          Discount Price
          <input
            type='number'
            name='discountPrice'
            value={roomInfo.discountPrice ?? ""}
            onChange={onChangeHandler}
            className='p-2 border rounded'
          />
        </label>

        <label className='flex flex-col gap-2'>
          Currency
          <select
            name='currency'
            value={roomInfo.currency}
            onChange={onChangeHandler}
            className='p-2 border rounded'
          >
            <option value='BDT'>BDT</option>
            <option value='USD'>USD</option>
          </select>
        </label>

        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            name='isTaxIncluded'
            checked={roomInfo.isTaxIncluded}
            onChange={onChangeHandler}
          />
          Tax Included
        </label>

        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            name='isFeatured'
            checked={roomInfo.isFeatured}
            onChange={onChangeHandler}
          />
          Featured
        </label>
      </div>

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
              checked={roomInfo[feature]}
              onChange={onChangeHandler}
            />
            {feature.replace(/([A-Z])/g, " $1")}
          </label>
        ))}

        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            name='offerRoom'
            checked={roomInfo.offerRoom}
            onChange={onChangeHandler}
          />
          Offer Room
        </label>

        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            name='special'
            checked={roomInfo.special}
            onChange={onChangeHandler}
          />
          Special
        </label>

        <label className='flex flex-col gap-2 col-span-2'>
          Status
          <select
            name='status'
            value={roomInfo.status}
            onChange={onChangeHandler}
            className='p-2 border rounded'
          >
            <option value='ACTIVE'>ACTIVE</option>
            <option value='INACTIVE'>INACTIVE</option>
          </select>
        </label>
      </div>

      <label className='flex flex-col gap-2 my-6'>
        Inventory Updates (optional JSON array)
        <textarea
          value={inventoryJson}
          onChange={(e) => setInventoryJson(e.target.value)}
          placeholder='e.g. [{"date":"2025-11-01","totalOverride":5,"booked":0}]'
          rows={4}
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none resize-none'
        />
        <small className='text-xs text-gray-500'>
          If provided, must be valid JSON. See backend's inventory shape.
        </small>
      </label>

      <div className='mt-6'>
        <button
          disabled={loading}
          type='submit'
          className='bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-900 transition'
        >
          {loading ? "Updating..." : "Update Room"}
        </button>
      </div>
    </form>
  );
}
