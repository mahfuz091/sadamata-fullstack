"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get orders with optional date filters
 * @param {Object} filters
 * @param {number} filters.year
 * @param {number} filters.month (1-12)
 * @param {number} filters.day (1-31)
 */

function serializeDecimal(value) {
  if (value === null || value === undefined) return value;
  return Number(value);
}

function serializeDate(value) {
  if (!value) return value;
  return value.toISOString();
}

function serializeOrderItem(item) {
  return {
    ...item,
    unitPrice: serializeDecimal(item.unitPrice),
  };
}

function serializeOrder(order) {
  return {
    ...order,

    // 💰 order money
    subtotal: serializeDecimal(order.subtotal),
    discount: serializeDecimal(order.discount),
    tax: serializeDecimal(order.tax),
    shippingFee: serializeDecimal(order.shippingFee),
    grandTotal: serializeDecimal(order.grandTotal),
    couponRate: order.couponRate ? serializeDecimal(order.couponRate) : null,

    // ⏱ dates
    createdAt: serializeDate(order.createdAt),
    updatedAt: serializeDate(order.updatedAt),
    settledAt: serializeDate(order.settledAt),

    // 📦 items (IMPORTANT FIX)
    items: order.items?.map(serializeOrderItem),

    // relations (safe)
    user: order.user,
    address: order.address,
    payment: order.payment,
  };
}
export async function getOrders(_, filters = {}) {
  try {
    const { year, month, day } = filters;

    let dateFilter = {};

    if (year) {
      const start = new Date(year, month ? month - 1 : 0, day || 1);
      const end = day
        ? new Date(year, month - 1, day + 1)
        : month
        ? new Date(year, month, 1)
        : new Date(year + 1, 0, 1);

      dateFilter = {
        createdAt: {
          gte: start,
          lt: end,
        },
      };
    }

    const orders = await prisma.order.findMany({
      where: dateFilter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        items: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc", // 🔥 latest first
      },
    });

    return {
      success: true,
      data: orders.map(serializeOrder),
    };
  } catch (err) {
    console.error("getOrders error:", err);
    return {
      success: false,
      msg: "Failed to fetch orders",
    };
  }
}
export async function updateOrderStatus(_, { orderId, status }) {
  try {
    if (!orderId || !status) {
      return {
        success: false,
        msg: "Order ID and status are required",
      };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
        ...(status === "PAID" && { settledAt: new Date() }),
      },
    });

    return {
      success: true,
      data: serializeOrder(order),
    };
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return {
      success: false,
      msg: "Failed to update order status",
    };
  }
}
export async function deleteOrder(_, { orderId }) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });

    return {
      success: true,
    };
  } catch (err) {
    console.error("deleteOrder error:", err);
    return {
      success: false,
      msg: "Failed to delete order",
    };
  }
}
export async function getSingleOrder(_, { orderId }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            Sale: {
              include: {
                product: {
                  include: {
                    variants: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return { success: false, msg: "Order not found" };
    }

    return { success: true, data: serializeOrder(order) };
  } catch (e) {
    console.error("getSingleOrder error", e);
    return { success: false, msg: "Failed to fetch order" };
  }
}
