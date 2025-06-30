import Image from "next/image";
import Link from "next/link";

// Static image imports
import img1 from "@/assets/images/blog/recurring-1-1.jpg";
import img2 from "@/assets/images/blog/recurring-1-2.jpg";
import img3 from "@/assets/images/blog/recurring-1-3.jpg";
import img4 from "@/assets/images/blog/recurring-1-4.jpg";
import img5 from "@/assets/images/blog/recurring-1-5.jpg";

export default function RecurringProduct() {
  const items = [
    {
      title: "Earn royalties",
      text: "We pay you a royalty on every product sold.",
      image: img1,
    },
    {
      title: "No inventory risk",
      text: "Don't worry about unsold stock. We'll print your product after each sale using world-class print technology.",
      image: img2,
    },
    {
      title: "Prime Shipping",
      text: "All of our products are eligible for Prime Shipping so your customers can receive orders quickly.",
      image: img3,
    },
    {
      title: "Reach new customers",
      text: "Your products will be available to hundreds of millions of customers.",
      image: img4,
    },
    {
      title: "Track your success",
      text: "Use our analysis tools for insights on your best-selling designs and watch your revenue grow.",
      image: img5,
    },
  ];

  return (
    <section className='recurring-product'>
      <div className='container'>
        <div className='row justify-content-center gutter-y-32 gutter-x-30'>
          {items.map((item, index) => (
            <div className='col-lg-4 col-md-6' key={index}>
              <div className='recurring-product__item'>
                <div className='recurring-product__item__image'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div className='recurring-product__item__content'>
                  <h4 className='recurring-product__item__title'>
                    <Link href='#'>{item.title}</Link>
                  </h4>
                  <p className='recurring-product__item__text'>{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
