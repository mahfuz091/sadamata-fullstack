"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, InputNumber, Modal, Switch, Table, Tag, message } from "antd";
import {
  getPartialPaymentRuleHistory,
  updatePartialPaymentRule,
} from "@/app/actions/settings/partialPayment.actions";

const SAMPLE_TOTAL = 1000;

const fmt = (n) => Number(n || 0).toFixed(2);

export default function PartialPaymentEditor({ initialRule, initialHistory }) {
  const router = useRouter();

  const [percent, setPercent] = useState(initialRule?.percent ?? 10);
  const [isEnabled, setIsEnabled] = useState(initialRule?.isEnabled ?? true);
  const [note, setNote] = useState(initialRule?.note ?? "");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(initialHistory ?? []);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!initialRule) return;
    setPercent(initialRule.percent ?? 10);
    setIsEnabled(initialRule.isEnabled ?? true);
    setNote(initialRule.note ?? "");
  }, [initialRule]);

  useEffect(() => {
    setHistory(initialHistory ?? []);
  }, [initialHistory]);

  const pct = Number(percent) || 0;
  const payableNow = fmt((SAMPLE_TOTAL * pct) / 100);
  const due = fmt(SAMPLE_TOTAL - (SAMPLE_TOTAL * pct) / 100);

  const reloadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getPartialPaymentRuleHistory({ page: 1, pageSize: 20 });
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
      const res = await updatePartialPaymentRule(null, {
        percent: Number(percent),
        isEnabled,
        note,
      });
      if (!res?.success) {
        message.error(res?.msg || "Failed to update partial payment settings");
      } else {
        message.success(res?.msg || "Partial payment settings updated");
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
      title: "Apply these partial payment settings?",
      content: "This applies to new orders only. Existing orders are never recalculated.",
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
      title: "Percentage",
      dataIndex: "percent",
      render: (v) => `${fmt(v)}%`,
    },
    {
      title: "Enabled",
      dataIndex: "isEnabled",
      render: (v) => (v ? <Tag color='green'>Enabled</Tag> : <Tag>Disabled</Tag>),
    },
    { title: "Note", dataIndex: "note", render: (v) => v || "—" },
  ];

  return (
    <div className='space-y-6'>
      <div className='border rounded-lg p-4 space-y-4'>
        <h2 className='font-medium'>Active rule</h2>

        <div className='flex flex-wrap items-end gap-6'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Pay now (%)</p>
            <InputNumber
              min={1}
              max={99}
              value={percent}
              onChange={setPercent}
              style={{ width: 180 }}
            />
            <p className='text-xs text-muted-foreground mt-1 max-w-[220px]'>
              Between 1% and 99%. 100% would just be the full payment, so it is not allowed.
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground mb-1'>Enabled</p>
            <Switch checked={isEnabled} onChange={setIsEnabled} />
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
          Example: an order of {SAMPLE_TOTAL} → customer pays{" "}
          <strong>৳{payableNow}</strong> now ({fmt(pct)}%), <strong>৳{due}</strong> left as due.
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
