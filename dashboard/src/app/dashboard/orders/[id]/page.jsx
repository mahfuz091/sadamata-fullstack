import { getSingleOrder } from "@/app/actions/order/order.actions";
import { Card, Divider, Tag, Button } from "antd";

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const res = await getSingleOrder(null, { orderId: id });

  if (!res?.success) return <div>Order not found</div>;

  const order = res.data;
  console.log("order" , order);
  

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
            ? `${order.address},  ${order.address.zipCode}`
            : `${order.GuestAddress?.address || "N/A"}, ${order.GuestAddress?.zipCode || "N/A"}`}
        </p>
      </Card>

      <Divider />

      {/* ORDER ITEMS */}
      {order.items.map((item) => {
        // first sale → product (safe assumption per item)
        const sale = item.Sale?.[0];
        const product = sale?.product;

        return (
          <Card key={item.id} title={item.productTitle}>
            <div className='flex gap-6 flex-wrap'>
              {/* PRODUCT IMAGE (PREVIEW ONLY) */}
              {product?.variants?.[0]?.frontImg && (
                <img
                  src={product.variants[0].frontImg}
                  alt={item.productTitle}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #eee",
                  }}
                />
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
                  <b>Color:</b> {item.color || "-"}
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
              {product?.frontDesign && (
                <Button
                  type='primary'
                  href={product.frontDesign}
                  target='_blank'
                  download
                >
                  Download Front Design
                </Button>
              )}

              {product?.backDesign && (
                <Button href={product.backDesign} target='_blank' download>
                  Download Back Design
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
