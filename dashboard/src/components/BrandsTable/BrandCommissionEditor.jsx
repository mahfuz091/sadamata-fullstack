"use client";

import { useState } from "react";
import { InputNumber, Button, message } from "antd";
import { setBrandCommission } from "@/app/actions/user/setBrandCommission";

export default function BrandCommissionEditor({ brandId, initialCommission }) {
  const [commission, setCommission] = useState(initialCommission);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);

    const res = await setBrandCommission(null, {
      brandId,
      brandCommissionPct: commission,
    });

    if (!res?.success) {
      message.error(res?.msg || "Failed to update");
    } else {
      message.success("Brand commission updated");
    }

    setLoading(false);
  };

  return (
    <div className='border rounded-lg p-4 space-y-3'>
      <h2 className='font-medium'>Brand Commission</h2>

      <div className='flex items-end gap-4'>
        <div>
          <p className='text-sm text-muted-foreground'>Brand Commission (%)</p>
          <InputNumber
            min={0}
            max={100}
            value={commission}
            onChange={setCommission}
          />
        </div>

        <Button
          type='primary'
          onClick={save}
          loading={loading}
          className='bg-[#f29456]! border-[#f29456]! hover:bg-[#f29456] hover:border-[#f29456]'
        >
          Save
        </Button>
      </div>
    </div>
  );
}
