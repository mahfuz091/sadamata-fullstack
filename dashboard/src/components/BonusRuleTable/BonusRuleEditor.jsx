"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, InputNumber, Modal, Table, Tag, message } from "antd";
import {
  createBonusRule,
  getBonusRules,
  updateBonusRule,
} from "@/app/actions/settings/bonusRule.actions";

const SCENARIOS = [
  {
    value: "NO_BRAND",
    label: "No brand",
    defaults: { brandPct: 0, merchantPct: 60, platformPct: 40 },
  },
  {
    value: "NON_EXCLUSIVE_BRAND",
    label: "Non-exclusive brand",
    defaults: { brandPct: 40, merchantPct: 30, platformPct: 30 },
  },
  {
    value: "EXCLUSIVE_BRAND",
    label: "Exclusive brand",
    defaults: { brandPct: 60, merchantPct: 20, platformPct: 20 },
  },
];

const fmt = (n) => Number(n || 0).toFixed(2);

function buildForms(active) {
  const out = {};
  for (const s of SCENARIOS) {
    const r = active?.[s.value];
    out[s.value] = {
      id: r?.id ?? null,
      priceThreshold: r?.priceThreshold ?? 1000,
      brandPct: r?.brandPct ?? s.defaults.brandPct,
      merchantPct: r?.merchantPct ?? s.defaults.merchantPct,
      platformPct: r?.platformPct ?? s.defaults.platformPct,
      note: r?.note ?? "",
    };
  }
  return out;
}

const sumOf = (f) =>
  Number(f.brandPct || 0) + Number(f.merchantPct || 0) + Number(f.platformPct || 0);

export default function BonusRuleEditor({ initialRules, initialActive }) {
  const router = useRouter();
  const [forms, setForms] = useState(() => buildForms(initialActive));
  const [loading, setLoading] = useState(null);
  const [rules, setRules] = useState(initialRules ?? []);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => setForms(buildForms(initialActive)), [initialActive]);
  useEffect(() => setRules(initialRules ?? []), [initialRules]);

  const setField = (scenario, key, value) =>
    setForms((prev) => ({ ...prev, [scenario]: { ...prev[scenario], [key]: value } }));

  const reloadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getBonusRules({});
      setRules(res ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const save = async (scenario) => {
    const f = forms[scenario];
    if (sumOf(f) !== 100) {
      message.error("Brand + Merchant + Platform must equal exactly 100%");
      return;
    }
    if (scenario === "NO_BRAND" && Number(f.brandPct) !== 0) {
      message.error("A NO_BRAND rule must keep Brand at 0%");
      return;
    }

    setLoading(scenario);
    try {
      const payload = {
        scenario,
        priceThreshold: Number(f.priceThreshold),
        brandPct: Number(f.brandPct),
        merchantPct: Number(f.merchantPct),
        platformPct: Number(f.platformPct),
        note: f.note || null,
      };
      const res = f.id
        ? await updateBonusRule(null, { id: f.id, ...payload })
        : await createBonusRule(null, payload);

      if (!res?.success) {
        message.error(res?.msg || "Failed to save the bonus rule");
      } else {
        message.success(res?.msg || "Bonus rule saved");
        await reloadHistory();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const confirmSave = (scenario) => {
    Modal.confirm({
      title: "Apply this bonus rule?",
      content: "This applies to new sales only. Existing sales keep their snapshot.",
      okText: "Save",
      cancelText: "Cancel",
      onOk: () => save(scenario),
    });
  };

  const columns = [
    {
      title: "Effective from",
      dataIndex: "effectiveFrom",
      render: (v) => (v ? new Date(v).toLocaleString() : "—"),
    },
    { title: "Scenario", dataIndex: "scenario" },
    { title: "Threshold", dataIndex: "priceThreshold", render: (v) => fmt(v) },
    { title: "Brand %", dataIndex: "brandPct", render: (v) => fmt(v) },
    { title: "Merchant %", dataIndex: "merchantPct", render: (v) => fmt(v) },
    { title: "Platform %", dataIndex: "platformPct", render: (v) => fmt(v) },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (v) => (v ? <Tag color='green'>Active</Tag> : <Tag>Superseded</Tag>),
    },
    { title: "Note", dataIndex: "note", render: (v) => v || "—" },
  ];

  return (
    <div className='space-y-6'>
      {SCENARIOS.map((s) => {
        const f = forms[s.value];
        const sum = sumOf(f);
        return (
          <div className='border rounded-lg p-4 space-y-4' key={s.value}>
            <div className='flex items-center gap-3'>
              <h2 className='font-medium'>{s.label}</h2>
              {f.id ? <Tag color='green'>Active</Tag> : <Tag>Not configured</Tag>}
            </div>

            <div className='flex flex-wrap items-end gap-6'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Price threshold (BDT)</p>
                <InputNumber
                  min={0}
                  value={f.priceThreshold}
                  onChange={(v) => setField(s.value, "priceThreshold", v)}
                  style={{ width: 160 }}
                />
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Brand %</p>
                <InputNumber
                  min={0}
                  max={100}
                  value={f.brandPct}
                  disabled={s.value === "NO_BRAND"}
                  onChange={(v) => setField(s.value, "brandPct", v)}
                  style={{ width: 120 }}
                />
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Merchant %</p>
                <InputNumber
                  min={0}
                  max={100}
                  value={f.merchantPct}
                  onChange={(v) => setField(s.value, "merchantPct", v)}
                  style={{ width: 120 }}
                />
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Platform %</p>
                <InputNumber
                  min={0}
                  max={100}
                  value={f.platformPct}
                  onChange={(v) => setField(s.value, "platformPct", v)}
                  style={{ width: 120 }}
                />
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Total</p>
                <Tag color={sum === 100 ? "green" : "red"}>{sum}%</Tag>
              </div>
              <div className='grow min-w-[220px]'>
                <p className='text-sm text-muted-foreground mb-1'>Note</p>
                <Input
                  value={f.note}
                  onChange={(e) => setField(s.value, "note", e.target.value)}
                  placeholder='Reason for this change (optional)'
                />
              </div>
              <Button
                type='primary'
                onClick={() => confirmSave(s.value)}
                loading={loading === s.value}
                disabled={sum !== 100}
                className='bg-[#f29456]! border-[#f29456]! hover:bg-[#f29456] hover:border-[#f29456]'
              >
                Save
              </Button>
            </div>

            <div className='rounded bg-muted/40 border p-3 text-sm'>
              Example: a unit 500 BDT above the threshold → brand{" "}
              {fmt((500 * Number(f.brandPct || 0)) / 100)}, merchant{" "}
              {fmt((500 * Number(f.merchantPct || 0)) / 100)}, platform{" "}
              {fmt((500 * Number(f.platformPct || 0)) / 100)} BDT.
            </div>
          </div>
        );
      })}

      <div className='border rounded-lg p-4'>
        <h2 className='font-medium mb-3'>History</h2>
        <Table
          rowKey='id'
          dataSource={rules}
          columns={columns}
          loading={historyLoading}
          pagination={{ pageSize: 10 }}
          size='small'
        />
      </div>
    </div>
  );
}
