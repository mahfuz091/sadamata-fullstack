import React from "react";
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

const DashboardMain = () => {
  const options2 = [
    { value: "chocolate", label: "Today" },
    { value: "strawberry", label: "Week" },
    { value: "vanilla", label: "Month" },
    { value: "vanilla", label: "3 Month" },
  ];
  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>
          <div className='col-lg-9'>
            <div className='dashboard-area__content'>
              <div className='dashboard__metrics'>
                {[
                  "Uploader Today",
                  "Live Designs",
                  "Live Products",
                  "Products with Sales",
                ].map((title, i) => (
                  <div className='dashboard__metrics__item' key={i}>
                    <h4 className='dashboard__metrics__text'>{title}</h4>
                    <div className='dashboard__metrics__progess-box'>
                      <div className='dashboard__metrics__progess__inner'>
                        <div className='progess__left'>
                          4 <span>of</span> 1
                        </div>
                        <div className='progess__persent'>23%</div>
                      </div>
                      <div className='progess-box'>
                        <div
                          className='progess-box__inner'
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className='dashboard__metrics__item dashboard__star'>
                  <h4 className='dashboard__metrics__text'>Reviews</h4>
                  <div className='dashboard__star__inner'>
                    {[...Array(5)].map((_, i) => (
                      <i className='fas fa-star' key={i}></i>
                    ))}
                  </div>
                  <p className='dashboard__metrics__text-two'>
                    0.0 from 0 reviews
                  </p>
                </div>
              </div>
              <div className='dashboard-dverview'>
                <div className='row gutter-x-10 gutter-y-20'>
                  <div className='col-xl-6 col-lg-12 col-md-6 col-sm-12'>
                    <div className='dashboard-dverview__item'>
                      <div className='dashboard-dverview__top'>
                        <h3 className='dashboard-dverview__title'>
                          Today’s Sales
                        </h3>
                        <p className='dashboard-dverview__date'>3/14/25</p>
                      </div>
                      <div className='row gutter-x-10 gutter-y-10'>
                        <div className='col-12'>
                          <div className='dashboard-dverview__count'>
                            <h2 className='dashboard-dverview__count-text'>
                              0
                            </h2>
                          </div>
                        </div>
                        {["Sold", "Cancelled", "Returned", "Royalties"].map(
                          (label, i) => (
                            <div className='col-md-6 col-lg-3' key={i}>
                              <div className='count-box'>
                                <h3 className='count-box__numbner'>0</h3>
                                <p className='count-box__text'>{label}</p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-12 col-md-6 col-sm-12'>
                    <div className='cart'>
                      <Image src={cartImg} alt='cart image' />
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-12 col-md-6 col-sm-12'>
                    <div className='dashboard-dverview__item dashboard-dverview__item--two'>
                      <div className='dashboard-dverview__top'>
                        <h3 className='dashboard-dverview__title'>Sales</h3>
                        <div className='dashboard-dverview__right'>
                          <CustomSelect options={options2} />
                        </div>
                      </div>
                      <div className='dashboard-dverview__salse-box'>
                        <h3 className='dashboard-dverview__salse-title'>
                          No Sales Yet
                        </h3>
                        <p className='dashboard-dverview__salse-text'>
                          Hang in there... We’ll notify you the moment you make
                          a sale!
                        </p>
                        <div className='dashboard-dverview__salse-thumb'>
                          <Image src={saleAvatar} alt='sales avatar' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-12 col-md-6 col-sm-12'>
                    <div className='dashboard-dverview__item dashboard-dverview__item--two'>
                      <div className='dashboard-dverview__top'>
                        <h3 className='dashboard-dverview__title'>
                          Sales Report
                        </h3>
                      </div>
                      <div className='dashboard-dverview__receved'>
                        <div className='row gutter-y-9 gutter-x-20'>
                          {[
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
