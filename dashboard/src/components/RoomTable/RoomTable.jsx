// app/dashboard/rooms/rooms-client.jsx
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
  Tag,
  Select,
  Switch,
  Empty,
  Button,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function getImageUrl(path) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE.replace(/\/+$/, "")}/${normalized}`;
}

export default function RoomsTable({ hotels = [] }) {
  const [activeHotelId, setActiveHotelId] = useState(hotels?.[0]?.id || "");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offerOnly, setOfferOnly] = useState(false);
  //   console.log(hotels, "hottttt");

  const hotelOptions = useMemo(
    () => (hotels || []).map((h) => ({ value: h.id, label: h.name })),
    [hotels]
  );

  const activeHotel = useMemo(
    () => (hotels || []).find((h) => h.id === activeHotelId),
    [hotels, activeHotelId]
  );

  async function fetchRooms(hotelId, offer = false) {
    if (!hotelId) {
      setRooms([]);
      return;
    }
    setLoading(true);
    try {
      const base = `${API_BASE.replace(
        /\/+$/,
        ""
      )}/api/v1/rooms/by-hotel/${hotelId}`;
      const url = offer ? `${base}/offer` : base;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Fetch rooms failed (${res.status}) ${text}`);
      }
      const data = await res.json();
      setRooms(Array.isArray(data?.rooms) ? data.rooms : []);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to load rooms");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeHotelId) fetchRooms(activeHotelId, offerOnly);
  }, [activeHotelId, offerOnly]);

  const handleDelete = async (id) => {
    try {
      const url = `${API_BASE.replace(/\/+$/, "")}/api/v1/rooms/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Delete failed (${res.status}) ${text}`);
      }
      toast.success("Room deleted");
      fetchRooms(activeHotelId, offerOnly);
    } catch (err) {
      console.error("deleteRoom error:", err);
      toast.error(err?.message || "Failed to delete room");
    }
  };

  const columns = [
    {
      title: "Room",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        const thumb = record?.images?.length
          ? record.images.find((i) => i.order === 0) || record.images[0]
          : undefined;
        return (
          <Space>
            <Avatar
              size={48}
              shape='square'
              src={getImageUrl(thumb?.url || thumb?.path)}
              alt={record.name}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600 }}>{record.name}</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {record.slug}
              </span>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Guests",
      dataIndex: "guestMax",
      key: "guestMax",
      width: 90,
      render: (v, r) =>
        v ?? (r.guest ? <span title={r.guest}>{r.guest}</span> : "-"),
    },
    {
      title: "Units",
      dataIndex: "totalUnits",
      key: "totalUnits",
      width: 80,
    },
    {
      title: "Price / night",
      key: "price",
      render: (_, r) => {
        const p = r.price || {};
        const currency = p.currency || "BDT";
        return p.discount ? (
          <div>
            <div style={{ textDecoration: "line-through", opacity: 0.6 }}>
              {currency} {p.regular}
            </div>
            <div style={{ fontWeight: 600 }}>
              {currency} {p.effective}
            </div>
          </div>
        ) : (
          <div style={{ fontWeight: 600 }}>
            {currency} {p.effective}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (st, r) => (
        <Space size='small'>
          <Tag color={st === "ACTIVE" ? "green" : "red"}>{st}</Tag>
          {r.isFeatured && <Tag>Featured</Tag>}
          {r.isLimited && <Tag color='orange'>Limited</Tag>}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: (
              <Link
                href={`/dashboard/rooms/edit-room/${record.id}`}
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
                title='Delete this room?'
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
          <span style={{ fontSize: 14, color: "#6b7280" }}>Hotel:</span>
          <Select
            style={{ minWidth: 260 }}
            options={hotelOptions}
            value={activeHotelId || undefined}
            onChange={(val) => setActiveHotelId(val)}
            placeholder='Select hotel'
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            Offer rooms only
          </span>
          <Switch checked={offerOnly} onChange={(v) => setOfferOnly(v)} />
        </div>

        <Button
          className='ml-auto'
          onClick={() => fetchRooms(activeHotelId, offerOnly)}
          icon={<ReloadOutlined />}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {activeHotel ? (
        <div className='rounded-lg border bg-white p-3'>
          <div className='mb-3 flex items-center gap-3'>
            <Avatar
              size={40}
              shape='square'
              src={getImageUrl(activeHotel?.coverImage || "")}
            />
            <div style={{ fontWeight: 600 }}>
              {activeHotel?.name}
              {offerOnly && (
                <span style={{ marginLeft: 8, fontSize: 12, color: "#d97706" }}>
                  (Offer rooms)
                </span>
              )}
            </div>
          </div>

          <Table
            dataSource={rooms}
            columns={columns}
            rowKey='id'
            loading={loading}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    offerOnly ? "No offer rooms found" : "No rooms found"
                  }
                />
              ),
            }}
          />
        </div>
      ) : (
        <Empty description='Select a hotel to view rooms' />
      )}
    </div>
  );
}
