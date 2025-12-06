// app/dashboard/mockups/mockups-client.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Table,
  Space,
  Avatar,
  Dropdown,
  Popconfirm,
  Tag,
  Button,
  Empty,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteMockup } from "@/app/actions/mockup/mockup.actions"; // adjust path if needed

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function getImageUrl(path) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
}

export default function MockupsTable({ mockups = [] }) {
  const [data, setData] = useState(mockups);
  const [loadingIds, setLoadingIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const setLoadingFor = (id, val) => {
    setLoadingIds((prev) =>
      val ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleDeleteMockup = async (mockupId) => {
    try {
      setLoadingFor(mockupId, true);
      const res = await deleteMockup(mockupId);

      if (!res?.success) {
        toast.error(res?.message || "Failed to delete mockup");
        return;
      }

      toast.success("Mockup deleted");
      setData((prev) => prev.filter((m) => m.id !== mockupId));
      router.refresh();
    } catch (err) {
      console.error("deleteMockup error:", err);
      toast.error(err?.message || "Failed to delete mockup");
    } finally {
      setLoadingFor(mockupId, false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // let the server re-fetch
      router.refresh();
      toast.success("Refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  function getReadableTextColor(hex) {
    if (!hex) return "#000";
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? "#000" : "#fff";
  }
  function getTextColor(bg) {
    if (!bg) return "#000";
    return bg.toLowerCase() === "#fff" || bg.toLowerCase() === "#ffffff"
      ? "#000"
      : "#fff";
  }

  const columns = [
    {
      title: "Mockup",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        const firstVariant = record.variants?.[0];
        const coverImg = firstVariant?.frontImg || firstVariant?.backImg;
        return (
          <Space>
            <Avatar
              size={48}
              shape='square'
              src={getImageUrl(coverImg)}
              alt={record.name}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600 }}>{record.name}</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {record.variants?.length || 0}{" "}
                {record.variants?.length === 1 ? "variant" : "variants"}
              </span>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Variants (color / fit type)",
      key: "variants",
      render: (_, record) => {
        const variants = record.variants || [];
        if (!variants.length) {
          return <span style={{ fontSize: 12 }}>No variants</span>;
        }

        return (
          <Space size='small' wrap>
            {variants.map((v) => (
              <Tag
                key={v.id}
                style={{
                  backgroundColor: v.color,
                  color: getReadableTextColor(v.color),
                  color: getTextColor(v.color),
                  border: "1px solid #e5e7eb",
                  fontWeight: 600,
                }}
              >
                {v.color} / {v.fitType}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Variant Images",
      key: "images",
      render: (_, record) => {
        const variants = record.variants || [];
        if (!variants.length) {
          return <span style={{ fontSize: 12 }}>No images</span>;
        }

        return (
          <Space size='small' wrap>
            {variants.map((v) => {
              const frontUrl = getImageUrl(v.frontImg);
              const backUrl = getImageUrl(v.backImg);

              return (
                <Space key={v.id} direction='horizontal' size={4}>
                  {frontUrl && (
                    <Tooltip
                      title={`Front · ${v.color} · ${v.fitType}`}
                      placement='top'
                    >
                      <Avatar
                        size={36}
                        shape='square'
                        src={frontUrl}
                        alt='Front'
                      />
                    </Tooltip>
                  )}
                  {backUrl && (
                    <Tooltip
                      title={`Back · ${v.color} · ${v.fitType}`}
                      placement='top'
                    >
                      <Avatar
                        size={36}
                        shape='square'
                        src={backUrl}
                        alt='Back'
                      />
                    </Tooltip>
                  )}
                </Space>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (createdAt) => {
        if (!createdAt) return "-";
        const d = new Date(createdAt);
        return (
          <span style={{ fontSize: 12 }}>
            {d.toLocaleDateString()} {d.toLocaleTimeString()}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: (
              <Link
                href={`/dashboard/mockups/edit-mockup/${record.id}`}
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
                title='Delete this mockup?'
                onConfirm={() => handleDeleteMockup(record.id)}
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
      <div className='mb-4 flex items-center gap-3'>
        <h2 className='text-lg font-semibold m-0'>Mockups</h2>
        <Button
          className='ml-auto'
          onClick={handleRefresh}
          icon={<ReloadOutlined />}
          disabled={refreshing}
        >
          Refresh
        </Button>
      </div>

      <div className='rounded-lg border bg-white p-3'>
        <Table
          dataSource={data}
          columns={columns}
          rowKey='id'
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{
            emptyText: <Empty description='No mockups found' />,
          }}
        />
      </div>
    </div>
  );
}
