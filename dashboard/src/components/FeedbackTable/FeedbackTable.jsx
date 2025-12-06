// app/dashboard/corporate-client-feedback/client-feedback-table.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  Space,
  Avatar,
  Dropdown,
  Popconfirm,
  Tooltip,
  Empty,
  Button,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function getImageUrl(path) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
}

/**
 * ClientFeedbackTable
 *
 * - fetches list from GET /api/v1/corporate-client-feedback
 * - deletes via DELETE /api/v1/corporate-client-feedback/:id
 * - links to edit page at /dashboard/corporate-client-feedback/edit/[id]
 * - add page at /dashboard/corporate-client-feedback/add
 *
 * Matches style/patterns of your RoomsTable component.
 */
export default function ClientFeedbackTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    setLoading(true);
    try {
      const url = `${API_BASE.replace(/\/+$/, "")}/api/v1/client-feedback`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Fetch failed (${res.status}) ${text}`);
      }
      const data = await res.json();
      // API may return array directly or { items: [...] } - normalize
      if (Array.isArray(data)) setItems(data);
      else if (Array.isArray(data?.feedbacks)) setItems(data.feedbacks);
      else if (Array.isArray(data?.data)) setItems(data.data);
      else setItems(data || []);
    } catch (err) {
      console.error("load feedbacks error:", err);
      toast.error(err?.message || "Failed to load feedbacks");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      const url = `${API_BASE.replace(
        /\/+$/,
        ""
      )}/api/v1/client-feedback/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Delete failed (${res.status}) ${text}`);
      }
      toast.success("Feedback deleted");
      // optimistic update
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("deleteFeedback error:", err);
      toast.error(err?.message || "Failed to delete feedback");
    }
  };

  const columns = [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (_, record) => (
        <Space align='center'>
          <Avatar
            size={48}
            shape='square'
            src={getImageUrl(record.logo || "")}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{record.clientName}</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {record.companyName || record.clientName}
            </span>
          </div>
        </Space>
      ),
      width: 320,
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
      render: (txt) => (
        <div style={{ maxWidth: 520, whiteSpace: "pre-wrap" }}>{txt}</div>
      ),
    },
    {
      title: "Added",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (d) => (d ? new Date(d).toLocaleString() : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (st) =>
        st ? <Tag color={st === "ACTIVE" ? "green" : "red"}>{st}</Tag> : null,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: (
              <Link
                href={`/dashboard/client-feedback/edit-feedback/${record.id}`}
                className='flex items-center'
              >
                <EditOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                Edit
              </Link>
            ),
          },
          {
            key: "delete",
            label: (
              <Popconfirm
                title='Delete this feedback?'
                onConfirm={() => handleDelete(record.id)}
                okText='Yes'
                cancelText='No'
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <DeleteOutlined
                    style={{ marginRight: 8, color: "#ff4d4f" }}
                  />
                  Delete
                </div>
              </Popconfirm>
            ),
          },
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement='bottomRight'
          >
            <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className='px-4 lg:px-6'>
      <div className='mb-4 flex flex-wrap items-center gap-3'>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            Client Feedback
          </h2>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Link href='/dashboard/client-feedback/add-feedback'>
            <Button
              icon={<PlusOutlined />}
              className='text-[#fff] transition rounded-[10px] text-[16px] bg-[#0B7956] py-[10px] px-[25px] hover:bg-[#000]'
            >
              Add
            </Button>
          </Link>

          <Button
            onClick={fetchItems}
            icon={<ReloadOutlined />}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className='rounded-lg border bg-white p-3'>
        <Table
          dataSource={items}
          columns={columns}
          rowKey='id'
          loading={loading}
          pagination={{
            pageSize: 6,
            showSizeChanger: true,
            pageSizeOptions: ["6", "12", "24"],
          }}
          locale={{
            emptyText: <Empty description='No client feedback found' />,
          }}
        />
      </div>
    </div>
  );
}
