import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <Layout session={session}>
      <main class='policy-wrap'>
        <div class='policy-title'>Privacy Policy – Sadamata.com</div>

        <div class='effective-date'>
          Effective Date:<span class='line'></span>
        </div>

        <p>
          Sadamata.com (“Sadamata”, “we”, “our”, “us”) is committed to
          protecting your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our
          website or make a purchase.
        </p>

        <div class='section'>
          <div class='section-title'>1. Information We Collect</div>
          <p class='section-text'>
            We may collect personal information including name, email address,
            phone number, shipping address, order details, and payment status.
            Payment processing is handled securely through SSLCommerz. We do not
            store card details.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>2. How We Use Information</div>
          <p class='section-text'>
            Information is used for order processing, customer support, payment
            verification, service improvement, security, and legal compliance.
            Marketing communication is sent only with user consent.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>3. Sharing of Information</div>
          <p class='section-text'>
            We do not sell personal data. Limited information may be shared with
            delivery partners, payment processors, and legal authorities when
            required by law.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>4. Cookies</div>
          <p class='section-text'>
            We use cookies to improve functionality and analyze traffic. Users
            may disable cookies via browser settings.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>5. Data Security</div>
          <p class='section-text'>
            We use SSL encryption, secure servers, and restricted access
            controls to protect data. No online system guarantees absolute
            security.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>6. Data Retention</div>
          <p class='section-text'>
            Information is retained only as long as necessary for business and
            legal purposes, then securely deleted.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>7. User Rights</div>
          <p class='section-text'>
            Users may access, update, or request deletion of their data by
            contacting us.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>8. Children’s Privacy</div>
          <p class='section-text'>
            Our services are not intended for individuals under 13 years of age.
          </p>
        </div>

        <div class='section'>
          <div class='section-title'>9. Policy Updates</div>
          <p class='section-text'>
            This Privacy Policy may be updated periodically. Continued use of
            the site implies acceptance.
          </p>
        </div>

        <div class='section contact'>
          <div class='section-title'>10. Contact</div>
          <p class='section-text'>
            Email:{" "}
            <a href='mailto:contact@sadamata.com'>contact@sadamata.com</a>
            <br />
            Website:{" "}
            <a href='https://sadamata.com' target='_blank' rel='noopener'>
              https://sadamata.com
            </a>
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default page;
