// app/dashboard/bookings/[id]/page.jsx
import React from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "";

async function getBooking(id) {
  const res = await fetch(`${API_BASE}/api/v1/bookings/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.booking ?? null;
}

export default async function BookingDetailPage({ params }) {
  const { id } = params;
  const booking = await getBooking(id);

  if (!booking) {
    return (
      <div className='p-6'>
        <h1 className='text-xl font-semibold text-red-600'>
          Booking not found
        </h1>
        <p className='text-gray-600'>No booking found for ID: {id}</p>
      </div>
    );
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Booking Details</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === "CONFIRMED"
              ? "bg-green-100 text-green-700"
              : booking.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : booking.status === "FAILED" || booking.status === "CANCELLED"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Booking Info */}
      <section className='bg-white rounded-xl shadow p-5 space-y-3'>
        <h2 className='font-semibold text-lg border-b pb-2'>Booking Info</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-2'>
          <p>
            <span className='font-medium'>Confirmation Code:</span>{" "}
            {booking.confirmationCode}
          </p>
          <p>
            <span className='font-medium'>Created At:</span>{" "}
            {new Date(booking.createdAt).toLocaleString()}
          </p>
          <p>
            <span className='font-medium'>Check-in:</span>{" "}
            {formatDate(booking.checkInDate)}
          </p>
          <p>
            <span className='font-medium'>Check-out:</span>{" "}
            {formatDate(booking.checkOutDate)}
          </p>
          <p>
            <span className='font-medium'>Guests:</span>{" "}
            {booking.totalGuests ?? "—"}
          </p>
          <p>
            <span className='font-medium'>Total Amount:</span>{" "}
            {booking.currency} {Number(booking.totalAmount).toLocaleString()}
          </p>
        </div>
      </section>

      {/* Guest Info */}
      <section className='bg-white rounded-xl shadow p-5 space-y-2'>
        <h2 className='font-semibold text-lg border-b pb-2'>Guest Info</h2>
        <p>
          <span className='font-medium'>Name:</span> {booking.firstName}{" "}
          {booking.lastName}
        </p>
        <p>
          <span className='font-medium'>Email:</span> {booking.email ?? "—"}
        </p>
        <p>
          <span className='font-medium'>Phone:</span> {booking.phone ?? "—"}
        </p>
        <p>
          <span className='font-medium'>Country:</span> {booking.country ?? "—"}
        </p>
        <p>
          <span className='font-medium'>City:</span> {booking.city ?? "—"}
        </p>
      </section>

      {/* Room Info */}
      {booking.room && (
        <section className='bg-white rounded-xl shadow p-5 space-y-3'>
          <h2 className='font-semibold text-lg border-b pb-2'>Room Details</h2>
          <p>
            <span className='font-medium'>Room Name:</span>{" "}
            {booking.room.name ?? "—"}
          </p>
          {booking.room.images?.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {booking.room.images.map((img) => (
                <img
                  key={img.id}
                  src={`${API_BASE}/${img.path}`}
                  alt={booking.room.name}
                  className='w-32 h-24 object-cover rounded-lg border'
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Payment Info */}
      {booking.payments?.length > 0 && (
        <section className='bg-white rounded-xl shadow p-5 space-y-3'>
          <h2 className='font-semibold text-lg border-b pb-2'>Payment Info</h2>
          {booking.payments.map((p) => (
            <div key={p.id} className='border-b pb-2 mb-2 last:border-none'>
              <p>
                <span className='font-medium'>Transaction ID:</span>{" "}
                {p.transactionId ?? "—"}
              </p>
              <p>
                <span className='font-medium'>Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    p.status === "PAID"
                      ? "text-green-600"
                      : p.status === "FAILED"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {p.status}
                </span>
              </p>
              {p.paidAt && (
                <p>
                  <span className='font-medium'>Paid At:</span>{" "}
                  {new Date(p.paidAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
