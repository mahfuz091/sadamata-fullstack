// app/providers.jsx
"use client";

import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { ConfigProvider } from "antd";

export default function Providers({ children }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}
