import Image from "next/image";
import Link from "next/link";
import aboutImg from "@/assets/images/about/about-1-1.png";

export default function ContentCreator() {
  return (
    <section className='content-creator-one'>
      <div className='container'>
        <div className='row gutter-y-32 align-items-center'>
          {/* Text Content */}
          <div className='col-lg-6'>
            <div className='content-creator-one__content'>
              <h2 className='section-title'>
                Build Your Own Merchandise Brand with Sadamata
              </h2>
              <p className='content-creator-one__text'>
               Launch your own merchandise brand on the Sadamata platform free of cost. Register your brand through Sadamata Brand Registration with just a few basic details.
              </p>
               <p className='content-creator-one__text'>
              No upfront investment. No technical hassle. <br />
You focus on building your brand. Sadamata handles the rest.
              </p>
              <Link href='/choose-plan' className='commerce-btn'>
                Enroll Your Brand 
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
