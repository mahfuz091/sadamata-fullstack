"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { Table, Space, Select, Button, Input, DatePicker } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/order/order.actions";
import dayjs from "dayjs";
import Link from "next/link";

const { RangePicker } = DatePicker;

const ORDER_STATUS = [
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "SHIPPED",
  "COMPLETED",
  "RETURNED",
];

const ORDER_STATUS_LABELS = {
  COMPLETED: "DELIVERED",
};

const getOrderStatusLabel = (status) => ORDER_STATUS_LABELS[status] || status;

const formatOrderDate = (date) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "-";

  return value
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
};

function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export default function OrdersTable({ initial = [], meta, filters = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [orders, setOrders] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]);

  console.log("orders", orders);
  

  // filters
  const [status, setStatus] = useState(filters?.status || null);
  const [q, setQ] = useState(filters?.q || "");
  const [range, setRange] = useState(() => {
    const from = filters?.from ? dayjs(filters.from) : null;
    const to = filters?.to ? dayjs(filters.to) : null;
    return from && to ? [from, to] : null;
  });

  useEffect(() => setOrders(initial), [initial]);

  const setLoadingFor = (id, val) => {
    setLoadingIds((p) => (val ? [...p, id] : p.filter((x) => x !== id)));
  };

  const setQueryParams = (patch) => {
    const params = new URLSearchParams(sp.toString());

    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "" || v === undefined) params.delete(k);
      else params.set(k, String(v));
    });

    if ("status" in patch || "q" in patch || "from" in patch || "to" in patch) {
      params.set("page", "1");
    }

    const url = `${pathname}?${params.toString()}`;

    startTransition(() => {
      router.replace(url); // ✅ push না
      // router.refresh(); // ✅ transition ভিতরে
    });
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setQueryParams({ q: value.trim() });
      }, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingFor(orderId, true);

    const res = await updateOrderStatus(null, { orderId, status: newStatus });

    if (res?.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }

    setLoadingFor(orderId, false);
    router.refresh();
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: "Customer",
      render: (_, r) => (
        <div className="flex flex-col">
          <Link href={`/dashboard/orders/${r.id}`}>
            {r?.user ? r.user?.name:r?.GuestAddress?.firstName + " " + r?.GuestAddress?.lastName}
          </Link>
          <small>{r.user?.email || r.GuestAddress?.email}</small>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      render: (v) => `৳${v}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s, r) => (
        <Select
          value={s}
          style={{ width: 160 }}
          loading={loadingIds.includes(r.id)}
          onChange={(v) => handleStatusChange(r.id, v)}
        >
          {ORDER_STATUS.map((x) => (
            <Select.Option key={x} value={x}>
              {getOrderStatusLabel(x)}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (d) => formatOrderDate(d),
    },
    {
      title: "Action",
      render: (_, r) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => router.push(`/dashboard/orders/${r.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* ✅ Filters */}
      <div className='flex flex-wrap gap-3 mb-4 items-center py-5'>
        <Select
          allowClear
          placeholder='Status'
          style={{ width: 200 }}
          value={status || undefined}
          onChange={(val) => {
            const v = val || null;
            setStatus(v);
            setQueryParams({ status: v });
          }}
        >
          {ORDER_STATUS.map((s) => (
            <Select.Option key={s} value={s}>
              {getOrderStatusLabel(s)}
            </Select.Option>
          ))}
        </Select>

        <RangePicker
          value={range || undefined}
          onChange={(vals) => {
            setRange(vals || null);

            // clear
            if (!vals || vals.length !== 2) {
              setQueryParams({ from: null, to: null });
              return;
            }

            const from = vals[0].format("YYYY-MM-DD");
            const to = vals[1].format("YYYY-MM-DD");
            setQueryParams({ from, to });
          }}
        />

        <Input
          placeholder='Search orderId / tranId / customer'
          style={{ width: 300 }}
          value={q}
          allowClear
          onChange={(e) => {
            const val = e.target.value;
            setQ(val);

            if (!val) {
              setQueryParams({ q: null });
              return;
            }

            debouncedSearch(val);
          }}
        />

        <Button
          onClick={() => {
            setStatus(null);
            setQ("");
            setRange(null);
            setQueryParams({ status: null, q: null, from: null, to: null });
          }}
        >
          Reset
        </Button>
      </div>

      <Table
        rowKey='id'
        dataSource={orders}
        columns={columns}
        pagination={{
          current: meta?.page || 1,
          pageSize: meta?.pageSize || 10,
          total: meta?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          onChange: (page, pageSize) => {
            setQueryParams({ page, pageSize });
          },
        }}
      />
    </>
  );
}
