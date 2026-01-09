"use client";

import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";

const customStyles = {
  container: (base) => ({ ...base, width: "100%" }),
  control: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    "&:hover": { border: "none" },
  }),
  indicatorSeparator: () => null,
  option: (base, state) => ({
    ...base,
    backgroundColor:
      state.isFocused || state.isSelected ? "var(--commerce-base)" : "white",
    color: state.isFocused || state.isSelected ? "white" : "black",
    borderBottom: "1px solid grey",
  }),
};

const HISTORY_KEY = "search_history_v1";
const MAX_HISTORY = 8;

const readHistory = () => {
  if (typeof window === "undefined") return [];
  try {
    const arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const writeHistory = (q) => {
  if (typeof window === "undefined") return;
  const query = (q || "").trim();
  if (!query) return;

  const existing = readHistory();
  const next = [query, ...existing.filter((x) => x !== query)].slice(
    0,
    MAX_HISTORY
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
};

const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
};

export default function SearchBar({ options = [] }) {
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");

  const [sug, setSug] = useState({
    queries: [],
    products: [],
    brands: [],
    categories: [],
  });

  const [openSug, setOpenSug] = useState(false);
  const [loadingSug, setLoadingSug] = useState(false);

  const placeholder = useMemo(() => "All", []);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  // ✅ remove single history item
  const removeHistoryItem = (item) => {
    const next = readHistory().filter((x) => x !== item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setHistory(next);
  };

  const goSearch = (q, slug) => {
    const query = (q || "").trim();
    if (!query) return;

    writeHistory(query);
    setHistory(readHistory());

    const sp = new URLSearchParams();
    sp.set("q", query);
    if (slug) sp.set("slug", slug);

    setOpenSug(false);
    router.push(`/products?${sp.toString()}`); // change to /search if needed
  };

  const debouncedFetch = useMemo(() => {
    let t;
    return (q, slug) => {
      clearTimeout(t);
      t = setTimeout(async () => {
        const query = (q || "").trim();

        // ✅ keep dropdown open for history when empty
        if (!query) {
          setSug({ queries: [], products: [], brands: [], categories: [] });
          setOpenSug(true);
          return;
        }

        try {
          setLoadingSug(true);

          const res = await fetch(
            `/api/search/suggest?q=${encodeURIComponent(
              query
            )}&slug=${encodeURIComponent(slug || "")}`,
            { cache: "no-store" }
          );

          const ct = res.headers.get("content-type") || "";
          if (!res.ok || !ct.includes("application/json")) {
            const txt = await res.text();
            console.log("SUGGEST API NON-JSON:", res.status, txt.slice(0, 200));
            setSug({ queries: [], products: [], brands: [], categories: [] });
            setOpenSug(true);
            return;
          }

          const data = await res.json();
          setSug({
            queries: data?.queries ?? [],
            products: data?.products ?? [],
            brands: data?.brands ?? [],
            categories: data?.categories ?? [],
          });
          setOpenSug(true);
        } catch (e) {
          console.error(e);
          setSug({ queries: [], products: [], brands: [], categories: [] });
          setOpenSug(true);
        } finally {
          setLoadingSug(false);
        }
      }, 250);
    };
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      const el = e.target;
      if (el.closest?.(".searchbar-wrap")) return;
      setOpenSug(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const shouldShowDropdown = useMemo(() => {
    return Boolean(
      openSug &&
        (loadingSug ||
          history.length ||
          sug.queries.length ||
          sug.products.length ||
          sug.brands.length ||
          sug.categories.length)
    );
  }, [
    openSug,
    loadingSug,
    history.length,
    sug.queries.length,
    sug.products.length,
    sug.brands.length,
    sug.categories.length,
  ]);

  return (
    <div className='main-header__search-box'>
      <div className='main-header__search searchbar-wrap'>
        <div className='main-header__search__input-box'>
          <Select
            instanceId='category-select'
            options={options}
            value={selected}
            onChange={(opt) => setSelected(opt)}
            styles={customStyles}
            components={{ IndicatorSeparator: () => null }}
            isClearable
            isSearchable
            placeholder={placeholder}
          />
        </div>

        <div
          className='main-header__search__input-box'
          style={{ position: "relative" }}
        >
          <input
            type='text'
            name='text'
            placeholder='Search your products'
            value={text}
            autoComplete='off'
            onChange={(e) => {
              const v = e.target.value;
              setText(v);

              if (!v.trim()) {
                setSug({
                  queries: [],
                  products: [],
                  brands: [],
                  categories: [],
                });
                setOpenSug(true);
                return;
              }

              debouncedFetch(v, selected?.value);
            }}
            onFocus={() => {
              setHistory(readHistory());
              setOpenSug(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                goSearch(text, selected?.value);
              }
              if (e.key === "Escape") setOpenSug(false);
            }}
          />

          <button
            type='button'
            className='main-header__search__button'
            onClick={() => goSearch(text, selected?.value)}
          >
            <i className='fas fa-search'></i>
          </button>

          {shouldShowDropdown && (
            <div className='search-suggest-dropdown'>
              {loadingSug ? (
                <div className='sug-loading'>Loading...</div>
              ) : (
                <>
                  {/* ✅ Recent Search History */}
                  {history.length > 0 && (
                    <>
                      <div
                        className='sug-title'
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Recent searches</span>
                        <button
                          type='button'
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            clearHistory();
                            setHistory([]);
                          }}
                        >
                          Clear
                        </button>
                      </div>

                      {history.map((h) => (
                        <div
                          key={`history-${h}`}
                          className='sug-row'
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setText(h);
                            goSearch(h, selected?.value);
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <i className='fas fa-clock'></i>
                            <span>{h}</span>
                          </div>

                          {/* ✅ Remove single item (X) */}
                          <button
                            type='button'
                            aria-label='Remove'
                            title='Remove'
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation(); // prevent triggering search
                              removeHistoryItem(h);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 16,
                              lineHeight: 1,
                              padding: "2px 6px",
                              opacity: 0.7,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Queries */}
                  {sug.queries.map((q) => (
                    <div
                      key={`q-${q}`}
                      className='sug-row'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setText(q);
                        goSearch(q, selected?.value);
                      }}
                    >
                      <i className='fas fa-search'></i> {q}
                    </div>
                  ))}

                  {/* Products */}
                  {sug.products.map((p) => (
                    <div
                      key={p.id}
                      className='sug-row'
                      onMouseDown={(e) => e.preventDefault()}
                      //   onClick={() => {
                      //     setOpenSug(false);
                      //     router.push(`/product/${p.slug}`);
                      //   }}
                      onClick={() => {
                        setText(p.title);
                        goSearch(p.title, selected?.value);
                      }}
                    >
                      {p.thumb ? (
                        <img
                          src={p.thumb}
                          className='sug-thumb'
                          alt=''
                          loading='lazy'
                        />
                      ) : (
                        <div className='sug-thumb-fallback'>
                          <i className='fas fa-box'></i>
                        </div>
                      )}
                      <span>{p.title}</span>
                    </div>
                  ))}

                  {/* Brands */}
                  {sug.brands.length > 0 && (
                    <div className='sug-title'>Brands</div>
                  )}
                  {sug.brands.map((b) => (
                    <div
                      key={b.id}
                      className='sug-row'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setOpenSug(false);
                        router.push(`/brand/${encodeURIComponent(b.slug)}`);
                      }}
                    >
                      🏷️ {b.name}
                    </div>
                  ))}

                  {/* Categories */}
                  {sug.categories.length > 0 && (
                    <div className='sug-title'>Categories</div>
                  )}
                  {sug.categories.map((c) => (
                    <div
                      key={c.id}
                      className='sug-row'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setOpenSug(false);
                        router.push(`/category/${encodeURIComponent(c.slug)}`);
                      }}
                    >
                      📦 {c.name}
                    </div>
                  ))}

                  {/* See all */}
                  {text.trim() && (
                    <div
                      className='sug-seeall'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goSearch(text, selected?.value)}
                    >
                      See all results for “{text}”
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
