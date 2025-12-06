"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Space,
  Tag,
  Button,
  Input,
  Tooltip,
  Popconfirm,
  message,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Status color helper
const statusColor = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "green";
    case "PENDING":
      return "orange";
    case "FAILED":
    case "CANCELLED":
      return "red";
    case "REFUNDED":
      return "purple";
    default:
      return "default";
  }
};

// Currency format helper
const formatCurrency = (amount, currency) =>
  `${currency ?? "BDT"} ${Number(amount).toLocaleString()}`;

export default function BookingTable({ initial = null }) {
  const [bookings, setBookings] = useState(initial ?? []);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(undefined);

  // Fetch bookings from backend
  const fetchBookings = async (opts = {}) => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams();
      qParams.set("limit", String(opts.limit ?? pageSize));
      qParams.set("page", String(opts.page ?? page));
      if (opts.q) qParams.set("q", opts.q);

      const res = await fetch(
        `${API_URL}/api/v1/bookings?${qParams.toString()}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();

      if (data?.success === false) {
        throw new Error(data?.message || "Failed to fetch bookings");
      }

      const fetched = data.bookings ?? data.data ?? data;
      setBookings(fetched);
      setTotal(data.total ?? fetched.length);
    } catch (err) {
      console.error("fetchBookings error:", err);
      message.error(err?.message ?? "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initial) fetchBookings({ page: 1, limit: pageSize });
  }, []);

  const handleSearch = (val = "") => {
    setPage(1);
    setSearch(val);
    fetchBookings({ page: 1, limit: pageSize, q: val });
  };

  const handleChange = (pagination) => {
    const nextPage = pagination.current;
    const nextSize = pagination.pageSize;
    setPage(nextPage);
    setPageSize(nextSize);
    fetchBookings({ page: nextPage, limit: nextSize, q: search });
  };

  const handleDownloadInvoice = (record) => {
    const href = `${API_URL}/api/v1/bookings/${record.confirmationCode}/invoice`;
    window.open(href, "_blank");
  };

  const handleCancelBooking = async (record) => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/bookings/${record.id}/cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const json = await res.json();

      if (json.success) {
        message.success("Booking cancelled");
        fetchBookings({ page, limit: pageSize, q: search });
      } else {
        message.error(json.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("cancel error:", err);
      message.error("Failed to cancel booking");
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Confirmation",
        dataIndex: "confirmationCode",
        key: "confirmationCode",
        render: (code, record) => (
          <Space direction='vertical' size={2}>
            <div style={{ fontWeight: 600 }}>{code}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.room?.name ? <span>{record.room.name} • </span> : null}
              <span>{new Date(record.createdAt).toLocaleString()}</span>
            </div>
          </Space>
        ),
      },
      {
        title: "Guest",
        dataIndex: "firstName",
        key: "guest",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.email ?? "-"} • {record.phone ?? "-"}
            </div>
          </div>
        ),
      },
      {
        title: "Amount",
        dataIndex: "totalAmount",
        key: "amount",
        render: (amt, record) => (
          <div>{formatCurrency(amt, record.currency)}</div>
        ),
        align: "right",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => <Tag color={statusColor(status)}>{status}</Tag>,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Link href={`/dashboard/bookings/${record.confirmationCode}`}>
              <Tooltip title='View booking'>
                <Button type='text' icon={<EyeOutlined />} />
              </Tooltip>
            </Link>

            {/* <Tooltip title='Download invoice'>
              <Button
                type='text'
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadInvoice(record)}
              />
            </Tooltip> */}

            {/* <Popconfirm
              title='Cancel booking?'
              onConfirm={() => handleCancelBooking(record)}
              okText='Yes'
              cancelText='No'
            >
              <Tooltip title='Cancel / Refund'>
                <Button type='text' icon={<CloseCircleOutlined />} />
              </Tooltip>
            </Popconfirm> */}
          </Space>
        ),
      },
    ],
    [page, pageSize, search]
  );

  return (
    <div className='py-6'>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Input.Search
          placeholder='Search by name, email, code, phone...'
          allowClear
          enterButton
          onSearch={(val) => handleSearch(val)}
          style={{ maxWidth: 420 }}
          className='custom-search'
        />
        <div>
          <Button
            onClick={() =>
              fetchBookings({ page: 1, limit: pageSize, q: search })
            }
          >
            Refresh
          </Button>
        </div>
      </div>

      <Table
        rowKey='id'
        dataSource={bookings}
        columns={columns}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleChange}
      />
    </div>
  );
}
