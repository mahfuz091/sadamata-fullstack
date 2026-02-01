"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ChooseBrandPlan.module.css";
const STORAGE_KEY = "sadamatta_brand_signup_step1";

const SIGNUP_ROUTE = "/signup";
function CheckIcon() {
  return (
    <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({ plan, active, onSelect, onContinue }) {
  return (
    <div
      className={`${styles.card} ${active ? styles.cardActive : ""}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>{plan.title}</h3>
          <p className={styles.cardSubtitle}>{plan.subtitle}</p>
        </div>

        {plan.badge ? <span className={styles.badge}>{plan.badge}</span> : null}
      </div>

      <button
        type="button"
        className={`${styles.continueBtn} ${active ? styles.continueBtnActive : styles.continueBtnDisabled}`}
        disabled={!active}
        onClick={(e) => {
          e.stopPropagation();
          onContinue();
        }}
      >
        Continue
      </button>

      <ul className={styles.list}>
        {plan.bullets.map((b, idx) => (
          <li key={idx} className={styles.listItem}>
            <span className={styles.checkWrap}>
              <CheckIcon />
            </span>
            <span className={styles.bulletText}>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChooseBrandPlan() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
 

 

  const plans = useMemo(
    () => [
      {
        key: "exclusive",
        title: "Exclusive Brand",
        subtitle: "(Recommended for established brands)",
        badge: "MOST POPULAR",
        bullets: [
          "Suitable for brands that already have their own designs",
          "Designs must be used exclusively on Sadamata",
          "66% higher royalty compared to the Non-Exclusive plan",
          "Unlimited account tier",
          "Dedicated Brand Manager",
          "Instant support priority",
          "Ideal for long-term brand growth",
        ],
      },
      {
        key: "nonExclusive",
        title: "Non-Exclusive Brand",
        subtitle: "(Best for new and flexible brands)",
        bullets: [
          "Ideal for brands without existing designs or those using Sadamata design services",
          "Designs can be used on Sadamata and other platforms",
          "Standard royalty structure",
          "Account tier up to 10,000",
          "Brand Manager support",
          "Support response within 72 hours",
          "Best for brands that want flexibility",
        ],
      },
    ],
    []
  );

  const continueWith = (planKey) => {
    // ✅ change route as you need
    router.push(`/brand/enroll?plan=${planKey}`);
  };

  const goEnroll = () => {
    const name = sp.get("name") || "";
    const contact = sp.get("contact") || "";

    const qs = new URLSearchParams({
      plan: selected,
      name,
      contact,
    });

    router.push(`enroll?${qs.toString()}`);
  };
  const goSignup = (planKey) => {
    router.push(`${SIGNUP_ROUTE}?plan=${encodeURIComponent(planKey)}`);
  };

  return (
    <main className={styles.page}>
      <section className={styles.headerWrap}>
        <div className={styles.headerCard}>
          <h1 className={styles.h1}>Choose Your Brand Plan</h1>
          <p className={styles.subText}>Select the plan that best fits your brand goals.</p>

          <div className={styles.radioRow}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="brandPlan"
                checked={selected === "exclusive"}
                onChange={() => setSelected("exclusive")}
              />
              <span>Exclusive Brand</span>
            </label>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="brandPlan"
                checked={selected === "nonExclusive"}
                onChange={() => setSelected("nonExclusive")}
              />
              <span>Non-Exclusive Brand</span>
            </label>
          </div>
        </div>
      </section>

      <section className={styles.contentWrap}>
        <div className={styles.grid}>
          <PlanCard
            plan={plans[0]}
            active={selected === "exclusive"}
            onSelect={() => setSelected("exclusive")}
            onContinue={() => goSignup("exclusive")}
          />

          <PlanCard
            plan={plans[1]}
            active={selected === "nonExclusive"}
            onSelect={() => setSelected("nonExclusive")}
            onContinue={() => goSignup("nonExclusive")}
          />
        </div>

        {/* Optional bottom continue */}
        
      </section>
    </main>
  );
}
