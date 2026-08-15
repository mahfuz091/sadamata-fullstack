"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Table, Select, Button, Space, message, Tag, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  deleteProduct,
  updateProductStatus,
} from "@/app/actions/product/product.actions";
import Link from "next/link";

const { Option } = Select;

function debounce(fn, delay = 400) {
  let t;
  const wrapped = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
}

export default function ProductsTable({
  initial = [],
  meta,
  merchants = [],
  brands = [],
  filters = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [products, setProducts] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]);

  // ✅ controlled filters (from URL)
  const [merchantId, setMerchantId] = useState(filters?.merchantId || null);
  const [brandId, setBrandId] = useState(filters?.brandId || null);
  const [q, setQ] = useState(filters?.q || "");

  // ✅ when server sends new page items, update table rows
  useEffect(() => {
    setProducts(initial);
  }, [initial]);

  // ✅ keep the inputs in sync with the URL (back/forward, Reset, external links)
  useEffect(() => {
    setQ(filters?.q || "");
  }, [filters?.q]);

  useEffect(() => {
    setMerchantId(filters?.merchantId || null);
    setBrandId(filters?.brandId || null);
  }, [filters?.merchantId, filters?.brandId]);

  const setLoadingFor = (id, val) => {
    setLoadingIds((prev) =>
      val ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const setQueryParams = (patch) => {
    const params = new URLSearchParams(sp.toString());

    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "" || v === undefined) params.delete(k);
      else params.set(k, String(v));
    });

    // filter/search change => reset page
    if ("merchantId" in patch || "brandId" in patch || "q" in patch) {
      params.set("page", "1");
    }

    // router.push already refetches the server component for this route;
    // the extra router.refresh() only doubled every request.
    router.push(`${pathname}?${params.toString()}`);
  };

  // setQueryParams closes over `sp`. Memoising the debounced callback with []
  // froze the very first `sp`, so a search typed after changing the merchant /
  // brand / page rebuilt the URL from the stale params and silently dropped
  // whatever filter had been applied in between. Read it through a ref instead.
  const setQueryParamsRef = React.useRef(setQueryParams);
  useEffect(() => {
    setQueryParamsRef.current = setQueryParams;
  });

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value) => {
        setQueryParamsRef.current({ q: value.trim() });
      }, 400),
    []
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
  const handleStatusChange = async (product, status) => {
    setLoadingFor(product.id, true);

    const res = await updateProductStatus(null, {
      productId: product.id,
      status,
    });

    if (!res?.success) {
      message.error(res?.msg || "Failed to update status");
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, status, isActive: status === "ACTIVE" }
            : p
        )
      );
      message.success("Product status updated");
    }

    setLoadingFor(product.id, false);
    router.refresh();
  };

  const handleDelete = async (productId) => {
    setLoadingFor(productId, true);

    const res = await deleteProduct(null, { productId });

    if (!res?.success) {
      message.error(res?.msg || "Failed to delete product");
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      message.success("Product deleted");
    }

    setLoadingFor(productId, false);
    router.refresh();
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      render: (v) => <strong>{v}</strong>,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v) => `৳${v}`,
    },
    {
      title: "Merchant",
      render: (_, r) => r.User?.name || "-",
    },
    {
      title: "Brand",
      render: (_, r) => r.Brand?.name || r.brandName || "-",
    },
    {
      title: "Status",
      render: (_, r) => (
        <Select
          value={r.status}
          style={{ width: 150 }}
          loading={loadingIds.includes(r.id)}
          onChange={(val) => handleStatusChange(r, val)}
        >
          <Option value='UNDERREVIEW'>
            <Tag color='orange'>UNDER REVIEW</Tag>
          </Option>
          <Option value='PROCESSING'>
            <Tag color='blue'>PROCESSING</Tag>
          </Option>
          <Option value='ACTIVE'>
            <Tag color='green'>ACTIVE</Tag>
          </Option>
          <Option value='REJECT'>
            <Tag color='red'>REJECT</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Visibility",
      render: (_, r) =>
        r.isActive ? (
          <Tag color='green'>Live</Tag>
        ) : (
          <Tag color='red'>Hidden</Tag>
        ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Link href={`/dashboard/products/${r.id}`} target="_blank">
            <Button>Details</Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={loadingIds.includes(r.id)}
            onClick={() => handleDelete(r.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* ✅ Filters row */}
      <div className='flex flex-wrap gap-3 mb-4 items-center py-5'>
        <Select
          allowClear
          showSearch
          optionFilterProp='children'
          placeholder='Merchant'
          style={{ width: 220 }}
          value={merchantId || undefined}
          onChange={(val) => {
            const v = val || null;
            setMerchantId(v);
            setQueryParams({ merchantId: v });
          }}
        >
          {merchants.map((m) => (
            <Option key={m.id} value={m.id}>
              {m.name}
            </Option>
          ))}
        </Select>

        <Select
          allowClear
          showSearch
          optionFilterProp='children'
          placeholder='Brand'
          style={{ width: 220 }}
          value={brandId || undefined}
          onChange={(val) => {
            const v = val || null;
            setBrandId(v);
            setQueryParams({ brandId: v });
          }}
        >
          {brands.map((b) => (
            <Option key={b.id} value={b.id}>
              {b.name}
            </Option>
          ))}
        </Select>

        <Input
          placeholder='Search title / productId / merchant / brand'
          style={{ width: 280 }}
          value={q}
          allowClear
          onChange={(e) => {
            const val = e.target.value;
            setQ(val);

            // blank (or whitespace-only) clears the filter immediately
            if (!val.trim()) {
              debouncedSearch.cancel();
              setQueryParams({ q: null });
              return;
            }

            debouncedSearch(val);
          }}
          onPressEnter={() => {
            debouncedSearch.cancel();
            setQueryParams({ q: q.trim() || null });
          }}
        />

        <Button
          onClick={() => {
            debouncedSearch.cancel();
            setQueryParams({ q: q.trim() || null });
          }}
        >
          Search
        </Button>

        <Button
          onClick={() => {
            debouncedSearch.cancel();
            setMerchantId(null);
            setBrandId(null);
            setQ("");
            setQueryParams({ merchantId: null, brandId: null, q: null });
          }}
        >
          Reset
        </Button>
      </div>

      <Table
        rowKey='id'
        dataSource={products}
        columns={columns}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.pageSize || 10,
          total: meta?.total || 0,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            // changing page size re-slices the result set — the old page number
            // can land past the last page, so go back to page 1
            const sizeChanged = pageSize !== (meta?.pageSize || 10);
            setQueryParams({ page: sizeChanged ? 1 : page, pageSize });
          },
        }}
      />
    </>
  );
}
