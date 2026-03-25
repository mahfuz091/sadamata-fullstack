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

  // Pre-sign URLs for all items
  const itemsWithSignedUrls = await Promise.all(
    (order?.items || []).map(async (item) => {
      const sale = item.Sale?.[0] || item.Sale; // Handle both array and object if needed
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
