"use client";
import React from "react";
import Link from "next/link"; // or react-router Link if you use it
import { Table, Space, Avatar, Dropdown, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { toast } from "sonner";

// keep your existing deleteHotel function; this file expects it to be in scope
// import { deleteHotel } from "../../services/hotelService";
// 👇 Import your environment variable
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // use NEXT_PUBLIC_ for Next.js frontend

// Small helper to build full image URL
const getImageUrl = (path) => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path; // already full URL
  const normalized = path.replace(/\\/g, "/"); // handle backslashes
  return `${API_URL}/${normalized}`;
};
const HotelTable = ({ hotels }) => {
  // choose data source: prefer hotels prop, otherwise fallback (compatibility)
  const dataSource = hotels;

  console.log(dataSource, "datasource");

  // const handleDelete = async (id) => {
  //   //     try {
  //   //       const res = await deleteHotel(id);
  //   //       if (res?.success) {
  //   //         toast.success(res.msg);
  //   //         // TODO: refresh your list or remove item from state
  //   //       } else {
  //   //         toast.error(res?.msg || "Failed to delete hotel");
  //   //       }
  //   //     } catch (err) {
  //   //       console.error("deleteHotel error:", err);
  //   //       toast.error("Something went wrong while deleting the hotel");
  //   //     }
  // };
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/hotels/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Delete failed");
      }
      toast.success("Hotel deleted successfully");
      router.refresh();
    } catch (err) {
      console.error("delete error:", err);
      Modal.error({
        title: "Delete failed",
        content: err?.message || "Something went wrong",
      });
    }
  };

  const getMenuItems = (record) => [
    {
      key: "edit",
      label: (
        <Link
          href={`/dashboard/hotels/edit-hotel/${record.id}`}
          className='flex items-center'
        >
          <EditOutlined className='mr-2 text-blue-600' />
          Edit
        </Link>
      ),
    },
    {
      key: "delete",
      label: (
        <Popconfirm
          title='Are you sure you want to delete this hotel?'
          onConfirm={() => handleDelete(record.id)}
          okText='Yes'
          cancelText='No'
        >
          <div className='flex items-center cursor-pointer'>
            <DeleteOutlined className='mr-2 text-red-600' />
            Delete
          </div>
        </Popconfirm>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            shape='square'
            src={getImageUrl(record.coverImage)}
            alt={record.name}
          />
          <span className='font-medium'>{record.name}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) =>
        email ? (
          <a href={`mailto:${email}`} onClick={(e) => e.stopPropagation()}>
            {email}
          </a>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) =>
        phone ? (
          <a href={`tel:${phone}`} onClick={(e) => e.stopPropagation()}>
            {phone}
          </a>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) => <span>{loc ?? "-"}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (addr) => (
        <Tooltip title={addr}>
          <div
            style={{
              maxWidth: 360,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {addr}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getMenuItems(record) }}
          trigger={["click"]}
          placement='bottomRight'
        >
          <MoreOutlined className='text-xl cursor-pointer' />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className='py-6'>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey='id'
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
        bordered={false}
      />
    </div>
  );
};

export default HotelTable;
