import React from 'react';

export default function ThankYou({ searchParams }) {
  const tranId = searchParams?.tran_id || "";
  return (
    <main style={{ padding: 24 }}>
      <h1>Payment successful 🎉</h1>
      <p>Transaction: {tranId}</p>
      <a href="/orders">View your orders</a>
    </main>
  );
}
