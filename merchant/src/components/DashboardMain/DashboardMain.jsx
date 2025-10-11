"use client";

import { useState, useEffect } from "react";

import Image from "next/image";

// Image imports from @assets/images
import flag1 from "@/assets/images/icon/flag-1-1.png";
import flag2 from "@/assets/images/icon/flag-1-2.png";
import flag3 from "@/assets/images/icon/flag-1-3.png";
import flag4 from "@/assets/images/icon/flag-1-4.png";
import flag5 from "@/assets/images/icon/flag-1-5.png";
import flag6 from "@/assets/images/icon/flag-1-6.png";
import cartImg from "@/assets/images/resources/admin-cart.png";
import saleAvatar from "@/assets/images/resources/salse-avater.png";
import Link from "next/link";
import DashSidebar from "../DashSidebar/DashSidebar";
import CustomSelect from "../CustomSelect/CustomSelect";

const options2 = [
  { value: "chocolate", label: "Today" },
  { value: "strawberry", label: "Week" },
  { value: "vanilla", label: "Month" },
  { value: "vanilla", label: "3 Month" },
];

const DashboardMain = ({ report, session, salesReport }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!salesReport) return;
    // convert server data to UI structure
    const mapped = [
      {
        label: "Yesterday",
        date: salesReport.yesterday?.label || "",
        count: salesReport.yesterday?.soldOrders || 0,
        money: `৳${(salesReport.yesterday?.merchantRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.yesterday?.soldOrders || 0}-${
          salesReport.yesterday?.canceledOrders || 0
        } (${salesReport.yesterday?.refundedUnits || 0})`,
        col: "6",
      },
      {
        label: "Last 7 Days",
        date: salesReport.last7?.label || "",
        count: salesReport.last7?.soldOrders || 0,
        money: `৳${(salesReport.last7?.gmerchantRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.last7?.soldOrders || 0}-${
          salesReport.last7?.canceledOrders || 0
        } (${salesReport.last7?.refundedUnits || 0})`,
        col: "6",
      },
      {
        label: "This Month",
        date: salesReport.thisMonth?.label || "",
        count: salesReport.thisMonth?.soldOrders || 0,
        money: `৳${(salesReport.thisMonth?.merchantRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.thisMonth?.soldOrders || 0}-${
          salesReport.thisMonth?.canceledOrders || 0
        } (${salesReport.thisMonth?.refundedUnits || 0})`,
        col: "6",
      },
      {
        label: "Previous Month",
        date: salesReport.prevMonth?.label || "",
        count: salesReport.prevMonth?.soldOrders || 0,
        money: `৳${(salesReport.prevMonth?.merchantRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.prevMonth?.soldOrders || 0}-${
          salesReport.prevMonth?.canceledOrders || 0
        } (${salesReport.prevMonth?.refundedUnits || 0})`,
        col: "6",
      },
      {
        label: "All Time",
        date: salesReport.allTime?.label || "",
        count: salesReport.allTime?.soldOrders || 0,
        money: `৳${(salesReport.allTime?.merchantRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.allTime?.soldOrders || 0}-${
          salesReport.allTime?.canceledOrders || 0
        } (${salesReport.allTime?.refundedUnits || 0})`,
        col: "12",
      },
    ];
    setData(mapped);
  }, [salesReport]);
  return (
    <section className="dashboard-area section-space">
      <div className="container">
        <div className="row gutter-x-40">
          <div className="col-lg-3">
            <DashSidebar />
          </div>
          <div className="col-lg-9">
            <div className="dashboard-area__content">
              <div className="dashboard__top">
                <div className="currency dashboard__top__item">
                  <div className="currency__item">
                    <h3 className="currency__number">10</h3>
                    <p className="currency__title">TIER</p>
                  </div>
                  <div className="currency__item">
                    <h3 className="currency__number">0</h3>
                    <p className="currency__title">UR</p>
                  </div>
                  <div className="currency__item">
                    <h3 className="currency__number">0</h3>
                    <p className="currency__title">PS</p>
                  </div>
                  <div className="currency__item">
                    <h3 className="currency__number">0</h3>
                    <p className="currency__title">REJ</p>
                  </div>
                </div>
                <div className="flag dashboard__top__item">
                  {[flag1, flag2, flag3, flag4, flag5, flag6].map(
                    (flag, index) => (
                      <div className="flag__item" key={index}>
                        <div className="flag__img">
                          <Image src={flag} alt={`flag ${index + 1}`} />
                        </div>
                        <p className="flag__title">
                          <span>Upcoming</span>
                        </p>
                      </div>
                    )
                  )}
                </div>
                <div className="dashboard__top__btn">
                  <Link href="/dashboard/add-design" className="commerce-btn">
                    Create <i className="icon-right-arrow"></i>
                  </Link>
                </div>
              </div>
              <div className="dashboard__metrics">
                {[
                  "Uploader Today",
                  "Live Designs",
                  "Live Products",
                  "Products with Sales",
                ].map((title, i) => (
                  <div className="dashboard__metrics__item" key={i}>
                    <h4 className="dashboard__metrics__text">{title}</h4>
                    <div className="dashboard__metrics__progess-box">
                      <div className="dashboard__metrics__progess__inner">
                        <div className="progess__left">
                          4 <span>of</span> 1
                        </div>
                        <div className="progess__persent">23%</div>
                      </div>
                      <div className="progess-box">
                        <div
                          className="progess-box__inner"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="dashboard__metrics__item dashboard__star">
                  <h4 className="dashboard__metrics__text">Reviews</h4>
                  <div className="dashboard__star__inner">
                    {[...Array(5)].map((_, i) => (
                      <i className="fas fa-star" key={i}></i>
                    ))}
                  </div>
                  <p className="dashboard__metrics__text-two">
                    0.0 from 0 reviews
                  </p>
                </div>
              </div>
              <div className="dashboard-dverview">
                <div className="row gutter-x-10 gutter-y-20">
                  <div className="col-xl-6 col-lg-12 col-md-6 col-sm-12">
                    <div className="dashboard-dverview__item">
                      <div className="dashboard-dverview__top">
                        <h3 className="dashboard-dverview__title">
                          Today’s Sales
                        </h3>
                        <p className="dashboard-dverview__date">
                          {new Date().toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="row gutter-x-10 gutter-y-10">
                        <div className="col-12">
                          <div className="dashboard-dverview__count">
                            <h2 className="dashboard-dverview__count-text">
                              {report?.soldOrders}
                            </h2>
                          </div>
                        </div>
                        {/* {["Sold", "Cancelled", "Returned", "Royalties"].map(
                          (label, i) => (
                            <div className='col-md-6 col-lg-3' key={i}>
                              <div className='count-box'>
                                <h3 className='count-box__numbner'>{label === "Sold" ? report?.soldOrders : report?.cancelledOrders}</h3>
                                <p className='count-box__text'>{label}</p>
                              </div>
                            </div>
                          )
                        )} */}
                        {["Sold", "Cancelled", "Returned", "Royalties"].map(
                          (label, i) => {
                            let value = 0;

                            if (label === "Sold") value = report?.soldOrders;
                            else if (label === "Cancelled")
                              value =
                                report?.canceledOrders; // note: spelling ‘canceledOrders’
                            else if (label === "Returned")
                              value = report?.refundedUnits;
                            else if (label === "Royalties")
                              value = report?.netMerchantRoyalty;

                            return (
                              <div className="col-md-6 col-lg-3" key={i}>
                                <div className="count-box">
                                  <h3 className="count-box__numbner">
                                    {value ?? 0}
                                  </h3>
                                  <p className="count-box__text">{label}</p>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-12 col-md-6 col-sm-12">
                    <div className="cart">
                      <Image src={cartImg} alt="cart image" />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-12 col-md-6 col-sm-12">
                    <div className="dashboard-dverview__item dashboard-dverview__item--two">
                      <div className="dashboard-dverview__top">
                        <h3 className="dashboard-dverview__title">Sales</h3>
                        <div className="dashboard-dverview__right">
                          <CustomSelect options={options2} />
                        </div>
                      </div>
                      <div className="dashboard-dverview__salse-box">
                        <h3 className="dashboard-dverview__salse-title">
                          No Sales Yet
                        </h3>
                        <p className="dashboard-dverview__salse-text">
                          Hang in there... We’ll notify you the moment you make
                          a sale!
                        </p>
                        <div className="dashboard-dverview__salse-thumb">
                          <Image src={saleAvatar} alt="sales avatar" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-12 col-md-6 col-sm-12">
                    <div className="dashboard-dverview__item dashboard-dverview__item--two">
                      <div className="dashboard-dverview__top">
                        <h3 className="dashboard-dverview__title">
                          Sales Report
                        </h3>
                      </div>
                      <div className="dashboard-dverview__receved">
                        <div className="row gutter-y-9 gutter-x-20">
                          {/* {[
                            {
                              label: "Yesterday",
                              date: "7/4",
                              count: 0,
                              money: "৳0.00",
                              orders: "1-0 (0)",
                              col: "6",
                            },
                            {
                              label: "Last 7 Days",
                              date: "6/28-7/5",
                              count: 1,
                              money: "৳0.00",
                              orders: "1-0 (0)",
                              col: "6",
                            },
                            {
                              label: "This Month",
                              date: "7/1-7/5",
                              count: 1,
                              money: "৳0.00",
                              orders: "1-0 (0)",
                              col: "6",
                            },
                            {
                              label: "Previous Month",
                              date: "Jun 25",
                              count: 8,
                              money: "৳0.00",
                              orders: "7-0 (1)",
                              col: "6",
                            },
                            {
                              label: "All Time",
                              date: "",
                              count: 1,
                              money: "৳47.00",
                              orders: "23-0 (4)",
                              col: "12",
                            },
                          ].map((item, i) => (
                            <div className={`col-sm-${item.col}`} key={i}>
                              <div className='receved__item'>
                                <h5 className='receved__title'>
                                  {item.label}
                                  {item.date && <span> {item.date}</span>}
                                </h5>
                                <div className='receved__item__box'>
                                  <h3 className='receved__item__number'>
                                    {item.count}
                                  </h3>
                                  <div className='receved__item__right'>
                                    <span className='receved__item__money'>
                                      {item.money}
                                    </span>
                                    <span className='receved__item__order'>
                                      {item.orders}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))} */}
                          {data.map((item, i) => (
                            <div className={`col-sm-${item.col}`} key={i}>
                              <div className="receved__item">
                                <h5 className="receved__title">
                                  {item.label}
                                  {item.date && <span> {item.date}</span>}
                                </h5>
                                <div className="receved__item__box">
                                  <h3 className="receved__item__number">
                                    {item.count}
                                  </h3>
                                  <div className="receved__item__right">
                                    <span className="receved__item__money">
                                      {item.money}
                                    </span>
                                    <span className="receved__item__order">
                                      {item.orders}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardMain;
