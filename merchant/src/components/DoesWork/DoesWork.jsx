import Image from "next/image";
import Link from "next/link";
import videoThumbnail from "@/assets/images/resources/video.jpg";

export default function DoesWork() {
  return (
    <section className='does-work-one'>
      <div className='container'>
        {/* Section Heading */}
        <div className='does-work-one__top'>
          <h2 className='section-title'>How does it work?</h2>
          <p className='section-text'>
            Simply upload your artwork, select a product type and color, and add a product description. We’ll create a product page on Sadamata.com. When customers buy your product, we take care of production, shipping, and customer service, all with no upfront costs.

          </p>
        </div>

        {/* Video Section */}
        <div className='row'>
          <div className='col-12'>
            <div className='does-work-one__video'>
              <Image
                src={videoThumbnail}
                alt='video image'
                width={1200}
                height={675}
                style={{ width: "100%", height: "auto" }}
              />
              <a
                href='https://www.youtube.com/watch?v=SjJhuZQlkbA'
                className='video-popup'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fas fa-play'></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
