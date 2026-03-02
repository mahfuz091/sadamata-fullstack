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
export async function getOrders(arg1 = null, arg2 = {}) {
  try {
    // ✅ support both call styles
    const filters =
      arg1 && typeof arg1 === "object" && !Array.isArray(arg1) ? arg1 : arg2;

    const {
      page = 1,
      pageSize = 10,
      status = null,
      q = "",
      from = null, // "YYYY-MM-DD"
      to = null, // "YYYY-MM-DD"
    } = filters;

    console.log("filters", { status, from, to, q, page, pageSize });

    const safePage = Math.max(Number(page) || 1, 1);
    const take = Math.min(Math.max(Number(pageSize) || 10, 1), 100);
    const skip = (safePage - 1) * take;

    const where = {};

    // ✅ STATUS FILTER
    if (status) where.status = status;

    // ✅ DATE RANGE FILTER (createdAt)
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setDate(end.getDate() + 1);
        where.createdAt.lt = end;
      }
    }

    // ✅ SEARCH
    const query = q?.trim();
    if (query) {
      where.OR = [
        { id: { contains: query, mode: "insensitive" } },
        { tranId: { contains: query, mode: "insensitive" } },
        { user: { name: { contains: query, mode: "insensitive" } } },
        { user: { email: { contains: query, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          GuestAddress: true,
          address: true,
          items: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items: orders.map(serializeOrder),
        meta: {
          total,
          page: safePage,
          pageSize: take,
          totalPages: Math.ceil(total / take),
        },
      },
    };
  } catch (err) {
    console.error("getOrders error:", err);
    return { success: false, msg: "Failed to fetch orders" };
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
        GuestAddress: true,
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
