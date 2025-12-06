"use client";
import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { ArrowBigLeft, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function AddHotel() {
  const router = useRouter();
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

  console.log(API_BASE, "base");

  const [hotelInfo, setHotelInfo] = useState({
    name: "",
    shortDescription: "",
    phone: "",
    reservationPhone: "",
    email: "",
    reservationEmail: "",
    domain: "",
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

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelInfo({
      ...hotelInfo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Move an image up or down in the images object
  const moveImage = (key, direction /* -1 up, +1 down */) => {
    const keys = Object.keys(images); // ["1","2","3","4","5"]
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

  // AddHotel.jsx (only the changed bits)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // append hotelInfo (cast to string for FormData)
      Object.entries(hotelInfo).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "boolean" ? String(value) : String(value ?? "")
        );
      });

      // append images in current order
      Object.keys(images).forEach((k) => {
        const file = images[k];
        if (file instanceof File) formData.append("images", file, file.name);
      });

      // robust base URL (falls back to relative)

      const endpoint = `${API_BASE}/api/v1/hotels`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData, // Don't set Content-Type; the browser will set the multipart boundary
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || `Failed to create hotel (status ${res.status})`
        );
      }

      toast.success("Hotel created successfully!");
      // navigate to listing AND refresh server data so getAllHotels() runs again
      await router.push("/dashboard/hotels"); // wait for navigation to finish
      router.refresh(); // re-fetch server components / data for the page
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error creating hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='text-slate-500 mb-28  mx-auto'>
      <h1 className='text-2xl mb-5 text-slate-800 font-semibold'>
        Add New Hotel
      </h1>

      <p className='mt-7'>Hotel Images (Reorder using ▲ / ▼)</p>

      <div className='flex gap-3 mt-4 items-start'>
        {Object.keys(images).map((key) => (
          <div key={key} className='flex flex-col items-center gap-2'>
            <label htmlFor={`images${key}`} className='cursor-pointer'>
              <Image
                width={600}
                height={300}
                className='h-28 w-52 border border-slate-200 rounded cursor-pointer object-cover'
                src={
                  images[key]
                    ? URL.createObjectURL(images[key])
                    : assets.upload_area
                }
                alt=''
              />
            </label>

            <input
              type='file'
              accept='image/*'
              id={`images${key}`}
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
              hidden
            />

            <div className='flex gap-1'>
              <button
                type='button'
                onClick={() => moveImage(key, -1)}
                className='p-1 border rounded text-sm'
                aria-label={`Move image ${key} up`}
              >
                <ArrowLeft />
              </button>
              <button
                type='button'
                onClick={() => moveImage(key, +1)}
                className='p-1 border rounded text-sm'
                aria-label={`Move image ${key} down`}
              >
                <ArrowRight />
              </button>
              <button
                type='button'
                onClick={() => setImages({ ...images, [key]: null })}
                className='p-1 border rounded text-sm text-red-600'
                aria-label={`Remove image ${key}`}
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
        Reservation Phone
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
        Reservation Email
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

      <div className='grid grid-cols-2 gap-3 mt-4 mb-5'>
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

      <button
        disabled={loading}
        type='submit'
        className='mt-5 cursor-pointer !text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
      >
        {loading ? "Creating..." : "Add Hotel"}
      </button>
    </form>
  );
}
