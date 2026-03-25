"use client";

import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

export default function DownloadButton({ s3Key, filename, children, type }) {
  const handleDownload = () => {
    if (!s3Key) return;
    const qs = new URLSearchParams({
      key: s3Key,
      filename: filename || "",
    });
    window.location.href = `/api/download?${qs.toString()}`;
  };

  return (
    <Button
      type={type}
      icon={<DownloadOutlined />}
      onClick={handleDownload}
      disabled={!s3Key}
    >
      {children || "Download"}
    </Button>
  );
}
