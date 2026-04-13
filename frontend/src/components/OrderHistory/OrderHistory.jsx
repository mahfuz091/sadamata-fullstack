import Link from "next/link";
import { COLOR_MAP } from "@/utils/helper";

const activeStatuses = new Set(["PENDING", "PAID", "SHIPPED"]);

function formatDate(date) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatMoney(value, currency = "BDT") {
  return `${currency} ${Number(value || 0).toFixed(2)}`;
}

function getStatusLabel(status) {
  return String(status || "PENDING").toLowerCase().replace("_", " ");
}

function getColorName(color) {
  if (!color) return "";
  return COLOR_MAP[String(color).toLowerCase()] || color;
}

function getOrderSummary(order) {
  const count = order.items.reduce((total, item) => total + item.quantity, 0);
  const titles = order.items.map((item) => item.productTitle).filter(Boolean);

  if (!titles.length) return `${count} item${count === 1 ? "" : "s"}`;

  return titles.length === 1
    ? titles[0]
    : `${titles[0]} + ${titles.length - 1} more`;
}

function OrderItemImage({ item, productImages }) {
  const image =
    productImages[item.id] || (item.productId ? productImages[item.productId] : null);

  if (image) {
    return (
      <img
        src={image}
        alt={item.productTitle}
        className='order-history__item-img'
      />
    );
  }

  return (
    <div className='order-history__item-fallback'>
      {item.productTitle?.charAt(0)?.toUpperCase() || "S"}
    </div>
  );
}

function OrderCard({ order, productImages, productLinks }) {
  const address = order.address || order.guestAddress;
  const canReviewOrder = order.status === "COMPLETED";

  return (
    <article className='order-history__card'>
      <div className='order-history__card-top'>
        <div>
          <p className='order-history__eyebrow'>Order #{order.tranId}</p>
          <h3 className='order-history__card-title'>{getOrderSummary(order)}</h3>
        </div>
        <span
          className={`order-history__status order-history__status--${String(
            order.status
          ).toLowerCase()}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className='order-history__meta'>
        <span>Placed: {formatDate(order.createdAt)}</span>
        <span>Items: {order.items.length}</span>
        <span>Total: {formatMoney(order.grandTotal, order.currency)}</span>
      </div>

      <div className='order-history__items'>
        {order.items.map((item) => {
          const productPublicId = item.productId ? productLinks[item.productId] : null;
          const canReviewItem =
            canReviewOrder && productPublicId && !item.ProductReview;

          return (
            <div className='order-history__item' key={item.id}>
              <OrderItemImage item={item} productImages={productImages} />
              <div className='order-history__item-info'>
                <h4>{item.productTitle}</h4>
                <p>
                  Qty {item.quantity}
                  {item.size ? ` / Size ${item.size}` : ""}
                  {item.color ? ` / ${getColorName(item.color)}` : ""}
                  {item.fitType ? ` / ${item.fitType}` : ""}
                </p>
              </div>
              <div className='order-history__item-action'>
                <strong>
                  {formatMoney(
                    Number(item.unitPrice) * item.quantity,
                    order.currency
                  )}
                </strong>
                {canReviewItem ? (
                  <Link
                    href={`/products/${productPublicId}?reviewOrderItem=${item.id}#product-reviews`}
                    className='commerce-btn order-history__review-btn'
                  >
                    Review
                  </Link>
                ) : item.ProductReview ? (
                  <span className='order-history__reviewed'>Reviewed</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className='order-history__footer'>
        <div>
          <span>Delivery Address</span>
          <p>
            {address
              ? `${address.firstName || ""} ${address.lastName || ""}, ${
                  address.address || ""
                }`.trim()
              : "Address not available"}
          </p>
        </div>
        <div className='order-history__totals'>
          <span>Subtotal {formatMoney(order.subtotal, order.currency)}</span>
          {Number(order.discount) > 0 && (
            <span>Discount -{formatMoney(order.discount, order.currency)}</span>
          )}
          <strong>{formatMoney(order.grandTotal, order.currency)}</strong>
        </div>
      </div>
    </article>
  );
}

function OrderList({ title, text, orders, productImages, productLinks }) {
  return (
    <div className='order-history__section'>
      <div className='order-history__section-head'>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      {orders.length ? (
        <div className='order-history__list'>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              productImages={productImages}
              productLinks={productLinks}
            />
          ))}
        </div>
      ) : (
        <div className='order-history__empty'>
          <h4>No orders here yet</h4>
          <p>When an order reaches this stage, it will appear in this list.</p>
        </div>
      )}
    </div>
  );
}

const OrderHistory = ({
  orders,
  user,
  productImages = {},
  productLinks = {},
}) => {
  const currentOrders = orders.filter((order) => activeStatuses.has(order.status));
  const previousOrders = orders.filter(
    (order) => !activeStatuses.has(order.status)
  );
  const totalSpent = orders.reduce(
    (total, order) => total + Number(order.grandTotal || 0),
    0
  );

  return (
    <section className='user-profile order-history'>
      <div className='container'>
        <div className='user-profile-top__text-box'>
          <h2 className='user-profile-top__title'>Order History</h2>
          <p className='user-profile-top__text'>
            Check your current orders and review everything you ordered before.
          </p>
        </div>

        <div className='user-profile__form order-history__shell'>
          <aside className='user-profile__info order-history__sidebar'>
            <div className='order-history__profile'>
              <img
                src={
                  user?.profileImage
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}/${user.profileImage}`
                    : "/assets/images/resources/avater.png"
                }
                alt={user?.name || "User"}
              />
              <h1>{user?.name || "Customer"}</h1>
              <p>{user?.email || user?.phone || "Signed in user"}</p>
            </div>

            <div className='order-history__stats'>
              <div>
                <span>Total Orders</span>
                <strong>{orders.length}</strong>
              </div>
              <div>
                <span>Current</span>
                <strong>{currentOrders.length}</strong>
              </div>
              <div>
                <span>Total Spent</span>
                <strong>BDT {totalSpent.toFixed(2)}</strong>
              </div>
            </div>

            <ul className='user-profile__info__menu list-unstyled'>
              <li className='user-profile__info__menu__item'>
                <Link href='/profile'>My Account</Link>
              </li>
              <li className='user-profile__info__menu__item'>
                <Link href='/favorites'>My Favorites</Link>
              </li>
              <li className='user-profile__info__menu__item'>
                <Link href='/'>Back to Home</Link>
              </li>
            </ul>
          </aside>

          <div className='order-history__content'>
            {orders.length ? (
              <>
                <OrderList
                  title='Current Order'
                  text='Orders that are pending, paid, or on the way.'
                  orders={currentOrders}
                  productImages={productImages}
                  productLinks={productLinks}
                />
                <OrderList
                  title='Previous Orders'
                  text='Completed, cancelled, or failed orders stay here for reference.'
                  orders={previousOrders}
                  productImages={productImages}
                  productLinks={productLinks}
                />
              </>
            ) : (
              <div className='order-history__empty order-history__empty--main'>
                <h3>No orders yet</h3>
                <p>Your order history will appear here after checkout.</p>
                <Link href='/products' className='commerce-btn'>
                  Browse products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderHistory;
