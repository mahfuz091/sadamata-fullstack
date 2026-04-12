// ✅ FULL Brand Analyze CLIENT component
// ✅ Styling/markup unchanged (only functionality added)
// ✅ Scroll ONLY when page changes (prev/next). No scroll on search/date/pageSize.
// Requirements: npm i react-datepicker
// Add once globally (or keep here): import "react-datepicker/dist/react-datepicker.css";

"use client";

import React, { useTransition, useState, useRef, useEffect } from "react";
import DashSidebar from "../DashSidebar/DashSidebar";
import cartImg from "@/assets/images/products/cart.png";
import Image from "next/image";
import CustomSelect from "../CustomSelect/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

function formatCurrencyAmount(value) {
  return Number(value || 0).toFixed(2);
}

const options = [
  { value: "chocolate", label: "Marketplace: All" },
  { value: "strawberry", label: "Marketplace: All" },
  { value: "vanilla", label: "Marketplace: All" },
];

function toYMD(d) {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const Analyze = ({
  initialItems,
  initialPage = 1,
  totalPages,
  loadMoreAction,
  summery,
}) => {
  const tableTopRef = useRef(null);
  const hasMountedSearchRef = useRef(false);

  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(12);
  const [isPending, startTransition] = useTransition();

  // ✅ filters
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // ✅ server fetch helper
  const fetchPage = (nextPage, nextSize = pageSize, opts = {}) => {
    const fd = new FormData();
    fd.set("page", String(nextPage));
    fd.set("pageSize", String(nextSize));

    const df = opts.dateFrom ?? toYMD(fromDate);
    const dt = opts.dateTo ?? toYMD(toDate);
    const st = (opts.searchTerm ?? searchTerm).trim();

    if (df) fd.set("dateFrom", df);
    if (dt) fd.set("dateTo", dt);
    if (st) fd.set("searchTerm", st);

    const shouldScroll = opts.scroll === true; // ✅ only when true

    startTransition(async () => {
      const res = await loadMoreAction(undefined, fd);
      setItems(res.items);
      setPage(res.page);

      if (shouldScroll) {
        requestAnimationFrame(() => {
          tableTopRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    });
  };

  // ✅ date change -> refetch page 1 (NO scroll)
  useEffect(() => {
    fetchPage(1, pageSize, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  useEffect(() => {
    if (!hasMountedSearchRef.current) {
      hasMountedSearchRef.current = true;
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchPage(1, pageSize, { scroll: false, searchTerm });
    }, 150);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
  return (
    <section className="dashboard-area section-space">
      <div className="container">
        <div className="row gutter-x-40">
          <div className="col-lg-3">
            <DashSidebar />
          </div>
          <div className="col-lg-9">
            <div className="dashboard-area__content">
              <div className="dashboard-area__top">
                <h2 className="dashboard-area__title">
                  Analyze product purchases
                </h2>

                <div className="date-range">
                  <label htmlFor="from">From</label>
                  <div className="date-group">
                    <i className="fas fa-calendar-alt icon"></i>
                    <DatePicker
                      selected={fromDate}
                      onChange={(d) => setFromDate(d)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd-mm-yyyy"
                      maxDate={toDate || undefined}
                      isClearable
                      id="from"
                    />
                  </div>

                  <label htmlFor="to">To</label>
                  <div className="date-group">
                    <i className="fas fa-calendar-alt icon"></i>
                    <DatePicker
                      selected={toDate}
                      onChange={(d) => setToDate(d)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd-mm-yyyy"
                      minDate={fromDate || undefined}
                      isClearable
                      id="to"
                    />
                  </div>
                </div>
              </div>

              <div className="dashboard-area__earnings">
                <div className="row gutter-x-10 gutter-y-30">
                  <div className="col-lg-6 col-xl-4 col-md-4 col-sm-6">
                    <div className="earnings-card">
                      <h3 className="earnings-card__title">BDT (Balance)</h3>
                      <div className="earnings-card__main">
                        <div className="earnings-card__item">
                          <h4 className="earnings-card__count">
                            {summery?.totalProductsSold}
                          </h4>
                          <p className="earnings-card__text">Purchased</p>
                        </div>
                        <div className="earnings-card__price">
                          <h4 className="earnings-card__count">
                            ৳{formatCurrencyAmount(summery?.totalAfterWithdraw)}{" "}
                          </h4>
                          <p className="earnings-card__text">
                            Estimated Royalties
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-xl-4 col-md-4 col-sm-6">
                    <div className="earnings-card">
                      <h3 className="earnings-card__title">Total income</h3>
                      <div className="earnings-card__main">
                        <div className="earnings-card__item">
                          <h4 className="earnings-card__count">
                            {summery?.totalProductsSold}
                          </h4>
                          <p className="earnings-card__text">Purchased</p>
                        </div>
                        <div className="earnings-card__price">
                          <h4 className="earnings-card__count">
                            ৳{formatCurrencyAmount(summery?.brandTotalIncome)}{" "}
                          </h4>
                          <p className="earnings-card__text">
                            Estimated Royalties
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-xl-4 col-md-4 col-sm-6">
                    <div className="earnings-card">
                      <h3 className="earnings-card__title">
                        Withdrawal amount
                      </h3>
                      <div className="earnings-card__main">
                        <div className="earnings-card__price">
                          <h4 className="earnings-card__count">
                            ৳{formatCurrencyAmount(summery?.withdrawAmount)}{" "}
                          </h4>
                          <p className="earnings-card__text">
                            Estimated Royalties
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-area__tabel-box">
                <div className="filter-section">
                  <div className="filter-section__left">
                    <div className="filter-item">
                      <CustomSelect options={options} />
                    </div>
                  </div>

                  <div className="filter-item">
                    <div className="filter-item__search">
                      <input
                        type="text"
                        name="text"
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => fetchPage(1, pageSize, { scroll: false, searchTerm })}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="dashboard-area__tabel" ref={tableTopRef}>
                  <table className="" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th><div className="sort-item-two"><span>SL</span></div></th>
                        <th><div className="sort-item-two"><span>Title</span></div></th>
                        <th><div className="sort-item-two"><span>Brand</span></div></th>
                        <th><div className="sort-item-two"><span>Purchased</span></div></th>
                        <th><div className="sort-item-two"><span>Cancelled</span></div></th>
                        <th><div className="sort-item-two"><span>Returned</span></div></th>
                        <th><div className="sort-item-two"><span>Revenue</span></div></th>
                        <th><div className="sort-item-two"><span>Royalties</span></div></th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td><div className="ps-2">{index + 1}</div></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Image
                                src={
                                  item.previewUrl ||
                                  (item.previewImg
                                    ? `${ASSET_BASE}${item.previewImg}`
                                    : cartImg)
                                }
                                alt="Product Image"
                                className="product-image me-2"
                                width={50}
                                height={60}
                              />
                              {item.title}
                            </div>
                          </td>
                          <td><div className="ps-2">{item.brandName}</div></td>
                          <td><div className="ps-2">{item.purchasedQty}</div></td>
                          <td><div className="ps-2">{item.cancelledQty}</div></td>
                          <td><div className="ps-2">{item.returnedQty}</div></td>
                          <td><div className="ps-2">{item.revenue}</div></td>
                          <td><div className="ps-2">{item.royalties}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      fetchPage(Math.max(1, page - 1), pageSize, { scroll: true })
                    }
                    disabled={page <= 1 || isPending}
                    className="pagination-btn"
                  >
                    ‹
                  </button>

                  <button type="button" className="pagination-btn active" disabled>
                    {page}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      fetchPage(Math.min(totalPages, page + 1), pageSize, { scroll: true })
                    }
                    disabled={page >= totalPages || isPending}
                    className="pagination-btn"
                  >
                    ›
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">results per page</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      setPageSize(n);
                      fetchPage(1, n, { scroll: false });
                    }}
                    disabled={isPending}
                    className="per-page-select"
                  >
                    {[10, 12, 15, 20, 30, 50].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analyze;



