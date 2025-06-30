import Image from "next/image";
import Link from "next/link";

// Static image imports
import img1 from "@/assets/images/resources/overview-1-1.jpg";
import img2 from "@/assets/images/resources/overview-1-2.jpg";
import img3 from "@/assets/images/resources/overview-1-3.jpg";
import img4 from "@/assets/images/resources/overview-1-4.jpg";

export default function OverviewSection() {
  const cards = [
    {
      title: "Royalty Calculation",
      text: "Information on how your royalty payment is calculated",
      img: img1,
    },
    {
      title: "Content Policy",
      text: "Information on our content policy",
      img: img2,
    },
    {
      title: "Best Practices",
      text: "Best practices for using our portal",
      img: img3,
    },
    {
      title: "Promote Your Merch",
      text: "Amazon Advertising resources and best practices",
      img: img4,
    },
  ];

  return (
    <section className='overview-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          {/* Sidebar */}
          <div className='col-lg-3'>
            <aside className='overview-area__list-area'>
              <div className='overview-area__list-area__item'>
                <h2 className='overview-area__list-area__title'>Resources</h2>
                <ul className='overview-area__list list-unstyled'>
                  {[
                    "Merch on demand overview",
                    "Best practices",
                    "Royalties",
                    "Content policies",
                    "Promote your merch",
                    "Download product templates",
                    "FAQs",
                    "Legal",
                    "Services agreement",
                    "Program materials license agreement",
                    "Terms of use",
                    "Merch collab by amazon print-on-demand schedule",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className={
                        item === "Merch on demand overview" ? "active" : ""
                      }
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='overview-area__list-area__item-two'>
                <h2 className='overview-area__list-area__title'>Contact Us</h2>
                <p className='overview-area__list-area__text'>
                  Have feedback? Can&apos;t find answers?
                </p>
                <Link href='/contact.html' className='commerce-btn'>
                  Contact Us <i className='icon-right-arrow'></i>
                </Link>
              </div>
            </aside>
          </div>

          {/* Main Content */}
          <div className='col-lg-9'>
            <div className='overview-area__content'>
              <h2 className='overview-area__title'>
                Amazon Merch on Demand Overview
              </h2>
              <p className='overview-area__text'>
                Amazon Merch on Demand makes it easy for you to create, promote
                and market your branded merchandise with no risk and no up-front
                costs. You simply supply the artwork, choose the product type
                and color(s), and then promote your products in your app, blog
                or on social media. Amazon takes care of the rest, including
                production, sales, shipping and creating a product page on
                Amazon.com - all at no cost to you.
              </p>

              <div className='row gutter-y-32 gutter-x-30'>
                {cards.map((item, index) => (
                  <div className='col-md-6' key={index}>
                    <div className='overview-area__item'>
                      <div className='overview-area__item__image'>
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={600}
                          height={400}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <div className='overview-area__item__content'>
                        <h4 className='overview-area__item__title'>
                          <Link href='#'>{item.title}</Link>
                        </h4>
                        <p className='overview-area__item__text'>{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
