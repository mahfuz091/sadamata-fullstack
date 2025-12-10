"use client"; // If using Next.js 13+ app directory
import { useState } from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.css";
import videoThumbnail from "@/assets/images/resources/video.jpg";
import Image from "next/image";
export default function DoesWork() {
  const [isOpen, setIsOpen] = useState(false);
  const youtubeId = "LnyP8ri7l98";

  return (
    <section className='does-work-one'>
      <div className='container'>
        {/* Section Heading */}
        <div className='does-work-one__top'>
          <h2 className='section-title'>How does it work?</h2>
          <p className='section-text'>
            Simply upload your artwork, select a product type and color, and add
            a product description. We’ll create a product page on Sadamata.com.
            When customers buy your product, we take care of production,
            shipping, and customer service, all with no upfront costs.
          </p>
        </div>

        {/* Video Section */}
        <div className='row'>
          <div className='col-12'>
            <div className='does-work-one__video'>
              <Image
                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                alt='video image'
                width={1200}
                height={675}
                style={{ width: "100%", height: "675px" }}
              />
              <a
                href=''
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(true);
                }}
                className='video-popup'
                rel='noopener noreferrer'
              >
                <i className='fas fa-play'></i>
              </a>
            </div>
            {/* <div className='does-work-one__video'>
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                alt='video thumbnail'
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => setIsOpen(true)}
              />
              <div
                className='video-play-button'
                onClick={() => setIsOpen(true)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "60px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <i className='fas fa-play'></i>
              </div>
            </div> */}
          </div>
        </div>

        <ModalVideo
          channel='youtube'
          autoplay
          isOpen={isOpen}
          videoId={youtubeId}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </section>
  );
}
