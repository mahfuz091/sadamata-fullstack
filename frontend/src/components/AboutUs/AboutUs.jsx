import React from "react";

export default function AboutUs() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>About Us – Sadamata</h1>
          <p style={styles.subtitle}>
            Premium apparel made for comfort, quality, and everyday confidence
          </p>
        </header>

        {/* Content */}
        <section style={styles.card}>
          <p style={styles.paragraph}>
            Welcome to <strong>Sadamata.com</strong>, a modern online apparel
            brand dedicated to delivering quality-focused, comfortable, and
            stylish clothing for everyday life. We aim to create products that
            balance design, comfort, and value — thoughtfully made for people
            who care about what they wear.
          </p>

          <p style={styles.paragraph}>
            At Sadamata, we believe premium clothing should feel good, look
            good, and be accessible without unnecessary complexity.
          </p>

          <h2 style={styles.sectionTitle}>Our Story</h2>
          <p style={styles.paragraph}>
            Sadamata was created with a simple goal: to offer well-made apparel
            that meets modern quality expectations while remaining honest,
            practical, and reliable.
          </p>

          <p style={styles.paragraph}>
            In the local apparel market, customers often face limited choices —
            either low-quality products or items that are priced high without
            consistent value. We wanted to build a brand that focuses on
            balanced quality, thoughtful production, and transparency.
          </p>

          <p style={styles.paragraph}>
            Our journey started with researching fabrics, production methods,
            printing techniques, and fit standards to understand what truly
            improves comfort and durability. Based on that learning, Sadamata
            began shaping products that prioritize everyday usability and
            long-term satisfaction.
          </p>

          <h2 style={styles.sectionTitle}>What We Focus On</h2>

          <h3 style={styles.subTitle}>Quality Fabric Selection</h3>
          <p style={styles.paragraph}>
            We select fabrics based on comfort, breathability, durability for
            regular wear, skin-friendly feel, and clean finishing. Each batch
            goes through basic quality checks before production.
          </p>

          <h3 style={styles.subTitle}>Dyeing and Finishing Standards</h3>
          <p style={styles.paragraph}>
            We work with experienced production partners to ensure stable and
            even color appearance, controlled GSM levels, reduced shrinkage, and
            a soft finishing feel. These steps help maintain long-term comfort
            and appearance.
          </p>

          <h3 style={styles.subTitle}>Printing Technology</h3>
          <p style={styles.paragraph}>
            Sadamata uses modern Direct to Film (DTF) printing technology to
            achieve clear and detailed designs, long-lasting print quality, and
            a smooth surface feel suitable for everyday use.
          </p>

          <h3 style={styles.subTitle}>Design Approach</h3>
          <p style={styles.paragraph}>
            Our designs are inspired by popular culture, creative ideas, minimal
            and modern aesthetics, everyday expressions, and youth lifestyle
            themes. Each design is created to feel relatable, expressive, and
            wearable.
          </p>

          <h3 style={styles.subTitle}>Customer Experience</h3>
          <p style={styles.paragraph}>
            We aim to provide a smooth and transparent shopping experience
            through secure online payment methods, clear pricing with no hidden
            charges, a simple ordering process, and responsive customer support.
            All orders on Sadamata are prepaid to maintain secure and efficient
            operations.
          </p>

          <h3 style={styles.subTitle}>Responsible Approach</h3>
          <p style={styles.paragraph}>
            Sadamata follows responsible business practices by focusing on
            ethical production standards, conscious sourcing, reduced material
            waste, and long-lasting product usability. We believe responsible
            production creates better value for customers and the environment.
          </p>

          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.paragraph}>
            To build a reliable apparel brand in Bangladesh that delivers
            consistent product quality, comfortable everyday wear, thoughtful
            design, and honest value.
          </p>

          <h2 style={styles.sectionTitle}>Our Vision</h2>
          <p style={styles.paragraph}>
            To grow as a trusted online clothing brand known for simplicity,
            quality, and customer-focused values — built steadily with integrity
            and care.
          </p>

          <h2 style={styles.sectionTitle}>Why Choose Sadamata?</h2>
          <p style={styles.paragraph}>
            Because your clothing represents your comfort, your style, your
            confidence, and your everyday lifestyle. At Sadamata, we focus on
            creating apparel that fits naturally into your daily life.
          </p>

          <p style={styles.paragraphStrong}>
            Premium should feel simple. Quality should feel natural.
          </p>

          <h2 style={styles.sectionTitle}>Join the Sadamata Community</h2>
          <p style={styles.paragraph}>
            Whether you are looking for comfort, clean design, or dependable
            quality, Sadamata is here to serve you with care, clarity, and
            consistency.
          </p>

          <p style={styles.paragraphStrong}>
            Wear Sadamata. Feel Comfortable. Live Confidently.
          </p>
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
    marginTop: "8px",
    color: "#374151",
    maxWidth: "700px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "28px",
    border: "1px solid #e5e7eb",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "28px",
    marginBottom: "10px",
  },

  subTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "18px",
    marginBottom: "6px",
  },

  paragraph: {
    color: "#374151",
    marginBottom: "12px",
    lineHeight: 1.7,
  },

  paragraphStrong: {
    color: "#111827",
    fontWeight: "600",
    marginTop: "12px",
  },
};
