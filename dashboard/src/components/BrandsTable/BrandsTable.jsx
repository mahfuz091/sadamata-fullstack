"use client";

import React, { useState } from "react";
import { Table, Space, Button, Popconfirm, message, Switch, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import {
  updateUserIsActive,
  deleteUser,
} from "@/app/actions/user/user.actions";

export default function BrandsTable({ initial = [] }) {
  const [users, setUsers] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]);
  const router = useRouter();

  const setLoadingFor = (id, val) => {
    setLoadingIds((prev) =>
      val ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleStatusChange = async (userId, isActive) => {
    setLoadingFor(userId, true);
    try {
      const res = await updateUserIsActive(null, { userId, isActive });

      if (!res?.success) {
        message.error(res?.msg || "Failed to update account status");
        return;
      }

      message.success(
        `Account ${isActive ? "activated" : "deactivated"} successfully`
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive } : u))
      );

      router.refresh();
    } catch (err) {
      console.error("updateUserIsActive client error:", err);
      message.error("Something went wrong");
    } finally {
      setLoadingFor(userId, false);
    }
  };

  const handleDelete = async (userId) => {
    setLoadingFor(userId, true);
    try {
      const res = await deleteUser(null, { userId });

      if (!res?.success) {
        message.error(res?.msg || "Failed to delete user");
        return;
      }

      message.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      router.refresh();
    } catch (err) {
      console.error("deleteUser client error:", err);
      message.error("Something went wrong");
    } finally {
      setLoadingFor(userId, false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <div style={{ fontWeight: 600 }}>{name}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <div style={{ fontSize: 13 }}>{email}</div>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag>{role}</Tag>,
    },
    {
      title: "Account Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren='Active'
          unCheckedChildren='Inactive'
          onChange={(val) => handleStatusChange(record.id, val)}
          loading={loadingIds.includes(record.id)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title='Delete this user?'
            okText='Yes'
            cancelText='No'
            onConfirm={() => handleDelete(record.id)}
            disabled={loadingIds.includes(record.id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={loadingIds.includes(record.id)}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey='id'
      dataSource={users}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
}
