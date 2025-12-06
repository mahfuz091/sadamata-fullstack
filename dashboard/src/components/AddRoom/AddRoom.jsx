"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AddRoom() {
  const router = useRouter();

  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

  const [roomInfo, setRoomInfo] = useState({
    hotelId: "",
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

  // inventories now an array of objects: { date: Date, totalOverride: number | "", booked: number }
  const [inventories, setInventories] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHotels() {
      try {
        setLoadingHotels(true);
        const res = await fetch(`${API_BASE}/api/v1/hotels`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to load hotels (${res.status})`);
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load hotels");
      } finally {
        setLoadingHotels(false);
      }
    }
    fetchHotels();
  }, []);

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomInfo((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onFileChange = (key, file) => {
    if (!file) return;
    setImages((prev) => ({ ...prev, [key]: file }));
  };

  const moveImage = (key, direction) => {
    const keys = Object.keys(images);
    const idx = keys.indexOf(String(key));
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= keys.length) return;
    const fromKey = keys[idx];
    const toKey = keys[newIdx];
    setImages((prev) => {
      const copy = { ...prev };
      const tmp = copy[toKey];
      copy[toKey] = copy[fromKey];
      copy[fromKey] = tmp;
      return copy;
    });
  };

  const removeImage = (key) => {
    setImages((prev) => ({ ...prev, [key]: null }));
  };

  function previewSrc(fileOrPath) {
    if (!fileOrPath) return assets.upload_area;
    if (typeof fileOrPath === "string") return fileOrPath;
    try {
      return URL.createObjectURL(fileOrPath);
    } catch {
      return assets.upload_area;
    }
  }

  // Inventory helpers
  const addInventory = () => {
    setInventories((p) => [
      ...p,
      { date: new Date(), totalOverride: "", booked: 0 },
    ]);
  };

  const removeInventory = (index) => {
    setInventories((p) => p.filter((_, i) => i !== index));
  };

  const updateInventory = (index, field, value) => {
    setInventories((p) =>
      p.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  // format date to YYYY-MM-DD (server-friendly)
  const formatDate = (d) => {
    if (!d) return null;
    const dd = new Date(d);
    const yyyy = dd.getFullYear();
    const mm = String(dd.getMonth() + 1).padStart(2, "0");
    const day = String(dd.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${day}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!roomInfo.hotelId) throw new Error("Please select a hotel");

      const formData = new FormData();
      Object.entries(roomInfo).forEach(([key, value]) =>
        formData.append(
          key,
          typeof value === "boolean" ? String(value) : String(value ?? "")
        )
      );

      // Append inventories as JSON if provided
      if (inventories.length > 0) {
        // Validate and map
        const mapped = inventories.map((it) => {
          const date = formatDate(it.date);
          if (!date) throw new Error("Each inventory item needs a date");
          const item = { date };
          if (it.totalOverride !== "" && it.totalOverride !== null) {
            // try to coerce to number
            const n = Number(it.totalOverride);
            if (Number.isNaN(n))
              throw new Error("totalOverride must be a number");
            item.totalOverride = n;
          }
          // include booked if provided (default 0)
          if (it.booked !== undefined) item.booked = Number(it.booked) || 0;
          return item;
        });

        formData.append("inventories", JSON.stringify(mapped));
      }

      Object.keys(images).forEach((k) => {
        const f = images[k];
        if (f instanceof File) formData.append("images", f, f.name);
      });

      const res = await fetch(`${API_BASE}/api/v1/rooms`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to create room (status ${res.status})`);
      }

      toast.success("Room created successfully!");
      await router.push("/dashboard/rooms");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className='text-slate-500 mb-28 mx-auto'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>Add Room</h1>

      {/* Hotel Dropdown */}
      <label className='flex flex-col gap-2 my-4'>
        Hotel
        <select
          name='hotelId'
          value={roomInfo.hotelId}
          onChange={onChangeHandler}
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
          required
        >
          <option value=''>-- Select a hotel --</option>
          {loadingHotels ? (
            <option disabled>Loading hotels...</option>
          ) : hotels.length > 0 ? (
            hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))
          ) : (
            <option disabled>No hotels found</option>
          )}
        </select>
      </label>

      <label className='flex flex-col gap-2 my-4'>
        Name
        <input
          type='text'
          name='name'
          value={roomInfo.name}
          onChange={onChangeHandler}
          placeholder='Room name (e.g., Royal Suite)'
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none'
          required
        />
      </label>

      <label className='flex flex-col gap-2 my-4'>
        Description
        <textarea
          name='description'
          value={roomInfo.description}
          onChange={onChangeHandler}
          rows={4}
          className='w-full p-2 px-4 border border-slate-200 rounded outline-none resize-none'
        />
      </label>

      <p className='mt-6'>Room Images (Reorder using ▲ / ▼)</p>

      <div className='flex gap-3 mt-4 items-start'>
        {Object.keys(images).map((key) => (
          <div key={key} className='flex flex-col items-center gap-2'>
            <label htmlFor={`img-${key}`} className='cursor-pointer'>
              <Image
                width={600}
                height={300}
                className='h-28 w-52 border border-slate-200 rounded cursor-pointer object-cover'
                src={previewSrc(images[key])}
                alt={`slot ${key}`}
              />
            </label>

            <input
              type='file'
              accept='image/*'
              id={`img-${key}`}
              onChange={(e) => onFileChange(key, e.target.files?.[0])}
              hidden
            />

            <div className='flex gap-1'>
              <button
                type='button'
                onClick={() => moveImage(key, -1)}
                className='p-1 border rounded text-sm'
              >
                <ArrowLeft />
              </button>
              <button
                type='button'
                onClick={() => moveImage(key, +1)}
                className='p-1 border rounded text-sm'
              >
                <ArrowRight />
              </button>
              <button
                type='button'
                onClick={() => removeImage(key)}
                className='p-1 border rounded text-sm text-red-600'
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-2 gap-3 mt-6'>
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
            placeholder='e.g., Guest Max 4'
          />
        </label>

        <label className='flex flex-col gap-2'>
          Guest Max
          <input
            type='number'
            name='guestMax'
            value={roomInfo.guestMax}
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
            value={roomInfo.discountPrice}
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
          "special",
          "offerRoom",
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
      </div>

      {/* Inventories UI */}
      <div className='my-6'>
        <div className='flex items-center justify-between mb-2'>
          <p className='font-medium'>Inventories (pick date + totalOverride)</p>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={addInventory}
              className='px-3 py-1 border rounded'
            >
              Add
            </button>
            {inventories.length > 0 && (
              <button
                type='button'
                onClick={() => setInventories([])}
                className='px-3 py-1 border rounded text-red-600'
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {inventories.length === 0 && (
          <p className='text-sm text-slate-400'>
            No inventory items yet. Click "Add" to create one.
          </p>
        )}

        <div className='grid gap-3 mt-3'>
          {inventories.map((it, idx) => (
            <div key={idx} className='flex flex-wrap gap-3 items-center'>
              <div className='flex flex-col'>
                <label className='text-xs'>Date</label>
                <DatePicker
                  selected={it.date ? new Date(it.date) : null}
                  onChange={(d) => updateInventory(idx, "date", d)}
                  dateFormat='yyyy-MM-dd'
                  className='p-2 border rounded'
                />
              </div>

              <div className='flex flex-col'>
                <label className='text-xs'>Total Override</label>
                <input
                  type='number'
                  value={it.totalOverride}
                  onChange={(e) =>
                    updateInventory(idx, "totalOverride", e.target.value)
                  }
                  placeholder='leave empty to not override'
                  className='p-2 border rounded w-40'
                />
              </div>

              <div className='flex flex-col'>
                <label className='text-xs'>Booked (optional)</label>
                <input
                  type='number'
                  value={it.booked}
                  onChange={(e) =>
                    updateInventory(idx, "booked", e.target.value)
                  }
                  className='p-2 border rounded w-28'
                />
              </div>

              <div className='flex items-end'>
                <button
                  type='button'
                  onClick={() => removeInventory(idx)}
                  className='p-2 border rounded text-red-600'
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-6'>
        <button
          disabled={loading}
          type='submit'
          className='!text-[#fff] cursor-pointer transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
        >
          {loading ? "Creating..." : "Add Room"}
        </button>
      </div>
    </form>
  );
}
