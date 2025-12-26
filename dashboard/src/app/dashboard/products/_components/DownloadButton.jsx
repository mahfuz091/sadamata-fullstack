"use client";

import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

export default function DownloadButton({ url }) {
  const handleDownload = () => {
    if (!url) return;
    // ✅ same-origin download via API route
    window.location.href = `/api/download?url=${encodeURIComponent(url)}`;
  };

  return (
    <Button
      icon={<DownloadOutlined />}
      onClick={handleDownload}
      disabled={!url}
    >
      Download
    </Button>
  );
}
