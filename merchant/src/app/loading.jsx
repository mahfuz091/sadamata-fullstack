import React from "react";

const loading = () => {
  return (
    <div id='preloader'>
      <div id='preloader-status'>
        <div className='preloader-position loader'>
          {" "}
          <span></span>{" "}
        </div>
      </div>
    </div>
  );
};

export default loading;