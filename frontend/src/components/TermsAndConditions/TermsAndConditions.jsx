import React from "react";

export default function TermsAndConditions() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>Sadamata.com — Terms & Conditions</h1>
          <p style={styles.subtitle}>Conditions of Use</p>
          <p style={styles.effective}>Effective Date: To be updated</p>
        </header>

        {/* Content */}
        <section style={styles.card}>
          <p style={styles.intro}>
            Welcome to <strong>Sadamata.com</strong>, an online e-commerce
            platform specializing in premium printed apparel. By accessing or
            using this website, you agree to comply with and be bound by the
            following Terms & Conditions.
          </p>

          <ol style={styles.list}>
            <li>
              <h3>General Terms</h3>
              <p>
                All information, prices, designs, and content displayed on
                Sadamata.com are subject to change at any time without prior
                notice. You agree not to copy, modify, reproduce, distribute, or
                exploit any content without written permission. Sadamata
                reserves the right to update or discontinue any part of the
                website or these Terms.
              </p>
            </li>

            <li>
              <h3>Privacy & Data Protection</h3>
              <p>
                Customer information is used only for order processing, payment,
                delivery, and support. We do not sell or share personal data
                with third parties. All transactions are secured using SSL
                encryption.
              </p>
            </li>

            <li>
              <h3>Ordering & Payment</h3>
              <p>
                All orders must be paid in advance. Cash on Delivery (COD) is
                not available. Orders are confirmed only after successful
                payment. Customers must ensure all order details are correct
                before payment.
              </p>
            </li>

            <li>
              <h3>Delivery Policy</h3>
              <p>
                Free home delivery across Bangladesh. Inside Dhaka: 24–48 hours.
                Outside Dhaka: 48–72 hours. Delivery times may vary due to
                courier or external factors beyond our control.
              </p>
            </li>

            <li>
              <h3>Return & Refund Policy</h3>
              <p>
                Refunds or replacements apply only for damaged, defective, or
                incorrect products due to our mistake. Refunds are not
                applicable for wrong size, color, design selection, used
                products, or minor color variation. Requests must be made within
                3 days with unboxing proof. Approved refunds are processed
                within 7–10 business days.
              </p>
            </li>

            <li>
              <h3>Product & Design Ownership</h3>
              <p>
                All designs and content are the intellectual property of
                Sadamata Company Limited. Unauthorized use or resale is strictly
                prohibited.
              </p>
            </li>

            <li>
              <h3>Pricing & Taxes</h3>
              <p>
                All prices include applicable VAT if required. Pricing errors
                may result in order cancellation with a full refund.
              </p>
            </li>

            <li>
              <h3>Limitation of Liability</h3>
              <p>
                Sadamata is not liable for indirect or consequential damages.
                Total liability shall not exceed the order amount paid.
              </p>
            </li>

            <li>
              <h3>Account Suspension</h3>
              <p>
                Accounts may be suspended or terminated for violations, fraud,
                or misuse.
              </p>
            </li>

            <li>
              <h3>Governing Law</h3>
              <p>
                These Terms are governed by the laws of Bangladesh. Disputes
                shall fall under the jurisdiction of Dhaka courts.
              </p>
            </li>

            <li>
              <h3>Contact Information</h3>
              <p>
                Email:{" "}
                <a href='mailto:support@sadamata.com'>support@sadamata.com</a>
                <br />
                Website:{" "}
                <a
                  href='https://www.sadamata.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  www.sadamata.com
                </a>
              </p>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}

/* ================== STYLES (LIGHT) ================== */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    color: "#111827",
    padding: "40px 16px",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "24px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: 0,
  },

  subtitle: {
    margin: "6px 0",
    color: "#374151",
  },

  effective: {
    fontSize: "14px",
    color: "#6b7280",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "28px",
    border: "1px solid #e5e7eb",
  },

  intro: {
    marginBottom: "20px",
    color: "#374151",
  },

  list: {
    paddingLeft: "18px",
  },
};
