// app/(dashboard)/careers/edit/[id]/page.jsx

import EditCareer from "@/components/EditCareer/EditCareer";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Server-side data fetcher
async function getCareer(id) {
  try {
    const res = await fetch(`${API_URL}/api/v1/careers/${id}`, {
      cache: "no-store", // always fetch fresh data
    });

    if (!res.ok) {
      console.error("Fetch failed:", res.status);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("getCareer error:", err);
    return null;
  }
}

export default async function EditCareerPage({ params }) {
  const { id } = params;
  const career = await getCareer(id);

  if (!career) {
    notFound();
  }

  return (
    <div className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>Edit Role</h2>
      <div className='bg-white p-6 rounded shadow'>
        {/* Client component */}
        <EditCareer initial={career} />
      </div>
    </div>
  );
}
