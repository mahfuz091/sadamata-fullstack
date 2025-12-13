"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import OrdersTable from "./OrdersTable";
import { getOrders } from "@/app/actions/order/order.actions";

const YEARS = [2023, 2024, 2025, 2026];

export default function OrdersClient({ initial }) {
  const [orders, setOrders] = useState(initial);
  const [loading, setLoading] = useState(false);

  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();

  const fetchOrders = async (y, m, d) => {
    setLoading(true);

    const res = await getOrders(null, {
      year: y ? Number(y) : undefined,
      month: m ? Number(m) : undefined,
      day: d ? Number(d) : undefined,
    });

    if (res?.success) {
      setOrders(res.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(year, month, day);
  }, [year, month, day]);

  const clearFilters = () => {
    setYear(undefined);
    setMonth(undefined);
    setDay(undefined);
    fetchOrders();
  };

  return (
    <div className='space-y-4'>
      {/* FILTER BAR */}
      <div className='flex items-center gap-3'>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder='Year' />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder='Month' />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder='Day' />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 31 }).map((_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant='outline' onClick={clearFilters}>
          Clear
        </Button>
      </div>

      <OrdersTable data={orders} loading={loading} />
    </div>
  );
}
