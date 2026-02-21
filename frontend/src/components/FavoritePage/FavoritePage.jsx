"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProductImage } from "@/lib/helper";

const FavoritePage = ({ user }) => {
  const FAVORITE_KEY = "favorite_products";

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = JSON.parse(localStorage.getItem(FAVORITE_KEY) || "[]");
    setFavorites(saved);
  }, []);
  const handleRemoveFavorite = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);

    localStorage.setItem(FAVORITE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("favorite-updated"));

    toast.success("Removed from favorites");
  };

  return (
    <section className='cart-page'>
      <div className='container'>
        <div className='cart-page__top'>
          <h2 className='cart-section-title'>My Favorites</h2>
          <p className='cart-section-text'>Products you have saved for later</p>
        </div>

        <div className='row gutter-y-30'>
          <div className='col-lg-12'>
            <div className='cart-one__inner'>
              <ul className='cart-one__list list-unstyled'>
                {favorites.length === 0 ? (
                  <p>Your favorites list is empty.</p>
                ) : (
                  favorites.map((item) => {
const rawImg = item?.image;
console.log(rawImg);

                    return (
                    <li className='cart-one__list__item' key={item.id}>
                      <div className='cart-one__list__left w-100'>
                        <div className='cart-one__list__image'>
                          <Link href={`/products/${item.productId}`}>
                            <Image
                              src={rawImg}
                              alt={item.title}
                              width={80}
                              height={80}
                              style={{ cursor: "pointer" }}
                            />
                          </Link>
                        </div>

                        <div className='cart-one__list__content'>
                          <h3 className='cart-one__list__title'>
                            <Link href={`/products/${item.productId}`}>
                              {item.title}
                            </Link>
                          </h3>

                          <div className='cart-one__list__amount'>
                            ৳{Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className='cart-one__list__right'>
                        <div className='cart-one__list__close'>
                          <button
                            type='button'
                            onClick={() => handleRemoveFavorite(item.id)}
                            className='remove-btn'
                            title='Remove from favorites'
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <GoTrash color='#0B0F0E' size={18} />
                          </button>
                        </div>
                      </div>
                    </li>
                    )
                  }
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoritePage;
