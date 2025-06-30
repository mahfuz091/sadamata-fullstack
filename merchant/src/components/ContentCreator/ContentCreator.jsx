import Image from "next/image";
import Link from "next/link";
import aboutImg from "@/assets/images/about/about-1-1.jpg";

export default function ContentCreator() {
  return (
    <section className='content-creator-one'>
      <div className='container'>
        <div className='row gutter-y-32 align-items-center'>
          {/* Text Content */}
          <div className='col-lg-6'>
            <div className='content-creator-one__content'>
              <h2 className='section-title'>
                Become a Merch on Demand content creator
              </h2>
              <p className='content-creator-one__text'>
                Share your designs with the world by creating graphic tees,
                accessories, and more, all printed on demand. We handle your
                printing and shipping, so you can design while we deliver.
              </p>
              <Link href='/product.html' className='commerce-btn'>
                Shop Now <i className='icon-right-arrow'></i>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className='col-lg-6'>
            <div className='content-creator-one__thumb'>
              <Image
                src={aboutImg}
                alt='commerce image'
                width={600}
                height={400}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
