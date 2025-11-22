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
              Become a Sadamata Made Merch Creator
              </h2>
              <p className='content-creator-one__text'>
                Turn your ideas into reality with custom tees, hoodies, mugs, and more, all made on demand. You focus on designing, and we take care of the printing and delivery across Bangladesh.

              </p>
              <p className='content-creator-one__text'>
                At Sadamata Made Merch, you don’t just sell your own designs. We also connect you with different brands. Work with them directly, create exclusive designs, and unlock extra earnings with added benefits.
              </p>
              <p className='content-creator-one__text'>
                👉 No other marketplace in the world offers this opportunity, which makes Sadamata truly unique.

              </p>
              <Link href='/signup' className='commerce-btn'>
                Register <i className='icon-right-arrow'></i>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className='col-lg-6'>
            <div className='content-creator-one__thumb'>
              <Image
                src='/images/print.png'
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
