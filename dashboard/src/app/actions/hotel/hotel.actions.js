"use server";
import "server-only";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Example: https://example.com
export async function getAllHotels(revalidateSeconds) {
  if (!BASE_URL) {
    throw new Error("Missing API_BASE_URL environment variable");
  }

  const url = `${BASE_URL.replace(/\/+$/, "")}/api/v1/hotels`;

  const options = {
    headers: { Accept: "application/json" },
    ...(revalidateSeconds
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" }),
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch hotels (${res.status} ${res.statusText}) ${
        text ? `- ${text}` : ""
      }`
    );
  }

  return res.json();
}
