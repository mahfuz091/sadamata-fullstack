"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleFollowBrand } from "@/app/actions/brand/follow.actions";
import { toast } from "sonner";

export default function FollowButton({ brandId, initialIsFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await toggleFollowBrand(brandId);
      
      if (!result.success && result.error === "UNAUTHORIZED") {
        toast.error("Please login to follow this brand");
        router.push("/login");
        return;
      }

      if (result.success) {
        setIsFollowing(result.isFollowing);
        if (result.isFollowing) {
          toast.success("Successfully followed the brand!");
        } else {
          toast.success("Successfully unfollowed the brand.");
        }
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`brand-profile-follow__btn  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow Me"}
    </button>
  );
}
