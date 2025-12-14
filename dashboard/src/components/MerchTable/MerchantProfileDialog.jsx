"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function MerchantProfileDialog({ open, onOpenChange, profile }) {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Merchant Profile Details</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <Field label='Full Name' value={profile.fullName} />
          <Field
            label='Date of Birth'
            value={new Date(profile.dateOfBirth).toLocaleDateString()}
          />
          <Field label='Contact Email' value={profile.contactEmail} />
          <Field label='Contact Phone' value={profile.contactPhone} />
          <Field label='NID / Passport' value={profile.nidOrPassportNo} />
          <Field label='Tier'>
            <Badge>{profile.tiar}</Badge>
          </Field>

          <Field label='Present Address' value={profile.presentAddress} full />
          <Field
            label='Permanent Address'
            value={profile.permanentAddress}
            full
          />

          <Field label='Bank Name' value={profile.bankName} />
          <Field label='Branch' value={profile.bankBranch} />
          <Field label='Account Name' value={profile.accountName} />
          <Field label='Account Number' value={profile.accountNumber} />
          <Field label='Routing Number' value={profile.routingNumber} />

          {profile.websiteUrl && (
            <Field label='Website' value={profile.websiteUrl} />
          )}
          {profile.portfolioUrl && (
            <Field label='Portfolio' value={profile.portfolioUrl} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className='text-muted-foreground'>{label}</p>
      <p className='font-medium break-all'>{value || "-"}</p>
    </div>
  );
}
