import MerchantTierCommissionEditor from "@/components/MerchantTierTable/MerchantTierCommissionEditor";
import {
  getMerchantBonusRule,
  getMerchantBonusRuleHistory,
} from "@/app/actions/user/merchantBonusRule.actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [rule, history] = await Promise.all([
    getMerchantBonusRule(),
    getMerchantBonusRuleHistory({ page: 1, pageSize: 20 }),
  ]);

  return (
    <div className='p-4 md:p-6'>
      <h1 className='text-xl font-semibold mb-1'>Merchant Tier Commission Settings</h1>
      <p className='text-sm text-muted-foreground mb-4'>
        Merchants earn the regular percentage on the first slice of each unit price and the
        excess rate on the rest. Changes apply to new orders only.
      </p>
      <MerchantTierCommissionEditor
        initialRule={rule}
        initialHistory={history.items}
      />
    </div>
  );
}
