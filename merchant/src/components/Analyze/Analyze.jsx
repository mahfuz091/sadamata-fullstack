"use client";
import React, { useTransition, useState, useRef } from "react";
import DashSidebar from "../DashSidebar/DashSidebar";

import CustomSelect from "../CustomSelect/CustomSelect";
import { Spinner } from "react-bootstrap";
import Link from "next/link";
import { getPrivateUrl } from "@/lib/s3";
const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL;
const options = [
  { value: "chocolate", label: "Marketplace: All" },
  { value: "strawberry", label: "Marketplace: All" },
  { value: "vanilla", label: "Marketplace: All" },
];
const SIGN_EXPIRES = 60 * 60; // 1 hour
const Analyze = ({
  initialItems,
  initialPage = 1,
  totalPages,
  loadMoreAction,
  summery,
}) => {
    const tableTopRef = useRef(null);
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(15);
  const [isPending, startTransition] = useTransition();
  const [showSpinner, setShowSpinner] = useState(false);
  // console.log(initialItems, "initialItems");

  const hasMore = page < totalPages;

  // async function onLoadMore() {
  //   if (!hasMore) return;
  //   const fd = new FormData();
  //   fd.set("nextPage", String(page + 1));
  //   startTransition(async () => {
  //     const res = await loadMoreAction(undefined, fd);
  //     setItems((prev) => [...prev, ...res.items]);
  //     setPage(res.page);
  //   });
  // }
  async function onLoadMore() {
    if (!hasMore || isPending) return;

    const formData = new FormData();
    formData.set("nextPage", String(page + 1));

    setShowSpinner(true);
    const startTime = Date.now();

    startTransition(async () => {
      const res = await loadMoreAction(undefined, formData);

      setItems((prev) => [...prev, ...res.items]);
      setPage(res.page);

      // ensure spinner shows at least 1.5s
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1500 - elapsed, 0);

      setTimeout(() => {
        setShowSpinner(false);
      }, remaining);
    });
  }
  const fetchPage = (nextPage, nextSize = pageSize) => {
  const fd = new FormData();
  fd.set("page", String(nextPage));
  fd.set("pageSize", String(nextSize));

  startTransition(async () => {
    const res = await loadMoreAction(undefined, fd);
    setItems(res.items);   // ✅ replace, not append
    setPage(res.page);

     requestAnimationFrame(() => {
      tableTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
};


  console.log(items);

  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>
          <div className='col-lg-9'>
            <div className='dashboard-area__content'>
              <div className='dashboard-area__top'>
                <h2 className='dashboard-area__title'>
                  Analyze product purchases
                </h2>
                <div className='date-range'>
                  <label htmlFor='from'>From</label>
                  <div className='date-group'>
                    <i className='fas fa-calendar-alt icon'></i>
                    <input type='date' id='from' placeholder='dd-mm-yyyy' />
                  </div>
                  <label htmlFor='to'>To</label>
                  <div className='date-group'>
                    <i className='fas fa-calendar-alt icon'></i>
                    <input type='date' id='to' placeholder='dd-mm-yyyy' />
                  </div>
                </div>
              </div>
              <div className='dashboard-area__earnings'>
                <div className='row gutter-x-10 gutter-y-30'>
                  <div className='col-lg-6 col-xl-4 col-md-4 col-sm-6'>
                    <div className='earnings-card'>
                      <h3 className='earnings-card__title'>BDT (Balance)</h3>
                      <div className='earnings-card__main'>
                        <div className='earnings-card__item'>
                          <h4 className='earnings-card__count'>
                            {summery?.totalProductsSold}
                          </h4>
                          <p className='earnings-card__text'>Purchased</p>
                        </div>
                        <div className='earnings-card__price'>
                          <h4 className='earnings-card__count'>
                            ৳{summery?.totalAfterWithdraw}{" "}
                          </h4>
                          <p className='earnings-card__text'>
                            Estimated Royalties
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6 col-xl-4 col-md-4 col-sm-6'>
                    <div className='earnings-card'>
                      <h3 className='earnings-card__title'>Total income</h3>
                      <div className='earnings-card__main'>
                        <div className='earnings-card__item'>
                          <h4 className='earnings-card__count'>
                            {summery?.totalProductsSold}
                          </h4>
                          <p className='earnings-card__text'>Purchased</p>
                        </div>
                        <div className='earnings-card__price'>
                          <h4 className='earnings-card__count'>
                            ৳{summery?.merchantTotalIncome}{" "}
                          </h4>
                          <p className='earnings-card__text'>
                            Estimated Royalties
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6 col-xl-4 col-md-4 col-sm-6'>
                    <div className='earnings-card'>
                      <h3 className='earnings-card__title'>
                        Withdrawal amount
                      </h3>
                      <div className='earnings-card__main'>
                        <div className='earnings-card__price'>
                          <h4 className='earnings-card__count'>
                            ৳{summery?.withdrawAmount}{" "}
                          </h4>
                          <p className='earnings-card__text'>
                            Estimated Royalties
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='dashboard-area__tabel-box'>
                <div className='filter-section'>
                  <div className='filter-section__left'>
                    <div className='filter-item'>
                      <CustomSelect
                        options={options}
                        instanceId='dashboard-analyze'
                      />
                    </div>
                  </div>
                  <div className='filter-item'>
                    <div className='filter-item__search'>
                      <input type='text' name='text' placeholder='Search' />
                      <button type='submit'>
                        <i className='fas fa-search'></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className='dashboard-area__tabel' ref={tableTopRef}>
                  <table className='' style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>
                          <div className='sort-item-two'>
                            <span>SL</span>
                          </div>
                        </th>
                        <th>
                          <div className='sort-item-two'>
                            <span>Title</span>
                          </div>
                        </th>
                        <th>
                          <div className='sort-item-two'>
                            <span>Brand</span>
                          </div>
                        </th>
                        <th>
                          <div className='sort-item-two'>
                            <span>Purchased</span>
                          </div>
                        </th>
                        <th>
                          <div className='sort-item-two'>
                            <span>Cancelled</span>
                          </div>
                        </th>
                        <th>
                          <div className='sort-item-two'>
                            <span>Returned</span>
                          </div>
                        </th>
                        <th>
                          <div className='sort-item-two'>
                            <span>Revenue</span>
                          </div>
                        </th>
                        <th>
                          <div className='sort-item-two'>
                            <span>Royalties</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className='ps-2'>{index + 1}</div>
                          </td>
                          <td>
                            <div className='d-flex align-items-center gap-2'>
                              {/* <Image
                                src={item?.previewImg}
                                alt={item.title}
                                width={50}
                                height={60}
                              /> */}
                              <img
                                // src={`${process.env.NEXT_PUBLIC_BASE_URL}/${item?.previewImg}`}
                                src={item.previewUrl || "/placeholder.png"}
                                alt={item.title}
                                className='product-image me-2'
                                width={80}
                                height={80}
                              />
                              {item.isActive ? (
                                <Link
                                  href={`${MAIN_URL}/products/${item?.productId}`}
                                  target='_blank'
                                >
                                  <span>{item?.title}</span>
                                </Link>
                              ) : (
                                <span>{item?.title}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className='ps-2'>{item.brandName}</div>
                          </td>
                          <td>
                            {" "}
                            <div className='ps-2'>{item.purchasedQty}</div>
                          </td>
                          <td>
                            {" "}
                            <div className='ps-2'>{item.cancelledQty}</div>
                          </td>
                          <td>
                            <div className='ps-2'>{item.returnedQty}</div>
                          </td>
                          <td>
                            <div className='ps-2'>{item.revenue}</div>
                          </td>
                          <td>
                            <div className='ps-2'>{item.royalties}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className='dashboard-area__btn'>
                <button
                  onClick={onLoadMore}
                  disabled={!hasMore || showSpinner}
                  className=''
                >
                  {showSpinner ? (
                    <>
                      <Spinner
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                      />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                    </>
                  )}
                </button>
              </div> */}
              <div className="d-flex justify-content-between align-items-center mt-4">
  {/* Left: prev / page / next */}
  <div className="d-flex align-items-center gap-2">
    <button
      type="button"
      onClick={() => fetchPage(Math.max(1, page - 1))}
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
      onClick={() => fetchPage(Math.min(totalPages, page + 1))}
      disabled={page >= totalPages || isPending}
      className="pagination-btn"
    >
      ›
    </button>
  </div>

  {/* Right: per page */}
  <div className="d-flex align-items-center gap-2">
    <span className="small text-muted">results per page</span>
    <select
      value={pageSize}
      onChange={(e) => {
        const n = Number(e.target.value);
        setPageSize(n);
        fetchPage(1, n);
      }}
      disabled={isPending}
      className="per-page-select"
    >
      {[10, 15, 20, 30, 50].map((n) => (
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
