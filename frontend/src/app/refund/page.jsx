import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <Layout session={session}>
      <main class='policy-wrap'>
        <div class='policy-title'>
          Returns &amp; Refunds Policy – Sadamata.com
        </div>

        <p>
          At Sadamata, customer satisfaction is our top priority. All products
          are printed on demand and carefully inspected before delivery.
          <br />
          This policy explains when returns or refunds are accepted.
        </p>

        <div class='section-title'>Eligibility for Return &amp; Refund</div>
        <p>You may request a return or refund if:</p>
        <ul>
          <li>The product is defective or damaged</li>
          <li>A wrong item was delivered</li>
          <li>There is a production or printing error</li>
        </ul>

        <div class='section-title'>Non-Eligible Cases</div>
        <p>Returns or refunds are not accepted for:</p>
        <ul>
          <li>Wrong size, color, or design selected by the customer</li>
          <li>Change of mind after placing the order</li>
          <li>Items that have been worn, washed, or altered</li>
        </ul>

        <div class='section-title'>Return &amp; Refund Process</div>
        <ul>
          <li>Contact support within 48 hours of delivery</li>
          <li>Provide clear photos of the issue</li>
          <li>Requests are reviewed within 1–3 business days</li>
          <li>Approved cases receive a replacement or refund</li>
        </ul>

        <div class='section-title'>Refund Timeline</div>
        <p>
          Refunds are processed within 7–10 business days via the original
          payment method.
        </p>

        <div class='section-title'>Contact</div>
        <p class='contact'>
          Email:{" "}
          <a class='email' href='mailto:support@sadamata.com'>
            support@sadamata.com
          </a>
        </p>
      </main>
    </Layout>
  );
};

export default page;
