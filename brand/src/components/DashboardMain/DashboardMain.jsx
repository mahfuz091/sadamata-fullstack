'use client'
import React, { useEffect, useState } from "react";
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
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL ;
const DashboardMain = ({report, today, stats, salesReport, salesData}) => {
  const options2 = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7d' },
  { label: 'Last 30 days', value: 'last30d' },
  { label: 'Last 90 days', value: 'last90d' },
];
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(options2[0]); // default: today

  const rangeKey = selected?.value ?? 'today';
  const current = salesData?.ranges?.[rangeKey] ?? { items: [], totalQty: 0 };
  const hasSales = (current.items?.length ?? 0) > 0;

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
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    if (!stats || !today) return;

    // Create dynamic metrics
    const data = [
      {
        label: "Uploader Today",
        value: today.totalTodayUploaded || 0,
        total: stats.totalProducts || 0,
      },
      {
        label: "Live Designs",
        value: stats.totalLiveProducts || 0,
        total: stats.totalProducts || 0,
      },
      {
        label: "Live Products",
        value: stats.totalLiveProducts || 0,
        total: stats.totalProducts || 0,
      },
      {
        label: "Products with Sales",
        value: stats.totalProductsWithSales || 0,
        total: stats.totalProducts || 0,
      },
    ];

    const withPercent = data.map((item) => {
      const percent =
        item.total && item.total > 0
          ? Math.round((item.value / item.total) * 100)
          : 0;
      return { ...item, percent };
    });

    setMetrics(withPercent);
  }, [stats, today]);
  console.log(metrics, "metrics");
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
                {metrics.map((item, i) => (
        <div className="dashboard__metrics__item" key={i}>
          <h4 className="dashboard__metrics__text">{item.label}</h4>
          <div className="dashboard__metrics__progess-box">
            <div className="dashboard__metrics__progess__inner">
              <div className="progess__left">
                {item.value} <span>of</span> {item.total}
              </div>
              <div className="progess__persent">{item.percent}%</div>
            </div>
            <div className="progess-box">
              <div
                className="progess-box__inner"
                style={{ width: `${item.percent}%` }}
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
                          <CustomSelect options={options2} value={selected}  onChange={(opt) => setSelected(opt)}/>
                        </div>
                      </div>
                      {/* <div className='dashboard-dverview__salse-box'>
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
                      </div> */}
                      {!hasSales ? (
        // ===== Empty state (No Sales Yet) =====
        <div className="dashboard-dverview__salse-box">
          <h3 className="dashboard-dverview__salse-title">No Sales Yet</h3>
          <p className="dashboard-dverview__salse-text">
            Hang in there... We’ll notify you the moment you make a sale!
          </p>
          <div className="dashboard-dverview__salse-thumb">
            {saleAvatar && (
              <Image src={saleAvatar} alt="sales avatar" />
            )}
          </div>
        </div>
      ) : (
        // ===== Has data =====
        <div className="dashboard-dverview__salse-list">
          <div className="dashboard-dverview__salse-summary">
            <span className="dashboard-dverview__salse-total-label">Total Qty</span>
            <span className="dashboard-dverview__salse-total-value">
              {current.totalQty}
            </span>
          </div>

          <ul className="dashboard-dverview__salse-ul">
            {current.items.map((item) => (
              <li key={item.productId} className="dashboard-dverview__salse-li">
                <div className="dashboard-dverview__salse-li-left">
                  <div className="dashboard-dverview__salse-li-thumb">
                    {item.image ? (
                      <Image
                        src={`${ASSET_BASE}${item.image}`}
                        alt={item.productName || 'Product'}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="dashboard-dverview__salse-li-fallback" />
                    )}
                  </div>
                  <div className="dashboard-dverview__salse-li-meta">
                    <h4 className="dashboard-dverview__salse-li-title">
                      {item.productName || 'Unknown Product'}
                    </h4>
                   
                  </div>
                </div>

                <div className="dashboard-dverview__salse-li-right">
                  <span className="dashboard-dverview__salse-li-qty">{item.qty}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
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
