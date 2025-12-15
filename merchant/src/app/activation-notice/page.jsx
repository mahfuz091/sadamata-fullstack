"use client";

import Layout from "@/components/Layout/Layout";
import Link from "next/link";

export default function ActivationNotice() {
  return (
    <Layout>
      <section className='user-login section-space h-100'>
        <div className='container'>
          <div className='user-login__inner text-center'>
            <h3>Account Created Successfully</h3>

            <p style={{ marginTop: "12px" }}>
              Your account has been created but is not active yet.
            </p>

            <p style={{ marginTop: "8px" }}>
              Please check your <strong>Email / Phone</strong> for activation
              instructions or wait for admin approval.
            </p>

            <div style={{ marginTop: "20px" }}>
              <Link href='/login' className='commerce-btn text-white'>
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
