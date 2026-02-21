"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProductImage } from "@/lib/helper";

const FAVORITE_KEY = "favorite_products";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []);
    } catch {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (product) => {
    let action = null;
    let nextFavorites = [];

    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);

      if (exists) {
        action = "remove";
        nextFavorites = prev.filter((p) => p.id !== product.id);
      } else {
        action = "add";
        nextFavorites = [
          ...prev,
          {
            id: product.id,
            productId: product.productId,
            title: product.title,
            price: product.price,
              image: product.previewUrl,
          },
        ];
      }

      return nextFavorites;
    });

    queueMicrotask(() => {
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(nextFavorites));

      toast[action === "add" ? "success" : "success"](
        action === "add" ? "Added to favorites" : "Removed from favorites",
        { description: product.title }
      );

      window.dispatchEvent(new Event("favorite-updated"));
    });
  };

  const isFavorite = (productId) => favorites.some((p) => p.id === productId);

  return { favorites, toggleFavorite, isFavorite };
}
