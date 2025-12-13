"use client";

import React, { useState } from "react";
import { Table, Space, Select, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/order/order.actions";

const ORDER_STATUS = [
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "SHIPPED",
  "COMPLETED",
];

export default function OrdersTable({ initial = [] }) {
  const [orders, setOrders] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]);

  // 🔹 pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  const setLoadingFor = (id, val) => {
    setLoadingIds((p) => (val ? [...p, id] : p.filter((x) => x !== id)));
  };

  const handleStatusChange = async (orderId, status) => {
    setLoadingFor(orderId, true);

    const res = await updateOrderStatus(null, { orderId, status });

    if (res?.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }

    setLoadingFor(orderId, false);
    router.refresh();
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      render: (id) => <strong>{id.slice(0, 8)}...</strong>,
    },
    {
      title: "Customer",
      render: (_, r) => (
        <div>
          <div>{r.user?.name}</div>
          <small>{r.user?.email}</small>
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
      render: (status, r) => (
        <Select
          value={status}
          style={{ width: 140 }}
          loading={loadingIds.includes(r.id)}
          onChange={(v) => handleStatusChange(r.id, v)}
        >
          {ORDER_STATUS.map((s) => (
            <Select.Option key={s} value={s}>
              {s}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString(),
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
    <Table
      rowKey='id'
      dataSource={orders}
      columns={columns}
      pagination={{
        current: currentPage,
        pageSize,
        total: orders.length,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50"],
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        },
      }}
    />
  );
}
