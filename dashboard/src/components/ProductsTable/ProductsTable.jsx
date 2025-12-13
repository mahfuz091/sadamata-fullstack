"use client";

import React, { useState } from "react";
import { Table, Switch, Button, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  updateProductActive,
} from "@/app/actions/product/product.actions";

export default function ProductsTable({ initial = [] }) {
  const [products, setProducts] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]);
  const router = useRouter();

  const setLoadingFor = (id, val) => {
    setLoadingIds((prev) =>
      val ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleToggleActive = async (product) => {
    setLoadingFor(product.id, true);

    const res = await updateProductActive(null, {
      productId: product.id,
      isActive: !product.isActive,
    });

    console.log(res);

    if (!res?.success) {
      message.error(res?.msg || "Failed to update product");
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isActive: !p.isActive } : p
        )
      );
      message.success("Product status updated");
    }

    setLoadingFor(product.id, false);
    router.refresh();
  };

  const handleDelete = async (productId) => {
    setLoadingFor(productId, true);

    const res = await deleteProduct(null, { productId });

    if (!res?.success) {
      message.error(res?.msg || "Failed to delete product");
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      message.success("Product deleted");
    }

    setLoadingFor(productId, false);
    router.refresh();
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (v) => <strong>{v}</strong>,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v) => `৳${v}`,
    },
    {
      title: "Merchant",
      render: (_, r) => r.User?.name || "-",
    },
    {
      title: "Brand",
      render: (_, r) => r.Brand?.name || r.brandName || "-",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (_, r) => (
        <Switch
          checked={r.isActive}
          loading={loadingIds.includes(r.id)}
          onChange={() => handleToggleActive(r)}
        />
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={loadingIds.includes(r.id)}
            onClick={() => handleDelete(r.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey='id'
      dataSource={products}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
}
