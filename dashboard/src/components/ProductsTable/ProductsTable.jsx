"use client";

import React, { useState } from "react";
import { Table, Select, Button, Space, message, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  updateProductStatus,
} from "@/app/actions/product/product.actions";
import Link from "next/link";

const { Option } = Select;

export default function ProductsTable({ initial = [] }) {
  const [products, setProducts] = useState(initial);
  const [loadingIds, setLoadingIds] = useState([]);
  const router = useRouter();
  console.log(products, "products");

  const setLoadingFor = (id, val) => {
    setLoadingIds((prev) =>
      val ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleStatusChange = async (product, status) => {
    setLoadingFor(product.id, true);

    const res = await updateProductStatus(null, {
      productId: product.id,
      status,
    });

    if (!res?.success) {
      message.error(res?.msg || "Failed to update status");
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                status,
                isActive: status === "ACTIVE",
              }
            : p
        )
      );
      message.success("Product status updated");
    }

    setLoadingFor(product.id, false);
    router.refresh();
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
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
      title: "Status",
      render: (_, r) => (
        <Select
          value={r.status}
          style={{ width: 150 }}
          loading={loadingIds.includes(r.id)}
          onChange={(val) => handleStatusChange(r, val)}
        >
          <Option value='UNDERREVIEW'>
            <Tag color='orange'>UNDER REVIEW</Tag>
          </Option>
          <Option value='PROCESSING'>
            <Tag color='blue'>PROCESSING</Tag>
          </Option>
          <Option value='ACTIVE'>
            <Tag color='green'>ACTIVE</Tag>
          </Option>
          <Option value='REJECT'>
            <Tag color='red'>REJECT</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Visibility",
      render: (_, r) =>
        r.isActive ? (
          <Tag color='green'>Live</Tag>
        ) : (
          <Tag color='red'>Hidden</Tag>
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
          <Link href={`/dashboard/products/${r.id}`}>
            <Button className=''>Details</Button>
          </Link>
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

  return (
    <Table
      rowKey='id'
      dataSource={products}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
}
