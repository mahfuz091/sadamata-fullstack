"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductAreaTop from "../ProductAreaTop/ProductAreaTop";
import Image from "next/image";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import Link from "next/link";
import { searchProducts } from "@/app/actions/search/search.actions";
import AddToCartModal from "../FeatureProduct/AddToCartModal";
import { getProductImage } from "@/lib/helper";
import { toast } from "sonner";

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

export const toPublicUrl = (path) => {
  if (!path) return `/uploads/placeholder.png`;
  const rel = String(path).replace(/^\/+/, "");
  return `${ASSET_BASE}/${rel}`;
};

const ProductArea = ({ result: initialResult, slug, q, brands, mockups }) => {
  console.log(initialResult, "initial result");

  const initialQueryKeyRef = useRef(null);
  const didInitRef = useRef(false);

  const [result, setResult] = useState(initialResult);
  const isFirstRender = useRef(true);
  const reqIdRef = useRef(0);
  const routeKey = useMemo(() => {
    return JSON.stringify({
      q: q || null,
      slug: slug || null,
    });
  }, [q, slug]);

  const prevRouteKeyRef = useRef(routeKey);

  // UI states
  const [sortBy, setSortBy] = useState("newest"); // ✅ keep same as backend
  const [selectedGenders, setSelectedGenders] = useState([]); // MEN/WOMEN/YOUTH/ALL
  const [selectedBrands, setSelectedBrands] = useState([]); // brand names
  const [selectedCategories, setSelectedCategories] = useState([]); // mockup names
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // server pagination (cursor)
  const [cursorStack, setCursorStack] = useState([null]); // stack of cursors for Prev
  const [cursor, setCursor] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const pageSize = 12;
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (prevRouteKeyRef.current === routeKey) return;
    prevRouteKeyRef.current = routeKey;

    setResult(initialResult);
    setCursorStack([null]);
    setCursor(null);

    // ✅ route change এ server data already loaded
    setHasLoadedOnce(true);

    // ✅ lastQueryKey reset না করলে পরের filter change এ fetch আটকে যেতে পারে
    lastQueryKeyRef.current = "";
  }, [routeKey, initialResult]);

  const toggleFilter = (value, setter, state) => {
    if (state.includes(value)) setter(state.filter((v) => v !== value));
    else setter([...state, value]);
  };

  const selectGender = (g) => {
    if (g === "ALL") return setSelectedGenders(["ALL"]);
    setSelectedGenders([g]); // ✅ only one
  };

  // helper: pick one brandId / mockupName (your server supports brandId, slug)
  // If you want multi-select at DB level, you need schema + query change.
  const activeBrandId = useMemo(() => {
    if (!selectedBrands.length) return null;
    const firstName = selectedBrands[0];
    const found = brands.find((b) => b.name === firstName);
    return found?.id ?? null;
  }, [selectedBrands, brands]);

  const activeSlug = useMemo(() => {
    if (selectedCategories.length) return selectedCategories[0];
    if (slug && slug.trim()) return slug;
    return null; // ⛔ empty string নয়
  }, [selectedCategories, slug]);

  const activeFitType = useMemo(() => {
    // backend supports single fitType. If ALL selected, ignore filter.
    const cleaned = selectedGenders.filter((g) => g !== "ALL");
    return cleaned.length ? cleaned[0] : null;
  }, [selectedGenders]);

  const pickVariantForCard = (product) => {
    const vs = product?.variants || [];
    if (!vs.length) return null;

    // if user selected a gender, prefer that fitType variant
    if (activeFitType) {
      const matched = vs.find(
        (v) => String(v.fitType || "").toUpperCase() === activeFitType
      );
      if (matched) return matched;
    }

    // fallback: prefer MEN -> WOMEN -> YOUTH (or just first)
    return (
      vs.find((v) => String(v.fitType || "").toUpperCase() === "MEN") ||
      vs.find((v) => String(v.fitType || "").toUpperCase() === "WOMEN") ||
      vs.find((v) => String(v.fitType || "").toUpperCase() === "YOUTH") ||
      vs[0]
    );
  };

  const queryKey = useMemo(() => {
    return JSON.stringify({
      q: q || null,
      slug: activeSlug || null,
      brandId: activeBrandId || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      fitType: activeFitType || null,
      sort: sortBy,
      pageSize,
      cursor: null, // filter change করলে always first page
    });
  }, [
    q,
    activeSlug,
    activeBrandId,
    minPrice,
    maxPrice,
    activeFitType,
    sortBy,
    pageSize,
  ]);
  const lastQueryKeyRef = useRef("");

  // mark initial server-loaded queryKey once

  // ✅ init once (safe)
  useEffect(() => {
    if (initialQueryKeyRef.current == null) {
      initialQueryKeyRef.current = queryKey;
      lastQueryKeyRef.current = queryKey; // prevent initial fetch
      setHasLoadedOnce(true); // server already loaded
    }
  }, [queryKey]);

  // const fetchPage = (nextCursor, pushStack = true) => {
  //   startTransition(async () => {
  //     const res = await searchProducts({
  //       q: q ? String(q) : undefined,
  //       slug: activeSlug ?? undefined,
  //       brandId: activeBrandId,
  //       minPrice: minPrice || null,
  //       maxPrice: maxPrice || null,
  //       fitType: activeFitType,
  //       sort: sortBy,
  //       pageSize,
  //       cursor: nextCursor ? JSON.stringify(nextCursor) : null,
  //     });

  //     setResult(res);

  //     if (pushStack) {
  //       setCursorStack((s) => [...s, nextCursor]);
  //     }
  //     setCursor(nextCursor);
  //   });
  // };

  const fetchPage = (nextCursor, pushStack = true) => {
    const myReqId = ++reqIdRef.current;

    // ✅ capture current queryKey
    const myKey = queryKey;

    console.log("FETCH PARAMS", {
      activeFitType,
      activeSlug,
      activeBrandId,
      minPrice,
      maxPrice,
    });

    startTransition(async () => {
      const res = await searchProducts({
        q: q ? String(q) : undefined,
        slug: activeSlug ?? undefined,
        brandId: activeBrandId ?? undefined,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        fitType: activeFitType ?? undefined,
        sort: sortBy,
        pageSize,
        cursor: nextCursor ? JSON.stringify(nextCursor) : null,
      });

      // ✅ ignore stale req OR stale queryKey
      if (myReqId !== reqIdRef.current) return;
      if (myKey !== queryKey) return;

      if (!res || !Array.isArray(res.items)) return;

      setResult(res);
      setHasLoadedOnce(true);

      if (pushStack) setCursorStack((s) => [...s, nextCursor]);
      setCursor(nextCursor);
    });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // ✅ initial = server data, don't refetch
    if (queryKey === initialQueryKeyRef.current) return;

    if (lastQueryKeyRef.current === queryKey) return;
    lastQueryKeyRef.current = queryKey;

    setCursorStack([null]);
    setCursor(null);
    fetchPage(null, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  // when filters/sort change -> reset to first page

  const safeItems = result?.items || [];
  const hasMore = !!result?.hasMore;
  const nextCursor = result?.nextCursor || null;

  // UI only (local) filtering for multi-select brand/category এখনও client-side (optional)
  // কিন্তু scalable করতে চাইলে multi-select DB query দরকার।
  const itemsForGrid = useMemo(() => {
    let items = [...safeItems];

    // Multi-brand UI filter (client-side)
    if (selectedBrands.length) {
      items = items.filter((it) => selectedBrands.includes(it.brandName));
    }

    // Multi-category UI filter (client-side)
    if (selectedCategories.length) {
      items = items.filter((it) => selectedCategories.includes(it.mockupName));
    }

    return items;
  }, [safeItems, selectedBrands, selectedCategories]);

  const currentPage = cursorStack.length; // 1-based

  useEffect(() => {
    console.log(
      "activeFitType:",
      activeFitType,
      "items:",
      result?.items?.length
    );
  }, [activeFitType, result]);

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
            image: getProductImage(product),
          },
        ];
      }

      return nextFavorites; // ✅ PURE
    });

    // ✅ Side-effects AFTER render
    queueMicrotask(() => {
      localStorage.setItem("favorite_products", JSON.stringify(nextFavorites));

      if (action === "add") {
        toast.success("Added to favorites", {
          description: product.title,
        });
      } else if (action === "remove") {
        toast.success("Removed from favorites", {
          description: product.title,
        });
      }

      window.dispatchEvent(new Event("favorite-updated"));
    });
  };

  const showEmpty =
    !isPending &&
    hasLoadedOnce &&
    Array.isArray(result?.items) &&
    result.items.length === 0;

  return (
    <>
      <section className='product-area'>
        <Container fluid>
          <ProductAreaTop
            slug={activeSlug}
            q={q}
            result={result}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <div className='product-area__inner'>
            {/* Sidebar */}
            <aside className='sidebar__menu'>
              <ul className='sidebar__menu__area list-unstyled'>
                {/* Gender */}
                <li className='sidebar__menu__area__item'>
                  <a
                    href='#'
                    className='sidebar__menu__title'
                    onClick={(e) => e.preventDefault()}
                  >
                    Gender
                  </a>
                  <ul className='sidebar__menu__sub-menu list-unstyled'>
                    {["MEN", "WOMEN", "ALL"].map((g) => (
                      <li className='checkbox' key={g}>
                        <input
                          type='checkbox'
                          id={`gender-${g}`}
                          checked={selectedGenders.includes(g)}
                          // onChange={() =>
                          //   toggleFilter(g, setSelectedGenders, selectedGenders)
                          // }
                          onChange={() => selectGender(g)}
                        />
                        <label htmlFor={`gender-${g}`}>
                          <span></span>
                          {g.charAt(0) + g.slice(1).toLowerCase()}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Price */}
                <li className='sidebar__menu__area__item'>
                  <a
                    href='#'
                    className='sidebar__menu__title'
                    onClick={(e) => e.preventDefault()}
                  >
                    Price Range
                  </a>
                  <ul className='sidebar__menu__sub-menu list-unstyled'>
                    <li className='price-input-box'>
                      <div className='price-input'>
                        <select>
                          <option>TK</option>
                        </select>
                        <input
                          type='number'
                          placeholder='Minimum price'
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                      </div>
                    </li>
                    <li className='price-input-box'>
                      <div className='price-input'>
                        <select>
                          <option>TK</option>
                        </select>
                        <input
                          type='number'
                          placeholder='Maximum price'
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>
                    </li>
                  </ul>
                </li>

                {/* Category */}
                <li className='sidebar__menu__area__item'>
                  <a
                    href='#'
                    className='sidebar__menu__title'
                    onClick={(e) => e.preventDefault()}
                  >
                    Category
                  </a>
                  <ul className='sidebar__menu__sub-menu list-unstyled'>
                    {mockups.map((m) => (
                      <li className='checkbox' key={m.id}>
                        <input
                          type='checkbox'
                          id={`cat-${m.id}`}
                          checked={selectedCategories.includes(m.name)}
                          onChange={() =>
                            toggleFilter(
                              m.name,
                              setSelectedCategories,
                              selectedCategories
                            )
                          }
                        />
                        <label htmlFor={`cat-${m.id}`}>
                          <span></span>
                          {m.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Brand */}
                <li className='sidebar__menu__area__item'>
                  <a
                    href='#'
                    className='sidebar__menu__title'
                    onClick={(e) => e.preventDefault()}
                  >
                    Brand Name
                  </a>
                  <ul className='sidebar__menu__sub-menu list-unstyled'>
                    {brands.map((b) => (
                      <li className='checkbox' key={b.id}>
                        <input
                          type='checkbox'
                          id={`brand-${b.id}`}
                          checked={selectedBrands.includes(b.name)}
                          onChange={() =>
                            toggleFilter(
                              b.name,
                              setSelectedBrands,
                              selectedBrands
                            )
                          }
                        />
                        <label htmlFor={`brand-${b.id}`}>
                          <span></span>
                          {b.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </aside>

            {/* Grid */}
            <div className='product-area__content'>
              {isPending && <p style={{ padding: 8 }}>Loading...</p>}

              <Row className='gutter-y-32 gutter-x-32'>
                {itemsForGrid.length > 0
                  ? itemsForGrid.map((item) => {
                      const cardVariant = pickVariantForCard(item);

                      // ✅ Prefer signed URLs from server
                      const imgUrl =
                        cardVariant?.frontImgUrl ||
                        cardVariant?.backImgUrl ||
                        null;

                      // fallback: if you still sometimes get keys (optional)
                      const imgKey =
                        cardVariant?.frontImg || cardVariant?.backImg || null;

                      const finalSrc =
                        imgUrl ||
                        (imgKey ? toPublicUrl(imgKey) : "/placeholder.png");
                      const isFavorite = favorites.some(
                        (p) => p.id === item.id
                      );

                      return (
                        <Col xl={3} lg={4} md={6} key={item.id}>
                          <div className='product__item'>
                            <div className='product__item__img'>
                              <Link
                                href={`/products/${item?.productId}`}
                                className='product__item__img__item d-block'
                              >
                                <Image
                                  src={finalSrc}
                                  alt={item.title || "product image"}
                                  width={300}
                                  height={300}
                                />
                              </Link>
                              {/* <div className='product__item__btn'>
                                <a href='#' onClick={(e) => e.preventDefault()}>
                                  <i className='far fa-heart'></i>
                                </a>
                              </div> */}
                              <div
                                className='product__item__btn position-absolute top-0 end-0 p-3'
                                style={{ cursor: "pointer" }}
                                onClick={() => toggleFavorite(item)}
                              >
                                <div
                                  className={`heart ${
                                    isFavorite ? "active" : ""
                                  }`}
                                >
                                  <i
                                    className={
                                      isFavorite
                                        ? "far fa-heart"
                                        : "far fa-heart"
                                    }
                                  ></i>
                                </div>
                              </div>
                            </div>

                            <div className='product__item__content'>
                              <p className='product__item__brand'>
                                Brand:{" "}
                                <a href='#' onClick={(e) => e.preventDefault()}>
                                  {item.brandName || "N/A"}
                                </a>
                              </p>

                              <h4 className='product__item__title'>
                                <Link href={`/products/${item.productId}`}>
                                  {item.title}
                                </Link>
                              </h4>

                              <div className='product__item__box'>
                                <div className='product__item__price'>
                                  ৳ {item.price}
                                </div>
                              </div>

                              <button
                                className='commerce-btn product__item__link mt-2'
                                onClick={() => {
                                  setSelectedProduct({
                                    ...item,
                                    _preferredFit: activeFitType,
                                  });
                                  setShowModal(true);
                                }}
                              >
                                Add to Cart <i className='icon-right-arrow'></i>
                              </button>
                            </div>
                          </div>
                        </Col>
                      );
                    })
                  : showEmpty && <p>No products found.</p>}
              </Row>

              {/* Pagination (cursor-based) */}
              <div className='post-pagination' style={{ marginTop: 24 }}>
                <button
                  className='previous'
                  disabled={cursorStack.length <= 1 || isPending}
                  onClick={() => {
                    // pop current cursor and go back
                    setCursorStack((s) => {
                      if (s.length <= 1) return s;
                      const next = s.slice(0, -1);
                      const prevCursor = next[next.length - 1] || null;
                      fetchPage(prevCursor, false);
                      return next;
                    });
                  }}
                >
                  <i className='icon-left-arrow'></i> Previous
                </button>

                <span style={{ padding: "0 12px" }}>Page {currentPage}</span>

                <button
                  className='next'
                  disabled={!hasMore || isPending}
                  onClick={() => {
                    fetchPage(nextCursor, true);
                  }}
                >
                  Next <i className='icon-right-arrow'></i>
                </button>
              </div>

              <RelatedProducts />
            </div>
          </div>
        </Container>
      </section>

      {selectedProduct && (
        <AddToCartModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default ProductArea;
