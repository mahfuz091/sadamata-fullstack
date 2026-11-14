import BonusRuleEditor from "@/components/BonusRuleTable/BonusRuleEditor";
import {
  getActiveBonusRulesForAdmin,
  getBonusRules,
} from "@/app/actions/settings/bonusRule.actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [rules, active] = await Promise.all([
    getBonusRules({}),
    getActiveBonusRulesForAdmin(),
  ]);

  return (
    <div className='p-4 md:p-6'>
      <h1 className='text-xl font-semibold mb-1'>Bonus Rules</h1>
      <p className='text-sm text-muted-foreground mb-4'>
        The amount above each scenario&apos;s price threshold is split between the
        brand, merchant and platform. The normal commission still applies to the
        part up to the threshold.
      </p>
      <p className='text-sm text-muted-foreground mb-4'>
        Brand + Merchant + Platform must total exactly <strong>100%</strong>. A NO_BRAND
        rule must keep Brand at 0%. Only one rule per scenario is active at a time;
        changing a rule only affects new sales — past sales keep their snapshot.
      </p>
      <BonusRuleEditor initialRules={rules} initialActive={active} />
    </div>
  );
}
