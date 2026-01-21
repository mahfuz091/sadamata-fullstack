"use client";

import { useState } from "react";
import { Button, InputNumber, Switch, message } from "antd";

import {
  updateMerchantAdminSettings,
  updateMerchantDailyLimitPctAction,
} from "@/app/actions/user/user.actions";
import { setMerchantCommission } from "@/app/actions/user/setMerchantCommission";

export default function MerchantAdminActions({
  userId,
  initialTiar,
  initialBrandOption,
  initialCommission,
  initialDailyLimitPct, // <-- add this prop
}) {
  // Admin settings
  const [tiar, setTiar] = useState(initialTiar);
  const [brandOption, setBrandOption] = useState(initialBrandOption);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateMerchantAdminSettings(null, {
        userId,
        tiar,
        brandOption,
      });

      if (!res?.success) {
        message.error(res?.msg || "Update failed");
        return;
      }
      message.success("Merchant settings updated");
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Commission
  const [commission, setCommission] = useState(initialCommission);
  const [commissionLoading, setCommissionLoading] = useState(false);

  const saveCommission = async () => {
    setCommissionLoading(true);
    try {
      const res = await setMerchantCommission(null, {
        merchantId: userId,
        merchantCommissionPct: commission,
      });

      if (!res?.success)
        message.error(res?.msg || "Failed to update commission");
      else message.success("Merchant commission updated");
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    } finally {
      setCommissionLoading(false);
    }
  };

  // Daily Limit %
  const [dailyLimitPct, setDailyLimitPct] = useState(initialDailyLimitPct ?? 0);
  const [dailyLimitLoading, setDailyLimitLoading] = useState(false);

  const saveDailyLimitPct = async () => {
    setDailyLimitLoading(true);
    try {
      const res = await updateMerchantDailyLimitPctAction(null, {
        merchantId: userId,
        dailyLimitPct,
      });

      if (!res?.success) {
        message.error(res?.msg || "Failed to update daily limit");
        return;
      }

      // Optional: sync state from response (in case server rounds)
      if (typeof res.dailyLimitPct === "number")
        setDailyLimitPct(res.dailyLimitPct);

      message.success("Merchant daily limit updated");
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    } finally {
      setDailyLimitLoading(false);
    }
  };

  return (
    <>
      <div className='border rounded-lg p-4 space-y-4'>
        <h2 className='text-lg font-medium'>Admin Controls</h2>

        <div className='flex items-center justify-between'>
          <span>Tier</span>
          <InputNumber value={tiar} onChange={setTiar} />
        </div>

        <div className='flex items-center justify-between'>
          <span>Brand Option</span>
          <Switch
            checked={brandOption}
            onChange={setBrandOption}
            checkedChildren='Enabled'
            unCheckedChildren='Disabled'
          />
        </div>

        <div className='flex justify-center md:justify-end'>
          <Button
            type='primary'
            loading={loading}
            onClick={handleSave}
            className='w-fit ml-auto bg-[#f29456]! border-[#f29456] hover:bg-[#ffaa72]! hover:border-[#f29456]'
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className='border rounded-lg p-4 space-y-3'>
        <h2 className='font-medium'>Commission Settings</h2>
        <div className='flex items-end gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Merchant Commission (%)
            </p>
            <InputNumber
              min={0}
              max={100}
              value={commission}
              onChange={setCommission}
            />
          </div>

          <Button
            type='primary'
            onClick={saveCommission}
            loading={commissionLoading}
            className='bg-[#f29456]! border-[#f29456]! hover:bg-[#f29456] hover:border-[#f29456]'
          >
            Save
          </Button>
        </div>
      </div>

      <div className='border rounded-lg p-4 space-y-3'>
        <h2 className='font-medium'>Daily Limit Settings</h2>

        <div className='flex items-end gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>Daily Limit (%)</p>
            <InputNumber
              min={0}
              max={100}
              value={dailyLimitPct}
              onChange={setDailyLimitPct}
            />
          </div>

          <Button
            type='primary'
            onClick={saveDailyLimitPct}
            loading={dailyLimitLoading}
            className='bg-[#f29456]! border-[#f29456]! hover:bg-[#f29456] hover:border-[#f29456]'
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
