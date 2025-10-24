"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import DashSidebar from "../DashSidebar/DashSidebar";
import bgImage from "@/assets/images/backgrounds/admin-bg-home.jpg";
import userImage from "@/assets/images/resources/user-1-1.png";
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL ;
export default function DashBrand({ data = [] , brandName}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeMockup = useMemo(() => data[activeIdx], [data, activeIdx]);

  return (
    <section className="dashboard-area section-space">
      <div className="container">
        <div className="row gutter-x-40">
          <div className="col-lg-3">
            <DashSidebar />
          </div>

          <div className="col-lg-9">
            <div className="dashboard-area__content">
              <div className="brand-profile-top">
                <div
                  className="brand-profile-top__bg"
                  style={{
                    backgroundImage: `url(${bgImage.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="brand-profile-top__inner">
                  <div className="brand-profile-top__profile">
                    <div className="brand-profile-top__left">
                      <div className="brand-profile-top__image">
                        <Image src={userImage} alt="user image" />
                      </div>
                      <div className="brand-profile-top__content">
                        <h4 className="brand-profile-top__name">{brandName}</h4>

                         <span className='brand-profile-top__followers'>
                          5.8K Followers
                        </span>
                      </div>
                    </div>
                    <div className='brand-profile-top__right'>
                      <div className='brand-profile-top__btn'>
                        <a href='#' className='commerce-btn'>
                          <i className='icon-edit-2'></i> Edit Profile
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Tabs: all mockup names */}
                  <ul className="brand-profile-top__list list-unstyled">
                    {data.map((m, idx) => (
                      <li key={m.id} className={idx === activeIdx ? "active" : ""}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveIdx(idx);
                          }}
                          title={`${m.name} • ${m.productCount} products`}
                        >
                          {m.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Products for the active mockup */}
              <div className="brand-item-area">
                <div className="row gutter-x-51 gutter-y-20">
                  {activeMockup?.products?.length ? (
                    activeMockup.products.map((item) => {
                      const img = item?.variant?.frontImg || "/placeholder-300x300.png";
                      return (
                        <div key={item.id} className="col-lg-4 col-md-6 col-sm-6">
                          <div className="brand-item">
                            <div className="brand-item__img">
                              <a href={`/products/${item.id}`} className="brand-item__img__item">
                                <Image  src={`${ASSET_BASE}${img}`} alt={item.title} width={300} height={300} />
                              </a>
                              <div className="brand-item__dropdown">
                                <a
                                  className="dropdown-toggle"
                                  href="#"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis-h" />
                                </a>
                                <ul className="dropdown-menu">
                                  <li>
                                    <a className="dropdown-item" href={`/dashboard/products/${item.id}/edit`}>
                                      Edit
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href={`/dashboard/products/${item.id}/delete`}>
                                      Delete
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="brand-item__content">
                              <p className="brand-item__brand">
                                Brand:{" "}
                                <a href={item.brand?.id ? `/brands/${item.brand.id}` : "#"}>
                                  {item.brand?.name || item.brandName || "—"}
                                </a>
                              </p>
                              <h4 className="brand-item__title">
                                <a href={`/products/${item.id}`}>{item.title}</a>
                              </h4>
                              <div className="brand-item__box">
                                <div className="brand-item__price">
                                  ${Number(item.price).toFixed(2)}
                                </div>
                                <div className="brand-item__ratings">
                                  <i className="fas fa-star" />
                                  <i className="fas fa-star" />
                                  <i className="fas fa-star" />
                                  <i className="fas fa-star" />
                                  <i className="fas fa-star" />
                                  <span> 5.0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <div className="alert alert-info">
                        এই mockup-এর অধীনে কোনো active product পাওয়া যায়নি।
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* end products */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
