"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, InputNumber, Modal, Switch, Table, Tag, message } from "antd";
import {
  getMerchantBonusRuleHistory,
  updateMerchantBonusRule,
} from "@/app/actions/user/merchantBonusRule.actions";

const SAMPLE_PRICE = 1100;
const SAMPLE_MERCHANT_PCT = 11; // illustrative, matches a standalone merchant

const fmt = (n) => Number(n || 0).toFixed(2);

export default function MerchantTierCommissionEditor({ initialRule, initialHistory }) {
  const router = useRouter();

  const [priceThreshold, setPriceThreshold] = useState(
    initialRule?.priceThreshold ?? 1000,
  );
  const [excessPct, setExcessPct] = useState(initialRule?.excessPct ?? 40);
  const [isActive, setIsActive] = useState(initialRule?.isActive ?? true);
  const [note, setNote] = useState(initialRule?.note ?? "");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(initialHistory ?? []);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!initialRule) return;
    setPriceThreshold(initialRule.priceThreshold ?? 1000);
    setExcessPct(initialRule.excessPct ?? 40);
    setIsActive(initialRule.isActive ?? true);
    setNote(initialRule.note ?? "");
  }, [initialRule]);

  useEffect(() => {
    setHistory(initialHistory ?? []);
  }, [initialHistory]);

  const threshold = Number(priceThreshold) || 0;
  const excess = Number(excessPct) || 0;
  const firstSlice = Math.min(SAMPLE_PRICE, threshold);
  const base = (firstSlice * SAMPLE_MERCHANT_PCT) / 100;
  const aboveThreshold = Math.max(SAMPLE_PRICE - firstSlice, 0);
  const excessEarning = (aboveThreshold * excess) / 100;
  const total = base + excessEarning;

  const reloadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getMerchantBonusRuleHistory({ page: 1, pageSize: 20 });
      setHistory(res?.items ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      const res = await updateMerchantBonusRule(null, {
        priceThreshold: Number(priceThreshold),
        excessPct: Number(excessPct),
        isActive,
        note,
      });
      if (!res?.success) {
        message.error(res?.msg || "Failed to update the tier commission");
      } else {
        message.success(res?.msg || "Merchant tier commission updated");
        await reloadHistory();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const confirmSave = () => {
    Modal.confirm({
      title: "Apply this tier commission?",
      content: "This applies to new orders only. Existing sales are never recalculated.",
      okText: "Save",
      cancelText: "Cancel",
      onOk: save,
    });
  };

  const columns = [
    {
      title: "Effective from",
      dataIndex: "effectiveFrom",
      render: (v) => (v ? new Date(v).toLocaleString() : "—"),
    },
    { title: "Changed by", dataIndex: "createdByName" },
    {
      title: "Threshold (BDT)",
      dataIndex: "priceThreshold",
      render: (v) => fmt(v),
    },
    {
      title: "Excess %",
      dataIndex: "excessPct",
      render: (v) => fmt(v),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (v) => (v ? <Tag color='green'>Active</Tag> : <Tag>Superseded</Tag>),
    },
    { title: "Note", dataIndex: "note", render: (v) => v || "—" },
  ];

  return (
    <div className='space-y-6'>
      <div className='border rounded-lg p-4 space-y-4'>
        <h2 className='font-medium'>Active rule</h2>

        <div className='flex flex-wrap items-end gap-6'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Price threshold (BDT)</p>
            <InputNumber
              min={1}
              value={priceThreshold}
              onChange={setPriceThreshold}
              style={{ width: 180 }}
            />
          </div>

          <div>
            <p className='text-sm text-muted-foreground mb-1'>Excess % (above threshold)</p>
            <InputNumber
              min={0}
              max={100}
              value={excessPct}
              onChange={setExcessPct}
              style={{ width: 180 }}
            />
          </div>

          <div>
            <p className='text-sm text-muted-foreground mb-1'>Active</p>
            <Switch checked={isActive} onChange={setIsActive} />
          </div>

          <div className='grow min-w-[240px]'>
            <p className='text-sm text-muted-foreground mb-1'>Note</p>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='Reason for this change (optional)'
            />
          </div>

          <Button
            type='primary'
            onClick={confirmSave}
            loading={loading}
            className='bg-[#f29456]! border-[#f29456]! hover:bg-[#f29456] hover:border-[#f29456]'
          >
            Save
          </Button>
        </div>

        <div className='rounded bg-muted/40 border p-3 text-sm'>
          Example (merchant at {SAMPLE_MERCHANT_PCT}%): Price {SAMPLE_PRICE} →{" "}
          {fmt(firstSlice)} × {SAMPLE_MERCHANT_PCT}% + ({SAMPLE_PRICE} − {fmt(firstSlice)}) ×{" "}
          {fmt(excess)}% = {fmt(base)} + {fmt(excessEarning)} = <strong>{fmt(total)} BDT</strong>{" "}
          per unit
        </div>
      </div>

      <div className='border rounded-lg p-4'>
        <h2 className='font-medium mb-3'>History</h2>
        <Table
          rowKey='id'
          dataSource={history}
          columns={columns}
          loading={historyLoading}
          pagination={{ pageSize: 10 }}
          size='small'
        />
      </div>
    </div>
  );
}
