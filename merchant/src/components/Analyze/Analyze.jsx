"use client";
import React, { useTransition, useState } from "react";
import DashSidebar from "../DashSidebar/DashSidebar";
import cartImg from "@/assets/images/products/cart.png";
import Image from "next/image";
import CustomSelect from "../CustomSelect/CustomSelect";

const options = [
  { value: "chocolate", label: "Marketplace: All" },
  { value: "strawberry", label: "Marketplace: All" },
  { value: "vanilla", label: "Marketplace: All" },
];

const Analyze = ({
  initialItems,
  initialPage = 1,
  totalPages,
  loadMoreAction,
  summery,
}) => {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();

  // console.log(initialItems, "initialItems");

  const hasMore = page < totalPages;

  async function onLoadMore() {
    if (!hasMore) return;
    const fd = new FormData();
    fd.set("nextPage", String(page + 1));
    startTransition(async () => {
      const res = await loadMoreAction(undefined, fd);
      setItems((prev) => [...prev, ...res.items]);
      setPage(res.page);
    });
  }
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
                    <input type="date" id="from" placeholder="dd-mm-yyyy" />
                  </div>
                  <label htmlFor="to">To</label>
                  <div className="date-group">
                    <i className="fas fa-calendar-alt icon"></i>
                    <input type="date" id="to" placeholder="dd-mm-yyyy" />
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
                            ৳{summery?.totalAfterWithdraw}{" "}
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
                            ৳{summery?.merchantTotalIncome}{" "}
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
                            ৳{summery?.withdrawAmount}{" "}
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
                      <input type="text" name="text" placeholder="Search" />
                      <button type="submit">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="dashboard-area__tabel">
                  <table className="" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>
                          <div className="sort-item-two">
                            <span>SL</span>
                          </div>
                        </th>
                        <th>
                          <div className="sort-item-two">
                            <span>Title</span>
                          </div>
                        </th>
                        <th>
                          <div className="sort-item-two">
                            <span>Brand</span>
                          </div>
                        </th>
                        <th>
                          <div className="sort-item-two">
                            <span>Purchased</span>
                          </div>
                        </th>
                        <th>
                          <div className="sort-item-two">
                            <span>Cancelled</span>
                          </div>
                        </th>
                        <th>
                          <div className="sort-item-two">
                            <span>Returned</span>
                          </div>
                        </th>
                        <th>
                          <div className="sort-item-two">
                            <span>Revenue</span>
                          </div>
                        </th>
                        <th>
                          <div className="sort-item-two">
                            <span>Royalties</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td><div className="ps-2">
                            {index + 1}</div></td>
                          <td>
                            <div class="d-flex align-items-center gap-2" >
                              <Image
                                src={item?.previewImg}
                                alt={item.title}
                                width={50}
                                height={60}
                              />
                              {item.title}
                            </div>
                          </td>
                          <td><div className="ps-2">
                            {item.brandName}</div></td>
                          <td> <div className="ps-2">
                            {item.purchasedQty}
                            </div></td>
                          <td> <div className="ps-2">{item.cancelledQty}</div></td>
                          <td><div className="ps-2">{item.returnedQty}</div></td>
                          <td><div className="ps-2">{item.revenue}</div></td>
                          <td><div className="ps-2">{item.royalties}</div></td>
                        </tr>
                      ))}
                     
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="dashboard-area__btn">
                <a href="#">
                  {" "}
                  Load More <i className="icon-right-arrow"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analyze;
