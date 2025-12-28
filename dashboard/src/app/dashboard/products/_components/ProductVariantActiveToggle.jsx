"use client";

import { useState, useTransition } from "react";
import { updateProductVariantActive } from "@/app/actions/product/product.actions"; // <- path ঠিক করো
import { toast } from "sonner";

export default function ProductVariantActiveToggle({
  variantId,
  initialIsActive,
}) {
  const [isActive, setIsActive] = useState(Boolean(initialIsActive));
  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    const next = !isActive;

    // optimistic UI
    setIsActive(next);

    startTransition(async () => {
      const res = await updateProductVariantActive(null, {
        variantId,
        isActive: next,
      });
      if (res?.success) {
        toast.success(`Variant is now ${next ? "Active" : "Inactive"}`);
      }

      if (!res?.success) {
        // rollback if fail
        setIsActive(!next);
        alert(res?.msg || "Failed to update variant status");
      }
    });
  };

  return (
    <button
      type='button'
      onClick={onToggle}
      disabled={isPending}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded border text-sm",
        isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-muted",
      ].join(" ")}
      aria-pressed={isActive}
    >
      <span
        className={[
          "w-10 h-6 rounded-full relative transition",
          isActive ? "bg-green-600" : "bg-gray-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 w-5 h-5 rounded-full bg-white transition",
            isActive ? "left-4" : "left-0.5",
          ].join(" ")}
        />
      </span>

      <span className='font-medium'>{isActive ? "Active" : "Inactive"}</span>
    </button>
  );
}
