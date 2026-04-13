import { auth } from "@/auth";
import Layout from "@/components/Layout/Layout";
import OrderHistory from "@/components/OrderHistory/OrderHistory";
import prisma from "@/lib/prisma";
import { getPrivateUrl } from "@/lib/s3";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Order History | Sadamata",
};

function serializeOrder(order) {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    tax: Number(order.tax),
    shippingFee: Number(order.shippingFee),
    grandTotal: Number(order.grandTotal),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      ProductReview: item.ProductReview
        ? {
            ...item.ProductReview,
            createdAt: item.ProductReview.createdAt.toISOString(),
            updatedAt: item.ProductReview.updatedAt.toISOString(),
          }
        : null,
    })),
  };
}

async function resolveImageUrl(imageKey) {
  if (!imageKey) return null;
  if (imageKey.startsWith("http") || imageKey.startsWith("/")) return imageKey;

  try {
    return await getPrivateUrl(imageKey, 3600);
  } catch (error) {
    return null;
  }
}

function getItemImageKey(item, product) {
  if (!product) return null;

  const matchingVariant = product.variants.find((variant) => {
    const colorMatches = item.color ? variant.color === item.color : true;
    const fitMatches = item.fitType ? variant.fitType === item.fitType : true;
    return colorMatches && fitMatches;
  });

  const matchingMockupVariant = product.Mockup?.variants.find((variant) => {
    const colorMatches = item.color ? variant.color === item.color : true;
    const fitMatches = item.fitType ? variant.fitType === item.fitType : true;
    return colorMatches && fitMatches;
  });

  return (
    matchingVariant?.frontImg ||
    matchingMockupVariant?.frontImg ||
    matchingVariant?.backImg ||
    matchingMockupVariant?.backImg ||
    product.frontDesign ||
    product.variants[0]?.frontImg ||
    product.Mockup?.variants[0]?.frontImg ||
    product.backDesign ||
    product.variants[0]?.backImg ||
    product.Mockup?.variants[0]?.backImg ||
    null
  );
}

const OrdersPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [user, rawOrders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        address: true,
        guestAddress: true,
        payment: true,
        items: {
          orderBy: { id: "asc" },
          include: {
            ProductReview: true,
          },
        },
      },
    }),
  ]);

  const productIds = [
    ...new Set(
      rawOrders
        .flatMap((order) => order.items.map((item) => item.productId))
        .filter(Boolean)
    ),
  ];

  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          productId: true,
          frontDesign: true,
          backDesign: true,
          variants: {
            select: {
              color: true,
              fitType: true,
              frontImg: true,
              backImg: true,
            },
          },
          Mockup: {
            select: {
              variants: {
                where: { isVisible: true },
                select: {
                  color: true,
                  fitType: true,
                  frontImg: true,
                  backImg: true,
                },
              },
            },
          },
        },
      })
    : [];

  const productById = new Map(products.map((product) => [product.id, product]));
  const imageEntries = await Promise.all(
    rawOrders.flatMap((order) =>
      order.items.map(async (item) => {
        const product = item.productId ? productById.get(item.productId) : null;
        const imageKey = getItemImageKey(item, product);
        const imageUrl = await resolveImageUrl(imageKey);
        return [item.id, imageUrl];
      })
    )
  );

  const productImages = Object.fromEntries(
    imageEntries.filter(([, imageUrl]) => Boolean(imageUrl))
  );
  const productLinks = Object.fromEntries(
    products.map((product) => [product.id, product.productId])
  );

  return (
    <Layout session={session}>
      <OrderHistory
        orders={rawOrders.map(serializeOrder)}
        user={user}
        productImages={productImages}
        productLinks={productLinks}
      />
    </Layout>
  );
};

export default OrdersPage;

