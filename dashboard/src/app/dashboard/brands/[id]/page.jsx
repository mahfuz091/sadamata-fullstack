import BrandCommissionEditor from "@/components/BrandsTable/BrandCommissionEditor";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BrandCategorySection from "../_components/BrandCategorySection";

export const metadata = {
  title: "Brand Details",
};

export default async function BrandDetailsPage({ params }) {
  const { id } = await params;

  const brand = await prisma.user.findUnique({
    where: { id },
    include: {
      products: {
        select: { id: true },
      },
      brand: {
        include: {
          brandCategory: true,
          productCategory: true,
        },
      },
    },
  });

  if (!brand) {
    notFound();
  }

  const allCategories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  const brandCommission = await prisma.commissionSetting.findFirst({
    where: {
      brandId: brand.brand?.id,
      merchantId: null,
      productId: null,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("brandCommission", brandCommission);
  

  const brandCommissionPct =
    brandCommission?.brandCommissionPct ?? brand.defaultBrandPct ?? 10;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Brand Details</h1>

      <Section title="Brand Summary">
        <Item label="Brand Name" value={brand.name} />
        <Item
          label="Category"
          value={
            brand.brand?.productCategory?.name ||
            brand.brand?.brandCategory?.name ||
            "-"
          }
        />
        <Item label="Status" value={brand.isActive ? "Active" : "Inactive"} />
        <Item
          label="Exclusivity"
          value={
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                brand.brand?.isExclusive
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {brand.brand?.isExclusive ? "Exclusive" : "Non-Exclusive"}
            </span>
          }
        />
        <Item label="Owner" value={brand.name} />
        <Item label="Owner Email" value={brand.email} />
      </Section>

      <Section title="Assign Product Category">
        <BrandCategorySection
          brandId={brand.brand?.id}
          selectedCategory={brand.brand?.productCategory}
          allCategories={allCategories}
        />
      </Section>

      <Section title="Personal Information">
        <Item
          label="Date of Birth"
          value={brand.brand?.dateOfBirth?.toDateString() || "-"}
        />
        <Item label="Contact Email" value={brand.brand?.contactEmail} />
        <Item label="Contact Phone" value={brand.brand?.contactPhone} />
        <Item label="NID / Passport" value={brand.brand?.nidOrPassportNo} />
      </Section>

      <Section title="Address Information">
        <Item label="Present Address" value={brand.brand?.presentAddress} />
        <Item label="Permanent Address" value={brand.brand?.permanentAddress} />
        <Item label="Country" value={brand.brand?.country} />
        <Item label="Zip Code" value={brand.brand?.zipCode} />
      </Section>

      <Section title="Bank Information">
        <Item label="Bank Name" value={brand.brand?.bankName} />
        <Item label="Branch" value={brand.brand?.bankBranch} />
        <Item label="Account Name" value={brand.brand?.accountName} />
        <Item label="Account Number" value={brand.brand?.accountNumber} />
        <Item label="Routing Number" value={brand.brand?.routingNumber} />
      </Section>

      <Section title="Additional Information">
        <Item label="Industry Type" value={brand.brand?.industryType} />
        <Item label="Social Profile" value={brand.brand?.socialProfile} />
        <Item label="Website" value={brand.brand?.websiteUrl} />
        <Item label="Portfolio" value={brand.brand?.portfolioUrl} />
      </Section>

      <Section title="Messages">
        <Item label="Messages" value={brand.brand?.message} />
      </Section>

      <BrandCommissionEditor
        brandId={brand.id}
        initialCommission={brandCommissionPct}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium break-all">{value || "-"}</p>
    </div>
  );
}