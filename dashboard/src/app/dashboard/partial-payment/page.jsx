import PartialPaymentEditor from "@/components/PartialPaymentTable/PartialPaymentEditor";
import {
  getPartialPaymentRule,
  getPartialPaymentRuleHistory,
} from "@/app/actions/settings/partialPayment.actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [rule, history] = await Promise.all([
    getPartialPaymentRule(),
    getPartialPaymentRuleHistory({ page: 1, pageSize: 20 }),
  ]);

  return (
    <div className='p-4 md:p-6'>
      <h1 className='text-xl font-semibold mb-1'>Partial Payment Settings</h1>
      <p className='text-sm text-muted-foreground mb-4'>
        Let customers pay a percentage of the order now and leave the rest as due.
        At checkout they can still choose to pay the full amount.
      </p>
      <p className='text-sm text-muted-foreground mb-4'>
        The percentage below applies to <strong>new orders only</strong>. When disabled, the
        partial-payment option is hidden at checkout.
      </p>
      <PartialPaymentEditor initialRule={rule} initialHistory={history.items} />
    </div>
  );
}
