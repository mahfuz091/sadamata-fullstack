import { getSingleOrder } from "@/app/actions/order/order.actions";
import { COLOR_MAP } from "@/lib/constants";
import { getPrivateUrl } from "@/lib/s3";
import { Card, Divider, Tag, Button } from "antd";
import DownloadButton from "../../products/_components/DownloadButton";

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const res = await getSingleOrder(null, { orderId: id });

  if (!res?.success) return <div>Order not found</div>;

  const order = res.data;
  console.log("order", id, order);

  const SIGN_EXPIRES = 60 * 60; // 1 hour
  async function sign(key) {
    return key ? await getPrivateUrl(key, SIGN_EXPIRES) : null;
  }

  // OrderItem.Sale is a one-to-one (Sale?), not a list
  const saleOf = (item) => item.Sale || null;

  const bdt = (n) =>
    `৳${Number(n ?? 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const pctOf = (part, whole) =>
    whole ? `${((Number(part) / Number(whole)) * 100).toFixed(2)}%` : "—";

  // order-level roll-up across every settled line
  const settled = (order?.items || []).map(saleOf).filter(Boolean);
  const totals = settled.reduce(
    (acc, s) => ({
      total: acc.total + Number(s.total || 0),
      brand: acc.brand + Number(s.brandEarning || 0),
      merchant: acc.merchant + Number(s.merchantEarning || 0),
      platform: acc.platform + Number(s.platformEarning || 0),
    }),
    { total: 0, brand: 0, merchant: 0, platform: 0 },
  );

  // Pre-sign URLs for all items
  const itemsWithSignedUrls = await Promise.all(
    (order?.items || []).map(async (item) => {
      const sale = saleOf(item);
      const product = sale?.product;

      const variant = product?.variants?.find(
        (v) => v.color === item.color && v.fitType === item.fitType
      );
      const variantToSign = variant || product?.variants?.[0];

      const [displayImgUrl, frontDesignUrl, backDesignUrl] = await Promise.all([
        sign(variantToSign?.frontImg),
        sign(product?.frontDesign),
        sign(product?.backDesign),
      ]);

      return {
        ...item,
        sale,
        displayImgUrl,
        frontDesignUrl,
        backDesignUrl,
        frontDesignKey: product?.frontDesign,
        backDesignKey: product?.backDesign,
        productId: product?.id,
      };
    })
  );

  return (
    <div className='space-y-6'>
      {/* ORDER SUMMARY */}
      <Card title={`Order #${order.id}`}>
        <p>
          <b>Status:</b> <Tag>{order.status}</Tag>
        </p>
        <p>
          <b>Total:</b> ৳{order.grandTotal}
        </p>
        <p>
          <b>Customer:</b> {order.user? order.user?.name:order.GuestAddress?.firstName + " " + order.GuestAddress?.lastName}
        </p>
        <p>
          <b>Email:</b> {order.user?.email || order.GuestAddress?.email}
        </p>
        <p>
          <b>Address:</b>{" "}
          {order.address
            ? `${order?.address?.address},  ${order?.address?.zipCode ?? ""}`
            : `${order.GuestAddress?.address || "N/A"}, ${order.GuestAddress?.zipCode || "N/A"}`}
        </p>
      </Card>

      {/* EARNINGS SPLIT */}
      <Card title='Earnings Split'>
        {settled.length === 0 ? (
          <p className='text-sm text-gray-500'>
            Not settled yet — earnings are written when payment succeeds.
          </p>
        ) : (
          <>
            <div className='flex flex-wrap gap-8'>
              <div>
                <p className='text-xs text-gray-500'>Settled line total</p>
                <p className='text-lg font-semibold'>{bdt(totals.total)}</p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Brand</p>
                <p className='text-lg font-semibold'>{bdt(totals.brand)}</p>
                <p className='text-xs text-gray-500'>
                  {pctOf(totals.brand, totals.total)}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Merchant</p>
                <p className='text-lg font-semibold'>{bdt(totals.merchant)}</p>
                <p className='text-xs text-gray-500'>
                  {pctOf(totals.merchant, totals.total)}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Platform</p>
                <p className='text-lg font-semibold'>{bdt(totals.platform)}</p>
                <p className='text-xs text-gray-500'>
                  {pctOf(totals.platform, totals.total)}
                </p>
              </div>
            </div>

            {settled.length < (order?.items?.length || 0) && (
              <p className='mt-3 text-sm text-amber-600'>
                {(order?.items?.length || 0) - settled.length} of{" "}
                {order?.items?.length} line(s) have no Sale row — those are not
                included above.
              </p>
            )}

            <p className='mt-3 text-xs text-gray-500'>
              Split taken on the line total (unit price × quantity), so it
              excludes shipping, tax and discount — it will not match{" "}
              {bdt(order.grandTotal)}.
            </p>
          </>
        )}
      </Card>

      <Divider />

      {/* ORDER ITEMS */}
      {itemsWithSignedUrls.map((item) => {
        return (
          <Card key={item.id} title={item.productTitle}>
            <div className='flex gap-6 flex-wrap'>
              {/* PRODUCT IMAGE (MATCH VARIANT) */}
              {item.displayImgUrl ? (
                <img
                  src={item.displayImgUrl}
                  alt={item.productTitle}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #eee",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    background: "#f5f5f5",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  No Image
                </div>
              )}

              {/* ITEM DETAILS */}
              <div className='space-y-1'>
                <p>
                  <b>Quantity:</b> {item.quantity}
                </p>
                <p>
                  <b>Unit Price:</b> ৳{item.unitPrice}
                </p>
                <p>
                  <b>Line Total:</b> ৳{item.unitPrice * item.quantity}
                </p>
                <p>
                  <b>Color:</b> {COLOR_MAP[item.color] || item.color || "-"}
                </p>
                <p>
                  <b>Fit:</b> {item.fitType || "-"}
                </p>
                <p>
                  <b>Size:</b> {item.size || "-"}
                </p>
              </div>
            </div>

            <Divider />

            {/* COMMISSION / EARNINGS FOR THIS LINE */}
            {item.sale ? (
              <div>
                <div className='flex flex-wrap gap-6'>
                  <div>
                    <p className='text-xs text-gray-500'>Merchant</p>
                    <p className='font-semibold'>
                      {bdt(item.sale.merchantEarning)}{" "}
                      <span className='text-xs font-normal text-gray-500'>
                        ({pctOf(item.sale.merchantEarning, item.sale.total)})
                      </span>
                    </p>
                    <p className='text-xs text-gray-500'>
                      {item.sale.merchant?.name || "—"}
                    </p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-500'>Brand</p>
                    <p className='font-semibold'>
                      {bdt(item.sale.brandEarning)}{" "}
                      <span className='text-xs font-normal text-gray-500'>
                        ({pctOf(item.sale.brandEarning, item.sale.total)})
                      </span>
                    </p>
                    <p className='text-xs text-gray-500'>
                      {item.sale.brand?.name || "No brand"}
                      {item.sale.brand?.isExclusive && (
                        <Tag color='gold' className='ml-1'>
                          Exclusive
                        </Tag>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-500'>Platform</p>
                    <p className='font-semibold'>
                      {bdt(item.sale.platformEarning)}{" "}
                      <span className='text-xs font-normal text-gray-500'>
                        ({pctOf(item.sale.platformEarning, item.sale.total)})
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-500'>Settled on</p>
                    <p className='font-semibold'>
                      {new Date(item.sale.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {item.sale.product &&
                  Math.abs(
                    (Number(item.sale.product.brandCommissionPct) || 0) -
                      (item.sale.total
                        ? (Number(item.sale.brandEarning) /
                            Number(item.sale.total)) *
                          100
                        : 0),
                  ) > 0.01 && (
                    <p className='mt-3 text-sm text-amber-600'>
                      Paid brand rate differs from the product&apos;s current
                      frozen rate ({item.sale.product.brandCommissionPct}%) —
                      the rate changed after this sale settled. The amounts
                      above are what was actually recorded.
                    </p>
                  )}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>
                No Sale row for this line — not settled.
              </p>
            )}

            <Divider />

            {/* DESIGN DOWNLOADS (ONLY THESE) */}
            <div className='flex gap-3'>
              {item.frontDesignKey && (
                <DownloadButton
                  type='primary'
                  s3Key={item.frontDesignKey}
                  filename={`front-design-${item.productId}.png`}
                >
                  Download Front Design
                </DownloadButton>
              )}

              {item.backDesignKey && (
                <DownloadButton
                  s3Key={item.backDesignKey}
                  filename={`back-design-${item.productId}.png`}
                >
                  Download Back Design
                </DownloadButton>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
