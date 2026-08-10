"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import image from "@/assets/images/products/cart.png";
import CustomSelect from "../CustomSelect/CustomSelect";
import DashSidebar from "../DashSidebar/DashSidebar";
import { deleteMerchantProduct } from "@/app/actions/merchant/merchant-products.actions";
import { toast } from "sonner";
import { Spinner } from "react-bootstrap";
const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL;

export default function DashboardManage({
  initialItems,
  totalPages,
  initialPage = 1,
  loadMoreAction,
  loadPageAction, // server action passed down
  placeholderSrc,
  merchantId,
}) {
  const tableTopRef = useRef(null);

  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(15); // screenshot মতো 15 default
  const [isPending, startTransition] = useTransition();
  const [showSpinner, setShowSpinner] = useState(false);

  // console.log(items, "items");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const hasMore = page < totalPages;

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
  const formData = new FormData();
  formData.set("page", String(nextPage));
  formData.set("pageSize", String(nextSize));

  startTransition(async () => {
    const res = await loadPageAction(undefined, formData);

    setItems(res.items);
    setPage(res.page);

    // ✅ scroll after state update
    requestAnimationFrame(() => {
      tableTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
};



  const handleSelect = (selected) => {
    // console.log("Selected:", selected);
  };

  const options = [
    { value: "chocolate", label: "Marketplace: All" },
    { value: "strawberry", label: "Marketplace: All" },
    { value: "vanilla", label: "Marketplace: All" },
  ];
  const options2 = [
    { value: "chocolate", label: "Product: 1 Selected" },
    { value: "strawberry", label: "Product: 1 Selected" },
    { value: "vanilla", label: "Product: 1 Selected" },
  ];
  const options3 = [
    { value: "ALL", label: "Status: All" },
    { value: "UNDERREVIEW", label: "Under Review" },
    { value: "PROCESSING", label: "Processing" },
    { value: "REJECTED", label: "Rejected" },
    { value: "ACTIVE", label: "Active" },
  ];

  const options4 = [
    { value: "ALL", label: "Availability: All" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];
  const [isDeleting, startDeleteTransition] = useTransition();
  function confirmDelete(productId) {
    toast.warning("Are you sure you want to delete this product?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => handleDelete(productId),
      },
      cancel: {
        label: "Cancel",
      },
    });
  }
  async function handleDelete(productId) {
    const formData = new FormData();
    formData.append("merchantId", merchantId);
    formData.append("productId", productId);

    startDeleteTransition(async () => {
      try {
        const res = await deleteMerchantProduct(undefined, formData);
console.log(res, "delete product res");

        if (res?.success) {
          // Remove item instantly from UI
          setItems((prev) => prev.filter((item) => item.id !== productId));

          toast.success("Product deleted successfully!");
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete product");
      }
    });
  }

  const filteredItems = items.filter((product) => {
    // STATUS FILTER
    if (statusFilter !== "ALL" && product.status !== statusFilter) {
      return false;
    }

    // VISIBILITY FILTER
    if (visibilityFilter === "ACTIVE" && product.isActive !== true) {
      return false;
    }

    if (visibilityFilter === "INACTIVE" && product.isActive !== false) {
      return false;
    }

    // SEARCH FILTER
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      const searchableText = [
        product.title,
        product.brandName,
        product?.brand?.name,
        product.mockupName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(term)) {
        return false;
      }
    }

    return true;
  });



  // console.log(filteredItems, "filter");

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
                <h2 className='dashboard-area__title'>Manage</h2>
                <div className='dashboard-area__button-group'>
                  <button className='commerce-btn active'>Products</button>
                  <button className='commerce-btn'>Designs</button>
                </div>
              </div>

              <div className='dashboard-area__tabel-box'>
                <div className='filter-section'>
                  <div className='filter-section__left'>
                    <div className='filter-item'>
                      <CustomSelect
                        instanceId='dashboard-manage-1'
                        options={options}
                        onChange={handleSelect}
                        placeholder='Marketplace: All'
                      />
                    </div>
                    <div className='filter-item'>
                      <CustomSelect
                        instanceId='dashboard-manage-2'
                        options={options2}
                        onChange={handleSelect}
                        placeholder='Product: 1 Selected'
                      />
                    </div>
                    <div className='filter-item'>
                      <CustomSelect
                        instanceId='dashboard-manage-3'
                        options={options3}
                        onChange={(opt) => setStatusFilter(opt.value)}
                        placeholder='Availability: All'
                      />
                    </div>
                    <div className='filter-item'>
                      <CustomSelect
                        instanceId='dashboard-manage-4'
                        options={options4}
                        onChange={(opt) => setVisibilityFilter(opt.value)}
                        placeholder='Availability: All'
                      />
                    </div>
                  </div>
                  <div className='filter-item'>
                    <div className='filter-item__search'>
                      <input
                        type='text'
                        name='search'
                        placeholder='Search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button type='submit'>
                        <i className='fas fa-search'></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className='dashboard-area__tabel' ref={tableTopRef}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        {[
                          "Sl",
                          "Title",
                          "Brand",
                          "Product Type",
                          "Modified",
                          "List Price",
                          "Status",
                          "Edit",
                        ].map((header) => (
                          <th key={header}>
                            <div className='sort-item'>
                              <span>{header}</span>
                              <div className='sort-btn-group'>
                                <button className='ort-btn'>
                                  <i className='fas fa-caret-up'></i>
                                </button>
                                <button className='ort-btn'>
                                  <i className='fas fa-caret-down'></i>
                                </button>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((product, index) => (
                        <tr key={product.id} >
                          <td>{index + 1}</td>
                          <td>
                            <div className='d-flex align-items-center' style={{ color: product.status === "REJECT" ? "red" : "" }}>
                              <img
                                // src={product.previewImg}
                                // src={`${process.env.NEXT_PUBLIC_BASE_URL}/${product.previewImg}`}
                                src={product.previewUrl || placeholderSrc}
                                alt='Product Image'
                                className='product-image me-2'
                                width={80}
                                height={80}
                              />
                              {product.isActive ? (
                                <Link
                                  href={`${MAIN_URL}/products/${product.productId}`}
                                  target='_blank'
                                >
                                  <span>{product.title}</span>
                                </Link>
                              ) : (
                                <span>{product.title}</span>
                              )}
                            </div>
                          </td>
                          <td style={{ color: product.status === "REJECT" ? "red" : "" }}>
                            {product.brandName !== null
                              ? product.brandName
                              : product?.brand?.name}
                          </td>
                          <td style={{ color: product.status === "REJECT" ? "red" : "" }}>{product.mockupName}</td>
                          <td style={{ color: product.status === "REJECT" ? "red" : "" }}>
                            {new Date(product.updatedAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td style={{ color: product.status === "REJECT" ? "red" : "" }}>{product.price}</td>
                          <td style={{ color: product.status === "REJECT" ? "red" : "" }}>{product?.status}</td>
                          <td>
                            <button className='action-buttons'>
                              {/* You can replace with a component or an icon library */}
                              <Link
                                href={`/dashboard/product/edit/${product?.id}`}
                                className='d-none'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='16'
                                  height='15'
                                  viewBox='0 0 16 15'
                                  fill='none'
                                >
                                  <path
                                    d='M9.64016 1.17332L10.2268 0.58665C10.9202 -0.106683 12.1268 -0.106683 12.8202 0.58665L13.2935 1.05998C13.6402 1.40665 13.8335 1.86665 13.8335 2.35332C13.8335 2.83998 13.6402 3.30665 13.2935 3.64665L12.7068 4.23332L9.64016 1.16665V1.17332ZM8.9335 1.87998L2.86016 7.95332C2.66683 8.14665 2.54683 8.39998 2.52683 8.67332L2.34683 10.6266C2.32683 10.8733 2.4135 11.1133 2.58683 11.2933C2.74683 11.4533 2.9535 11.54 3.1735 11.54H3.24683L5.20016 11.36C5.4735 11.3333 5.72683 11.2133 5.92016 11.02L11.9935 4.94665L8.92683 1.87998H8.9335ZM15.1668 13.6666C15.1668 13.3933 14.9402 13.1666 14.6668 13.1666H1.3335C1.06016 13.1666 0.833496 13.3933 0.833496 13.6666C0.833496 13.94 1.06016 14.1666 1.3335 14.1666H14.6668C14.9402 14.1666 15.1668 13.94 15.1668 13.6666Z'
                                    fill='#818B9C'
                                  />
                                </svg>
                              </Link>
                            </button>
                            <button
                              className='action-buttons__trash'
                              disabled={isDeleting}
                              onClick={() => confirmDelete(product.id)}
                            >
                              <i className='fa fa-trash'></i>
                            </button>
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
  {/* Left: pagination */}
  <div className="d-flex align-items-center gap-2">
    <button
      type="button"
      onClick={() => fetchPage(Math.max(1, page - 1))}
      disabled={page <= 1 || isPending}
      className="pagination-btn"
      aria-label="Previous page"
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
      aria-label="Next page"
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
        const nextSize = Number(e.target.value);
        setPageSize(nextSize);
        fetchPage(1, nextSize); // ✅ change size -> reset to page 1
      }}
      disabled={isPending}
      className="per-page-select"
    >
      {[10, 12, 15, 20, 30, 50].map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
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
}
