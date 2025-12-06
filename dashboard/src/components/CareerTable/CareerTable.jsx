// components/Career/CareerTable.jsx
"use client";

import React from "react";
import Link from "next/link";
import { Table, Space, Tooltip, Popconfirm, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function CareerTable({ careers = [] }) {
  const dataSource = careers || [];
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/careers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Delete failed");
      }
      toast.success("Role deleted successfully");
      router.refresh();
    } catch (err) {
      console.error("delete error:", err);
      Modal.error({
        title: "Delete failed",
        content: err?.message || "Something went wrong",
      });
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.title}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.shortDescription ?? ""}
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) => <span>{loc ?? "-"}</span>,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Type",
      dataIndex: "jobType",
      key: "jobType",
    },
    {
      title: "Experience",
      dataIndex: "experienceLevel",
      key: "experienceLevel",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link href={`/dashboard/careers/view/${record.id}`}>
            <Tooltip title='View'>
              <p className='text-sm !mb-0'>View</p>
            </Tooltip>
          </Link>

          <Link href={`/dashboard/careers/edit-career/${record.id}`}>
            <Tooltip title='Edit'>
              <EditOutlined className='cursor-pointer' />
            </Tooltip>
          </Link>

          <Popconfirm
            title='Delete this role?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Tooltip title='Delete'>
              <DeleteOutlined className='cursor-pointer text-red-600' />
            </Tooltip>
          </Popconfirm>

          {/* {record.applyUrl ? (
            <a
              href={record.applyUrl}
              target='_blank'
              rel='noreferrer'
              className='ml-2 text-sm'
            >
              Apply
            </a>
          ) : null} */}
        </Space>
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
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        bordered={false}
      />
    </div>
  );
}
