"use client";

import React, { useState } from "react";
import { Table, Space, Select, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

// Import server actions (adjust path if your actions file is elsewhere)
import { updateUserRole, deleteUser } from "@/app/actions/user/user.actions";

const { Option } = Select;

const ROLE_OPTIONS = ["SUPERADMIN", "ADMIN", "USER", "AUTHOR"];

export default function UsersTable({ initial = [] }) {
  const [users, setUsers] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]); // track loaders per row
  const router = useRouter();

  const setLoadingFor = (id, val) => {
    setLoadingIds((prev) =>
      val ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoadingFor(userId, true);
    try {
      console.log(newRole, "newRole");

      const res = await updateUserRole(null, { userId, role: newRole });

      if (!res?.success) {
        message.error(res?.msg || "Failed to update role");
        return;
      }

      message.success("Role updated");
      // optimistic update locally
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      router.refresh(); // refresh server-rendered UI
    } catch (err) {
      console.error("updateUserRole client error:", err);
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
      render: (name, record) => <div style={{ fontWeight: 600 }}>{name}</div>,
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
      render: (role, record) => (
        <Select
          value={role}
          style={{ width: 160 }}
          onChange={(val) => handleRoleChange(record.id, val)}
          loading={loadingIds.includes(record.id)}
        >
          {ROLE_OPTIONS.map((r) => (
            <Option key={r} value={r}>
              {r}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* <Button
            type='default'
            icon={<EditOutlined />}
            onClick={() => message.info("Use the role dropdown to edit")}
          >
            Edit
          </Button> */}

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
