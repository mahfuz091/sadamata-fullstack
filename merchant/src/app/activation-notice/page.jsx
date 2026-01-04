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
              Your account has been created successfully, but it is not active
              yet.
            </p>

            <p style={{ marginTop: "8px" }}>
              Please check your email or phone for activation instructions. If
              required, your account will be reviewed and approved by our admin
              team.
            </p>

            <div style={{ marginTop: "20px" }}>
              <Link href='/signin' className='commerce-btn text-white'>
                Go to Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
