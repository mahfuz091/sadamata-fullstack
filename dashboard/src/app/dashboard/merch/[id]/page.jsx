import MerchantAdminActions from "@/components/MerchTable/MerchantAdminActions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Merchant Details",
};

export default async function MerchantDetailsPage({ params }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      merchantProfile: true,
    },
  });

  if (!user || !user.merchantProfile) {
    notFound();
  }

  const merchantId = user.id;

  const commission = await prisma.commissionSetting.findFirst({
    where: {
      merchantId,
      brandId: null,
      productId: null,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const p = user.merchantProfile;
  const merchantCommissionPct = commission?.merchantCommissionPct ?? 10;

  const merchantPct = commission?.merchantCommissionPct ?? 10;
  const merchDailyLimitPct = user?.merchantProfile?.dailyLimitPct ?? 10;

  //   const merchantEarning = (total * merchantPct) / 100;

  return (
    <div className='p-6 space-y-8'>
      <h1 className='text-2xl font-semibold'>Merchant Details</h1>

      {/* Personal Info */}
      <Section title='Personal Information'>
        <Item label='Full Name' value={p.fullName} />
        <Item label='Date of Birth' value={p.dateOfBirth.toDateString()} />
        <Item label='Email' value={p.contactEmail} />
        <Item label='Phone' value={p.contactPhone} />
        <Item label='NID / Passport' value={p.nidOrPassportNo} />
      </Section>

      {/* Address Info */}
      <Section title='Address Information'>
        <Item label='Present Address' value={p.presentAddress} />
        <Item label='Permanent Address' value={p.permanentAddress} />
        <Item label='Country' value={p.country} />
        <Item label='Zip Code' value={p.zipCode} />
      </Section>

      {/* Bank Info */}
      <Section title='Bank Information'>
        <Item label='Bank Name' value={p.bankName} />
        <Item label='Branch' value={p.bankBranch} />
        <Item label='Account Name' value={p.accountName} />
        <Item label='Account Number' value={p.accountNumber} />
        <Item label='Routing Number' value={p.routingNumber} />
      </Section>

      <Section title='Messages'>
        <Item label='Messages' value={p.message} />
      </Section>

      {/* System Info */}
      <Section title='System Information'>
        <Item label='Tier' value={p.tiar} />
        <Item label='Remaining Tier' value={p.leftTiar} />
        <Item
          label='Brand Option'
          value={p.brandOption ? "Enabled" : "Disabled"}
        />
        <Item
          label='Account Status'
          value={user.isActive ? "Active" : "Inactive"}
        />
      </Section>

      <MerchantAdminActions
        userId={user.id}
        initialTiar={p.tiar}
        initialBrandOption={p.brandOption}
        initialCommission={merchantCommissionPct}
        initialDailyLimitPct={merchDailyLimitPct}
      />
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
  return (
    <div className='border rounded-lg p-4'>
      <h2 className='text-lg font-medium mb-4'>{title}</h2>
      <div className='grid grid-cols-2 gap-2'>{children}</div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-medium break-all'>{value || "-"}</p>
    </div>
  );
}
