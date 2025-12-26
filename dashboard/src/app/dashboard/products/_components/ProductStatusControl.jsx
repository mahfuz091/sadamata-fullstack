"use client";

import React, { useState } from "react";
import { Select, Tag, message, Space } from "antd";
import { useRouter } from "next/navigation";
import { updateProductStatus } from "@/app/actions/product/product.actions";

const { Option } = Select;

export default function ProductStatusControl({
  productId,
  initialStatus,
  initialIsActive,
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (nextStatus) => {
    setLoading(true);
    try {
      const res = await updateProductStatus(null, {
        productId,
        status: nextStatus,
      });

      if (!res?.success) {
        message.error(res?.msg || "Failed to update status");
        return;
      }

      setStatus(nextStatus);
      setIsActive(nextStatus === "ACTIVE");

      message.success("Product status updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction='vertical' size={6} style={{ width: "100%" }}>
      <Select
        value={status}
        style={{ width: 200 }}
        loading={loading}
        onChange={handleStatusChange}
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

      <div>
        {isActive ? (
          <Tag color='green'>Live</Tag>
        ) : (
          <Tag color='red'>Hidden</Tag>
        )}
      </div>
    </Space>
  );
}
