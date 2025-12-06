"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// local fallback data
const fallbackData = [
  { month: "2024-11", label: "Nov 2024", bookings: 0, revenue: 0 },
  { month: "2024-12", label: "Dec 2024", bookings: 0, revenue: 0 },
  { month: "2025-01", label: "Jan 2025", bookings: 0, revenue: 0 },
  { month: "2025-02", label: "Feb 2025", bookings: 0, revenue: 0 },
  { month: "2025-03", label: "Mar 2025", bookings: 0, revenue: 0 },
  { month: "2025-04", label: "Apr 2025", bookings: 0, revenue: 0 },
  { month: "2025-05", label: "May 2025", bookings: 0, revenue: 0 },
  { month: "2025-06", label: "Jun 2025", bookings: 0, revenue: 0 },
  { month: "2025-07", label: "Jul 2025", bookings: 0, revenue: 0 },
  { month: "2025-08", label: "Aug 2025", bookings: 0, revenue: 0 },
  { month: "2025-09", label: "Sep 2025", bookings: 0, revenue: 0 },
  { month: "2025-10", label: "Oct 2025", bookings: 16, revenue: 215750 },
  { month: "2025-11", label: "Nov 2025", bookings: 0, revenue: 0 },
];

function currencyFormat(value) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BookingChart({ data }) {
  const chartData = data;

  const years = Array.from(
    new Set(chartData.map((item) => item.label.split(" ")[1]))
  );

  const [selectedYear, setSelectedYear] = useState("2025");

  const filteredData = chartData.filter(
    (item) => item.label.split(" ")[1] === selectedYear
  );

  return (
    <Card className='w-full  mx-auto'>
      <CardHeader className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <CardTitle>Revenue (Monthly)</CardTitle>
          <CardDescription>Month-wise revenue trend line.</CardDescription>
        </div>

        <Select
          value={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
        >
          <SelectTrigger className='w-[120px] mt-2 md:mt-0'>
            <SelectValue placeholder='Select Year' />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart
              data={filteredData}
              margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='label' tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => (v ? `${(v / 1000).toFixed(0)}k` : "0")}
                label={{
                  value: "Revenue (BDT)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value) => [currencyFormat(value), "Revenue"]}
              />
              <Legend verticalAlign='top' height={36} />
              <Line
                type='monotone'
                dataKey='revenue'
                name='Revenue'
                stroke='#8884d8'
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
