"use client";

import { useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";

export default function DoesWork() {
  const [playing, setPlaying] = useState(false);

  const youtubeId = "LnyP8ri7l98";
  const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <section className='does-work-one'>
      <div className='container'>
        <div className='does-work-one__top'>
          <h2 className='section-title'>How does it work?</h2>
          <p className='section-text'>
            Simply upload your artwork, select a product type and color, and add
            a product description. We’ll create a product page on Sadamata.com.
          </p>
        </div>

        <div className='row'>
          <div className='col-12'>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "675px",
                backgroundColor: "#000",
                borderRadius: "30px",
                overflow: "hidden",
              }}
            >
              {!playing && (
                <>
                  <Image
                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt='Video thumbnail'
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />

                  <button
                    type='button'
                    onClick={() => setPlaying(true)}
                    className='video-popup'
                    // style={{
                    //   position: "absolute",
                    //   top: "50%",
                    //   left: "50%",
                    //   transform: "translate(-50%, -50%)",
                    //   background: "rgba(0,0,0,0.6)",
                    //   border: "none",
                    //   borderRadius: "50%",
                    //   width: "80px",
                    //   height: "80px",
                    //   color: "#fff",
                    //   fontSize: "28px",
                    //   cursor: "pointer",
                    //   zIndex: 2,
                    // }}
                  >
                    <i className='fas fa-play'></i>
                  </button>
                </>
              )}

              {playing && (
                <ReactPlayer
                  src={videoUrl} // REQUIRED by npm docs
                  playing={playing} // controlled state
                  controls={true} // shows pause button
                  width='100%'
                  height='100%'
                  onPause={() => setPlaying(false)} // optional sync
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
