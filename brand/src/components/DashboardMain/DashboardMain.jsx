'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Image imports from @assets/images

import saleAvatar from "@/assets/images/resources/salse-avater.png";

import DashSidebar from "../DashSidebar/DashSidebar";
import CustomSelect from "../CustomSelect/CustomSelect";
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL ;
const DashboardMain = ({report, today, stats, salesReport, salesData, todaySalesReport}) => {
  const options2 = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7d' },
  { label: 'Last 30 days', value: 'last30d' },
  { label: 'Last 90 days', value: 'last90d' },
];

console.log(salesData, "salesDtata");

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(options2[0]); // default: today

  const rangeKey = selected?.value ?? 'today';
  const current = salesData?.ranges?.[rangeKey] ?? { items: [], totalQty: 0 };
  const hasSales = (current.items?.length ?? 0) > 0;
  const last7DaysChart = salesData?.last7DaysChart ?? [];
  const last7DaysTotal = last7DaysChart.reduce(
    (total, item) => total + Number(item.sales || 0),
    0
  );

  useEffect(() => {
    if (!salesReport) return;
    // convert server data to UI structure
    const mapped = [
      {
        label: "Yesterday",
        date: salesReport.yesterday?.label || "",
        count: salesReport.yesterday?.soldOrders || 0,
        money: `৳${(salesReport.yesterday?.brandRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.yesterday?.soldOrders || 0}-${
          salesReport.yesterday?.canceledOrders || 0
        } (${salesReport.yesterday?.returnedOrders || 0})`,
        col: "6",
      },
      {
        label: "Last 7 Days",
        date: salesReport.last7?.label || "",
        count: salesReport.last7?.soldOrders || 0,
        money: `৳${(salesReport.last7?.brandRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.last7?.soldOrders || 0}-${
          salesReport.last7?.canceledOrders || 0
        } (${salesReport.last7?.returnedOrders || 0})`,
        col: "6",
      },
      {
        label: "This Month",
        date: salesReport.thisMonth?.label || "",
        count: salesReport.thisMonth?.soldOrders || 0,
        money: `৳${(salesReport.thisMonth?.brandRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.thisMonth?.soldOrders || 0}-${
          salesReport.thisMonth?.canceledOrders || 0
        } (${salesReport.thisMonth?.returnedOrders || 0})`,
        col: "6",
      },
      {
        label: "Previous Month",
        date: salesReport.prevMonth?.label || "",
        count: salesReport.prevMonth?.soldOrders || 0,
        money: `৳${(salesReport.prevMonth?.brandRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.prevMonth?.soldOrders || 0}-${
          salesReport.prevMonth?.canceledOrders || 0
        } (${salesReport.prevMonth?.returnedOrders || 0})`,
        col: "6",
      },
      {
        label: "All Time",
        date: salesReport.allTime?.label || "",
        count: salesReport.allTime?.soldOrders || 0,
        money: `৳${(salesReport.allTime?.brandRoyalty || 0).toFixed(2)}`,
        orders: `${salesReport.allTime?.soldOrders || 0}-${
          salesReport.allTime?.canceledOrders || 0
        } (${salesReport.allTime?.returnedOrders || 0})`,
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
        // total: stats.totalProducts || 0,
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
    <h4 className="dashboard__metrics__text text-center">{item.label}</h4>

    {item.label === "Uploader Today" ? (
      
      <div className="dashboard__metrics__simple-value text-center">
        <h2>{item.value}</h2>
      </div>
    ) : (
    
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
    )}
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
                          Today's Sales
                        </h3>
                        <p className='dashboard-dverview__date'>{new Date().toLocaleDateString("en-GB")}</p>
                      </div>
                      <div className='row gutter-x-10 gutter-y-10'>
                        <div className='col-12'>
                          <div className='dashboard-dverview__count'>
                            <h2 className='dashboard-dverview__count-text'>
                              {todaySalesReport?.todayOrders || 0}
                            </h2>
                          </div>
                        </div>
                        {["Sold", "Cancelled", "Returned", "Royalties"].map(
                          (label, i) => (
                            <div className='col-md-6 col-lg-3' key={i}>
                              <div className='count-box'>
                                <h3 className='count-box__numbner'>
                                  {label === "Sold" && (todaySalesReport?.soldOrders || 0)}
                                  {label === "Cancelled" && (todaySalesReport?.canceledOrders || 0)}
                                  {label === "Returned" && (todaySalesReport?.returnedOrders || 0)}
                                  {/* brand dashboard shows the BRAND's cut —
                                      merchantRoyalty here was the merchant's */}
                                  {label === "Royalties" && `৳ ${(todaySalesReport?.netBrandRoyalty ?? todaySalesReport?.brandRoyalty ?? 0).toFixed(2)}`}
                                </h3>
                                <p className='count-box__text'>{label}</p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-12 col-md-6 col-sm-12'>
                    <div className='dashboard-dverview__item dashboard-dverview__item--two dashboard-sales-chart'>
                      <div className='dashboard-dverview__top'>
                        <h3 className='dashboard-dverview__title'>
                          Last 7 Days Sales
                        </h3>
                        <p className='dashboard-dverview__date'>
                          Total Qty {last7DaysTotal}
                        </p>
                      </div>
                      <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width='100%' height='100%'>
                          <LineChart
                            data={last7DaysChart}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid stroke='#ececec' strokeDasharray='3 3' />
                            <XAxis
                              dataKey='label'
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#6f6f6f", fontSize: 12 }}
                            />
                            <YAxis
                              allowDecimals={false}
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#6f6f6f", fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value) => [value, "Sales"]}
                              labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Line
                              type='monotone'
                              dataKey='sales'
                              name='Sales'
                              stroke='var(--commerce-base, #f37927)'
                              strokeWidth={3}
                              dot={{ r: 4, strokeWidth: 2 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
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
                          Hang in there... Weâ€™ll notify you the moment you make
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
            Hang in there... We will notify you the moment you make a sale!
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
              <li key={item.id} className="dashboard-dverview__salse-li">
                <div className="dashboard-dverview__salse-li-left">
                  <div className="dashboard-dverview__salse-li-thumb">
                  {item.image ? (
                <img
                  src={item.image} // Use the signed URL
                  alt={item.productName || "Product"}
                  width={80}
                  height={80}
                />
              ) : (
                <div>No Image</div> // Fallback if no image or URL
              )}
                  </div>
                  <div className="dashboard-dverview__salse-li-meta">
                    <h4 className="dashboard-dverview__salse-li-title">
                      {item.productId ? (
                        <Link href={`https://sadamata.com/products/${item.productId}`} target="_blank" rel="noreferrer">
                          {item.productName || 'Unknown Product'}
                        </Link>
                      ) : (
                        item.productName || 'Unknown Product'
                      )}
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



