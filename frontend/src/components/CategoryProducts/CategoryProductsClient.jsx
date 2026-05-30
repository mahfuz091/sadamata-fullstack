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
import AddToCartModal from "../FeatureProduct/AddToCartModal";
import { toast } from "sonner";


// âœ… ProductArea clone, but uses loadMoreAction (page-based)
const CategoryProductsClient = ({
  initialItems,
  initialPage,
  totalPages,
  loadMoreAction,
  category,
  slug,
  q,
  brands = [],
  mockups = [],
  relatedProducts = [],
}) => {
  // normalize initialResult like ProductArea expects
  const initialResult = useMemo(
    () => ({
      items: initialItems || [],
      page: initialPage || 1,
      totalPages: totalPages || 1,
      found: true,
    }),
    [initialItems, initialPage, totalPages]
  );

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
  const [sortBy, setSortBy] = useState("newest"); // âœ… keep same as backend
  const [selectedGenders, setSelectedGenders] = useState([]); // MEN/WOMEN/YOUTH/ALL
  const [selectedBrands, setSelectedBrands] = useState([]); // brand names
  const [selectedCategories, setSelectedCategories] = useState([]); // mockup names
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // pagination (page-based) but keep ProductArea structure
  const [cursorStack, setCursorStack] = useState([1]); // stack of pages for Prev
  const [cursor, setCursor] = useState(1);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const pageSize = 24;
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  useEffect(() => {
    if (prevRouteKeyRef.current === routeKey) return;
    prevRouteKeyRef.current = routeKey;

    setResult(initialResult);
    setCursorStack([1]);
    setCursor(1);

    setHasLoadedOnce(true);
    lastQueryKeyRef.current = "";
  }, [routeKey, initialResult]);

  const toggleFilter = (value, setter, state) => {
    if (state.includes(value)) setter(state.filter((v) => v !== value));
    else setter([...state, value]);
  };

  const selectGender = (g) => {
    if (g === "ALL") return setSelectedGenders(["ALL"]);
    setSelectedGenders([g]); // âœ… only one
  };

  const activeBrandId = useMemo(() => {
    if (!selectedBrands.length) return null;
    const firstName = selectedBrands[0];
    const found = brands.find((b) => b.name === firstName);
    return found?.id ?? null;
  }, [selectedBrands, brands]);

  const activeSlug = useMemo(() => {
    // âœ… for category page: prefer route slug always
    if (slug && slug.trim()) return slug;
    return null;
  }, [slug]);

  const activeFitType = useMemo(() => {
    const cleaned = selectedGenders.filter((g) => g !== "ALL");
    return cleaned.length ? cleaned[0] : null;
  }, [selectedGenders]);

  const pickVariantForCard = (product) => {
    const vs = product?.variants || [];
    if (!vs.length) return null;

    const pickImageVariant = (variants) =>
      variants.find(
        (v) =>
          String(v.color || "").toLowerCase() === "#000" &&
          (v.frontImg || v.backImg)
      ) ||
      variants.find((v) => v.frontImg || v.backImg) ||
      variants[0] ||
      null;

    if (activeFitType) {
      const matchedFitVariants = vs.filter(
        (v) => String(v.fitType || "").toUpperCase() === activeFitType
      );
      const matched = pickImageVariant(matchedFitVariants);
      if (matched) return matched;
    }

    const preferredFits = ["MEN", "WOMEN", "YOUTH"];
    for (const fitType of preferredFits) {
      const matched = pickImageVariant(
        vs.filter((v) => String(v.fitType || "").toUpperCase() === fitType)
      );
      if (matched) return matched;
    }

    return pickImageVariant(vs);
  };

  const getCardImage = (product) => {
    const selectedVariant = pickVariantForCard(product);
    return (
      selectedVariant?.frontImgUrl ||
      selectedVariant?.backImgUrl ||
      product?.previewUrl ||
      "/placeholder.png"
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
      page: 1, // filter change always goes to first
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

  // âœ… init once (server already loaded)
  useEffect(() => {
    if (initialQueryKeyRef.current == null) {
      initialQueryKeyRef.current = queryKey;
      lastQueryKeyRef.current = queryKey;
      setHasLoadedOnce(true);
    }
  }, [queryKey]);

  const fetchPage = (nextPage, pushStack = true) => {
    const myReqId = ++reqIdRef.current;
    const myKey = queryKey;

    startTransition(async () => {
      const form = new FormData();
      form.append("nextPage", String(nextPage));

      // âœ… send filters same as ProductArea (server must support these)
      form.append("q", q || "");
      form.append("sort", sortBy);
      form.append(
        "fitType",
        JSON.stringify(activeFitType ? [activeFitType] : [])
      );
      form.append("colors", JSON.stringify([]));
      form.append("brandId", activeBrandId || "");
      form.append("minPrice", minPrice || "");
      form.append("maxPrice", maxPrice || "");

      const res = await loadMoreAction(null, form);

      if (myReqId !== reqIdRef.current) return;
      if (myKey !== queryKey) return;
      if (!res || !Array.isArray(res.items)) return;

      setResult({
        ...res,
        items: res.items || [],
        page: res.page || nextPage,
        totalPages: res.totalPages || 1,
      });

      setHasLoadedOnce(true);

      if (pushStack) setCursorStack((s) => [...s, nextPage]);
      setCursor(nextPage);
    });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (queryKey === initialQueryKeyRef.current) return;

    if (lastQueryKeyRef.current === queryKey) return;
    lastQueryKeyRef.current = queryKey;

    setCursorStack([1]);
    setCursor(1);
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const safeItems = result?.items || [];
  const currentPage = cursorStack.length; // 1-based like ProductArea
  const tp = result?.totalPages || 1;

  const hasMore = (result?.page || 1) < tp;
  const nextPage = (result?.page || 1) + 1;

  const itemsForGrid = useMemo(() => {
    let items = [...safeItems];

    if (selectedCategories.length) {
      items = items.filter((it) => selectedCategories.includes(it.mockupName));
    }

    return items;
  }, [safeItems, selectedCategories]);

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
      localStorage.setItem("favorite_products", JSON.stringify(nextFavorites));

      if (action === "add") {
        toast.success("Added to favorites", { description: product.title });
      } else if (action === "remove") {
        toast.success("Removed from favorites", { description: product.title });
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
            onOpenFilter={() => setFilterOpen(true)}
          />

          <div className='product-area__inner'>
            {/* Sidebar */}
            <div
              className={`sidebar__overlay ${filterOpen ? "is-open" : ""}`}
              onClick={() => setFilterOpen(false)}
            />
            <aside className={`sidebar__menu ${filterOpen ? "is-open" : ""}`}>
              <div className='sidebar__menu__head'>
                <span>Filters</span>
                <button
                  type='button'
                  className='sidebar__menu__close'
                  aria-label='Close filters'
                  onClick={() => setFilterOpen(false)}
                >
                  <i className='fas fa-times'></i>
                </button>
              </div>
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

                {/* Category (optional UI list) */}
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
                            setSelectedBrands((current) =>
                              current.includes(b.name) ? [] : [b.name]
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
                      const cardImage = getCardImage(item);
                      const isFavorite = favorites.some(
                        (p) => p.id === item.id
                      );
                      const brandId = item?.Brand?.id || item?.brandId || null;
                      const brandName = item?.Brand?.name || item?.brandName || "";


                      return (
                        <Col xl={3} lg={4} md={6} xs={6} key={item.id}>
                          <div className='product__item'>
                            <div className='product__item__img'>
                              <Link
                                href={`/products/${item?.productId}`}
                                className='product__item__img__item d-block'
                              >
                                <Image
                                  src={cardImage}
                                  alt={item.title || "product image"}
                                  width={300}
                                  height={300}
                                />
                              </Link>

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
                                  <i className='far fa-heart'></i>
                                </div>
                              </div>
                            </div>

                            <div className='product__item__content'>
                              {brandName && (
                                <p className='product__item__brand'>
                                  Brand:{" "}
                                  <span>
                                    {brandId ? (
                                      <Link
                                        href={`/brand/${brandId}`}
                                        className='category-products__brand-link'
                                      >
                                        {brandName}
                                      </Link>
                                    ) : (
                                      brandName
                                    )}
                                  </span>
                                </p>
                              )}

                              <h4 className='product__item__title'>
                                <Link href={`/products/${item.productId}`}>
                                  {item.title}
                                </Link>
                              </h4>

                              <div className='product__item__box'>
                                <div className='product__item__price'>
                                  ৳{Number(item.price || 0).toFixed(2)}
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
                                Add to Cart 
                              </button>
                            </div>
                          </div>
                        </Col>
                      );
                    })
                  : showEmpty && <p>No products found.</p>}
              </Row>

              {/* Pagination (page-based but same UI) */}
              <div className='post-pagination' style={{ marginTop: 24 }}>
                <button
                  className='previous'
                  disabled={cursorStack.length <= 1 || isPending}
                  onClick={() => {
                    setCursorStack((s) => {
                      if (s.length <= 1) return s;
                      const next = s.slice(0, -1);
                      const prevPage = next[next.length - 1] || 1;
                      fetchPage(prevPage, false);
                      return next;
                    });
                  }}
                >
                   Previous
                </button>

                <span style={{ padding: "0 12px" }}>Page {currentPage}</span>

                <button
                  className='next'
                  disabled={!hasMore || isPending}
                  onClick={() => {
                    fetchPage(nextPage, true);
                  }}
                >
                  Next 
                </button>
              </div>

              <RelatedProducts
                products={relatedProducts}
                title="Related Product"
                seeAllHref={category?.slug ? `/categories/${category.slug}` : "/products"}
              />
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

export default CategoryProductsClient;


