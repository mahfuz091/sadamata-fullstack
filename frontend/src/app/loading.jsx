import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div id='preloader'>
      <div id='preloader-status'>
        <div className='preloader-position loader'>
          {" "}
          <span></span>{" "}
          <Image
            src='/avatar.png'
            alt='sadamata'
            width={50}
            height={50}
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default loading;
