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
      text: "Don’t worry about unsold stock. We print your products only after each sale using top-quality print technology, so there’s no risk of excess inventory.",
      image: img2,
    },
    {
      title: "Free Shipping",
      text: "Enjoy free shipping on orders over 2,000 BDT within Dhaka and over 5,000 BDT nationwide.",
      image: img3,
    },
    {
      title: "Reach new customers",
      text: "Your products will be exposed to a wide audience, thanks to the brands partnered with us and our dedicated marketing team.",
      image: img4,
    },
    {
      title: "Track your success",
      text: "Use our analytics tools to gain insights on your best-selling designs and monitor your revenue growth. Create more designs for the brands you work with to maximize your earnings.",
      image: img5,
    },
    {
      title: "Need Help?",
      text: "We’ve got you covered with dedicated email support to answer your questions and resolve any issues.",
      image: "/images/print.png",
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
                    width={460}
                    height={300}
                    style={{ width: "100%", height: "auto", maxHeight: "300px" }}
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
