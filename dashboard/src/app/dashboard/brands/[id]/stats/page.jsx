import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BrandStatsByUser({ params }) {
  const { id }  = await params
  console.log(id, "brandid");
  
  // 1️⃣ Resolve brand from userId
  const brand = await prisma.brand.findUnique({
    where: {
      userId: id, // ✅ KEY FIX
    },
    select: {
      id: true,
      name: true,
      isExclusive: true, // ✅ Include exclusivity status
    },
  });

  if (!brand) notFound();

  // 2️⃣ Product count
  const totalProducts = await prisma.product.count({
    where: { brandId: brand.id },
  });

  // 3️⃣ Sales
  const sales = await prisma.sale.findMany({
    where: { brandId: brand.id },
    select: {
      total: true,
      brandEarning: true,
      productId: true,
      createdAt: true,
    },
  });

  const totalSales = sales.length;

  const totalRevenue = sales.reduce((s, x) => s + Number(x.total), 0);

  const totalBrandEarning = sales.reduce(
    (s, x) => s + Number(x.brandEarning),
    0
  );

  const productsWithSales = new Set(sales.map((s) => s.productId)).size;

  // 4️⃣ Withdrawals
  const payoutAgg = await prisma.payout.aggregate({
    where: {
      brandId: brand.id,
      actor: "BRAND",
    },
    _sum: { amount: true },
  });

  const withdrawn = Number(payoutAgg._sum.amount || 0);
  const balance = totalBrandEarning - withdrawn;

  return (
    <div className='p-6 space-y-8'>
      <h1 className='text-2xl font-semibold flex items-center gap-4'>
        Brand Earnings – {brand.name}
        <span className={`text-xs px-2 py-1 rounded-full ${brand.isExclusive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
          {brand.isExclusive ? 'Exclusive' : 'Non-Exclusive'}
        </span>
      </h1>

      {/* Top Cards */}
      <div className='grid grid-cols-3 gap-4'>
        <Stat title='BDT Balance' value={balance} />
        <Stat title='Total Income' value={totalBrandEarning} />
        <Stat title='Withdrawn' value={withdrawn} />
      </div>

      {/* Sales */}
      <Section title='Sales Report'>
        <Mini label='Total Sales' value={totalSales} />
        <Mini label='Revenue' value={totalRevenue} />
        <Mini label='Products with Sales' value={productsWithSales} />
      </Section>
    </div>
  );
}

/* UI helpers */

function Stat({ title, value }) {
  return (
    <div className='border rounded-lg p-4'>
      <p className='text-sm text-muted-foreground'>{title}</p>
      <p className='text-2xl font-semibold'>৳{value.toFixed(2)}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className='border rounded-lg p-4 space-y-2'>
      <h2 className='font-medium'>{title}</h2>
      <div className='grid grid-cols-3 gap-4'>{children}</div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-semibold'>{value}</p>
    </div>
  );
}
