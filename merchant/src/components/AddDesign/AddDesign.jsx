"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage } from "fabric";
import DashSidebar from "../DashSidebar/DashSidebar";

import item1 from "@/assets/images/products/product-4-1.png";

export default function AddDesign() {
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [fileName, setFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [designImage, setDesignImage] = useState(null);
  const [designBack, setDesignBack] = useState(null);
  const [selectedColor, setSelectedColor] = useState("black");
  const [hoveredColor, setHoveredColor] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [canvasTwo, setCanvasTwo] = useState(null);
  const [backCanvas, setBackCanvas] = useState(null);
  const [designPosition, setDesignPosition] = useState({ x: 100, y: 100 });
  const [designSize, setDesignSize] = useState({ width: 200, height: 200 });
  const [isBackView, setIsBackView] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);

  const canvasRef = useRef(null);
  const canvasTwoRef = useRef(null);
  const canvasBackRef = useRef(null);

  const products = [
    {
      id: 1,
      brand: "Disney",
      title: "T-Shirt",
      price: "$17.95",
      rating: 4.9,
      reviews: 65,
      image: item1,
      ref: canvasTwoRef,
    },
  ];

  const colorMockups = {
    black: "/mockup.png",
    green: "/mockup-2.png",
    teal: "/mockup.png",
    red: "/mockup-2.png",
    blue: "/mockup.png",
    lightBlue: "/mockup-2.png",
    lightGray: "/mockup.png",
  };

  // -------------------------
  // File upload handlers
  // -------------------------
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setDesignImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBackFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setBackFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setDesignBack(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // -------------------------
  // Initialize canvases once
  // -------------------------
  useEffect(() => {
    if (canvasRef.current) {
      const c = new Canvas(canvasRef.current, {
        width: 400,
        height: 400,
        selection: false,
      });
      setCanvas(c);
      return () => c.dispose();
    }
  }, []);

  useEffect(() => {
    if (canvasBackRef.current) {
      const c = new Canvas(canvasBackRef.current, {
        width: 400,
        height: 400,
        selection: false,
      });
      setBackCanvas(c);
      return () => c.dispose();
    }
  }, []);

  useEffect(() => {
    if (canvasTwoRef.current) {
      const c = new Canvas(canvasTwoRef.current, {
        width: 200,
        height: 200,
        selection: false,
      });
      setCanvasTwo(c);
      return () => c.dispose();
    }
  }, []);

  // -------------------------
  // Update canvas content
  // -------------------------
  const updateCanvasMockup = (
    fabricCanvas,
    mockupSrc,
    designSrc,
    isPreview = false
  ) => {
    if (!fabricCanvas) return;
    const mockupImg = new Image();
    mockupImg.src = mockupSrc;
    mockupImg.onload = () => {
      fabricCanvas.clear();

      const base = new FabricImage(mockupImg, {
        selectable: false,
        evented: false,
      });
      base.scaleToWidth(fabricCanvas.width);
      base.scaleToHeight(fabricCanvas.height);
      fabricCanvas.add(base);

      if (designSrc) {
        const designImg = new Image();
        designImg.src = designSrc;
        designImg.onload = () => {
          const img = new FabricImage(designImg);
          if (isPreview) {
            const targetWidth = 80;
            const targetHeight = 80;
            img.set({
              left: (fabricCanvas.width - targetWidth) / 2,
              top: (fabricCanvas.height - targetHeight) / 2,
              scaleX: targetWidth / designImg.width,
              scaleY: targetHeight / designImg.height,
              hasControls: true,
              lockUniScaling: true,
            });
          } else {
            img.set({
              left: designPosition.x,
              top: designPosition.y,
              scaleX: designSize.width / designImg.width,
              scaleY: designSize.height / designImg.height,
              hasControls: true,
              lockUniScaling: true,
            });
          }
          fabricCanvas.add(img);
          fabricCanvas.renderAll();
        };
      } else {
        fabricCanvas.renderAll();
      }
    };
  };

  // Front canvas
  useEffect(() => {
    if (canvas) {
      updateCanvasMockup(
        canvas,
        colorMockups[hoveredColor || selectedColor],
        designImage
      );
    }
  }, [canvas, selectedColor, hoveredColor, designImage]);

  // Back canvas
  useEffect(() => {
    if (backCanvas) {
      updateCanvasMockup(backCanvas, "/mockup-2.png", designBack);
    }
  }, [backCanvas, designBack]);

  // Preview canvas
  useEffect(() => {
    if (canvasTwo) {
      updateCanvasMockup(
        canvasTwo,
        colorMockups[hoveredColor || selectedColor],
        designImage,
        true
      );
    }
  }, [canvasTwo, selectedColor, hoveredColor, designImage]);

  // -------------------------
  // Color & View handlers
  // -------------------------
  const handleColorChange = (color) => setSelectedColor(color);
  const handleHoverColor = (color) => setHoveredColor(color);
  const handleMouseLeave = () => setHoveredColor(null);
  const handleBackButtonClick = () => setIsBackView(true);
  const handleFrontButtonClick = () => setIsBackView(false);

  // -------------------------
  // Save image
  // -------------------------
  const saveImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({ format: "png", quality: 1.0 });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "design_with_mockup.png";
      link.click();
    }
  };

  return (
    <section className='dashboard-area section-space'>
      <div className='container'>
        <div className='row gutter-x-40'>
          <div className='col-lg-3'>
            <DashSidebar />
          </div>

          <div className='col-lg-9'>
            <div className='dashboard-area__content'>
              <div className='dashboard-area__top'>
                <h2 className='dashboard-area__title'>Create Products</h2>
                <a href='#' className='commerce-btn'>
                  Select Products <i className='icon-right-arrow' />
                </a>
              </div>

              {/* Upload area */}
              <div className='dashboard-area__uplode'>
                <div className='dashboard-area__uplode-box'>
                  <form>
                    <div className='upload-area file-upload__area'>
                      <label
                        htmlFor='image-upload'
                        className='file-upload__label'
                      >
                        <input
                          type='file'
                          id='image-upload'
                          className='file-upload__input'
                          hidden
                          onChange={handleFileChange}
                        />
                        {/* Show spinner while loading */}
                        {isLoading ? (
                          <div
                            className='spinner-border text-primary'
                            role='status'
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                        ) : (
                          // Display image after upload is complete
                          designImage && (
                            <img
                              src={designImage}
                              alt='Uploaded Design'
                              width={200}
                              height={200}
                            />
                          )
                        )}
                        {designImage ? (
                          ""
                        ) : (
                          <>
                            <div className='image-upload__icon'>
                              {/* SVG icon here */}
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='60'
                                height='60'
                                viewBox='0 0 60 60'
                                fill='none'
                              >
                                <path
                                  d='M49.9908 22.055C47.2178 11.008 36.0146 4.30066 24.9676 7.07371C16.3346 9.24086 10.0661 16.7022 9.42027 25.5795C3.29051 26.5903 -0.859227 32.3789 0.151639 38.5086C1.05025 43.9581 5.77216 47.9489 11.2951 47.927H20.669V44.1774H11.2951C7.15341 44.1774 3.79589 40.8199 3.79589 36.6783C3.79589 32.5366 7.15341 29.1791 11.2951 29.1791C12.3305 29.1791 13.1699 28.3397 13.1699 27.3043C13.1605 17.9855 20.7074 10.4235 30.0261 10.4142C38.0929 10.4062 45.037 16.1091 46.5975 24.0234C46.7515 24.8136 47.3928 25.4173 48.191 25.5232C53.3165 26.2531 56.8797 30.9997 56.1499 36.1251C55.4945 40.7275 51.565 44.1542 46.9162 44.1774H39.417V47.927H46.9162C54.1641 47.9051 60.0219 42.0117 59.9999 34.7637C59.9816 28.7304 55.8519 23.4867 49.9908 22.055Z'
                                  fill='black'
                                />
                                <path
                                  d='M28.7118 29.7229L21.2126 37.2221L23.8561 39.8656L28.1681 35.5723V53.5516H31.9177V35.5723L36.211 39.8656L38.8545 37.2221L31.3553 29.7229C30.624 28.996 29.4431 28.996 28.7118 29.7229Z'
                                  fill='black'
                                />
                              </svg>
                            </div>
                            <span className='file-name'>{fileName}</span>
                            <div className='image-upload__text-box'>
                              <h3 className='image-upload__title'>
                                Drag and drop artwork here
                              </h3>
                              <p className='image-upload__text'>
                                or Click to browse for a file
                              </p>
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  </form>
                </div>

                {/* Guidelines */}
                <div className='dashboard-area__tag-box'>
                  <div className='tag-box-top'>
                    <h2 className='tag-box-title'>Artwork should be:</h2>
                    <button
                      className='tag-box-button'
                      data-target='.tag-box-button__list'
                    >
                      <i className='fas fa-caret-down' />
                    </button>
                  </div>
                  <div className='dashboard-area__list tag-box-button__list toggle-list'>
                    <button className='tag-iterm'>PNG format</button>
                    <button className='tag-iterm'>
                      As large as possible (dimensions of 4500 pixels or more
                      will give you the most flexibility)
                    </button>
                    <button className='tag-iterm'>
                      RGB color, 8 bits/channel
                    </button>
                    <button className='tag-iterm'>Less than 25 MB</button>
                  </div>
                </div>
              </div>
              <div className='product-category-list d-flex overflow-x-auto'>
                {products.map((item, index) => (
                  <div className='item' key={index}>
                    <div className='product__item-two'>
                      <div className='product__item-two__img'>
                        <a href='#' className='product__item-two__img__item'>
                          <canvas
                            ref={item.ref}
                            style={{
                              border: "1px solid #ddd",
                              position: "relative",
                            }}
                          ></canvas>
                        </a>
                      </div>
                      <div className='product__item-two__content'>
                        <h4 className='product__item-two__title'>
                          <a href='product-details'>{item.title}</a>
                        </h4>

                        <a
                          href='cart'
                          className='commerce-btn product__item-two__link'
                        >
                          Edit Details <i className='icon-right-arrow'></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Preview Section */}
              <div className='product-preview-panel'>
                <h2>Product Preview</h2>
                <div className='row gutter-x-30 gutter-y-30'>
                  <div className='col-lg-6'>
                    <div className='product-preview-panel__view-toggle'>
                      <button
                        className={`toggle-btn ${!isBackView ? "active" : ""}`}
                        onClick={handleFrontButtonClick}
                      >
                        Front
                      </button>
                      <button
                        className={`toggle-btn ${isBackView ? "active" : ""}`}
                        onClick={handleBackButtonClick}
                      >
                        Back
                      </button>
                    </div>

                    {isBackView ? (
                      <label htmlFor='backimage-upload'>
                        <canvas
                          ref={canvasBackRef}
                          className={`front ${isBackView ? "" : "d-none"}`}
                          style={{
                            border: "1px solid #ddd",
                            position: "relative",
                          }}
                        ></canvas>
                        <input
                          type='file'
                          id='backimage-upload'
                          className='file-upload__input'
                          hidden
                          onChange={handleBackFileChange}
                          disabled={designBack} // Disable input if design is added
                        />
                      </label>
                    ) : (
                      <div>
                        <canvas
                          ref={canvasRef}
                          className={`front ${isBackView ? "d-none" : ""}`}
                          style={{
                            border: "1px solid #ddd",
                            position: "relative",
                          }}
                        ></canvas>
                      </div>
                    )}
                  </div>
                  <div className='col-lg-6'>
                    <div className='product-preview-panel__product-options'>
                      <div className='product-preview-panel__fit-type-selector'>
                        <p className='product-preview-panel__label'>
                          Choose fit types:
                        </p>
                        <label className='fit-checkbox'>
                          <input
                            type='checkbox'
                            checked={true} // or false depending on your use case
                            readOnly
                          />
                          <span className='custom-check'></span>
                          Men
                        </label>

                        <label className='fit-checkbox'>
                          <input type='checkbox' />
                          <span className='custom-check'></span>
                          Women
                        </label>

                        <label className='fit-checkbox'>
                          <input type='checkbox' />
                          <span className='custom-check'></span>
                          Youth
                        </label>
                      </div>

                      <div className='product-preview-panel__color-chooser'>
                        <p className='product-preview-panel__label'>
                          Choose colors:
                        </p>
                        <div className='color-options'>
                          <span
                            className='color black'
                            onClick={() => handleColorChange("black")}
                            onMouseEnter={() => handleHoverColor("black")} // Hover effect
                            onMouseLeave={handleMouseLeave}
                          ></span>
                          <span
                            className='color green'
                            onClick={() => handleColorChange("green")}
                            onMouseEnter={() => handleHoverColor("green")} // Hover effect
                            onMouseLeave={() => handleHoverColor(null)}
                          ></span>
                          <span className='color teal'></span>
                          <span className='color red'></span>
                          <span className='color blue'></span>
                          <span className='color light-blue'></span>
                          <span className='color light-gray'></span>
                        </div>
                      </div>

                      <div className='product-preview-panel__price-input-field'>
                        <label className='product-preview-panel__label'>
                          Price (Minimum BDT 500):
                        </label>
                        <input
                          type='text'
                          placeholder='BDT 0.00'
                          defaultValue={500}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Form */}
              <div className='product-details__form'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Artworld should be:
                  </h2>
                  <button
                    className='tag-box-button'
                    data-target='.product-details__form-two'
                  >
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>
                <form
                  action='#'
                  className='product-details__form-two toggle-list'
                >
                  <div className='row gutter-x-30 gutter-y-30'>
                    <div className='col-lg-6'>
                      <div className='product-details__form__content'>
                        <h4 className='product-details__form__title'>
                          Product details (required)
                        </h4>
                        <p className='product-details__form__text'>
                          Product names will be appended to this design title
                          e.g. a design title of “Funny Cat” will be displayed
                          as “Funny Cat T-Shirt” on the t-shirt product details
                          page.
                        </p>
                      </div>
                      <div className='form-group'>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Design Title</label>
                          <input type='text' name='name' id='name' />

                          <span>
                            60 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Select Brand</label>
                          {/* <CustomSelect options={options} /> */}

                          <input
                            type='text'
                            name='name'
                            placeholder='Write your brand'
                            className='mt-2'
                          />
                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <div className='product-details__form__content'>
                        <h4 className='product-details__form__title'>
                          Product Features (optional)
                        </h4>
                        <p className='product-details__form__text'>
                          Summarize the unique details of your design. They’ll
                          appear in a bulleted list, along with other product
                          information we automatically include
                        </p>
                      </div>
                      <div className='form-group'>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Feature bullet 1</label>
                          <input type='text' name='name' id='name' />
                          <span>256 characters remaining</span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Feature bullet 2</label>
                          <input type='text' name='name' id='name' />
                          <span>
                            50 characters remaining (minimum 3 characters)
                          </span>
                        </div>
                        <div className='form-control-two'>
                          <label htmlFor='name'>Product descriiption</label>
                          <textarea
                            name=''
                            id=''
                            placeholder='Minimum 75 characters'
                          ></textarea>
                          <span>200 characters remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Keywords Input */}
              <div className='product-details__keyword'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Artworld should be:
                  </h2>
                  <button className='tag-box-button' data-target='.keyword'>
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>
                <p className='product-details__keyword__text'>
                  When entering your product tags or keywords for SEO, you’re
                  taking a crucial step toward increasing your product’s
                  visibility <br /> and attracting more potential customers.
                </p>
                <div className='keyword toggle-list'>
                  <label htmlFor='tagInput' className='tag-input-label'>
                    *Product Keyword
                  </label>
                  <div className='tag-input-wrapper'>
                    <div className='tag-box' id='tagBox'>
                      <input
                        type='text'
                        id='tagInput'
                        className='tag-input'
                        maxLength='200'
                      />
                    </div>
                    <p className='char-limit' id='charLimit'>
                      200 characters remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div className='product-details__availability'>
                <div className='product-details__form-top'>
                  <h2 className='product-details__form-title'>
                    Product availability on Amazon
                  </h2>
                  <button
                    className='tag-box-button'
                    data-target='.product-details-form'
                  >
                    <i className='fas fa-caret-down'></i>
                  </button>
                </div>
                <form action='#' className='toggle-list product-details-form'>
                  <div className='row gutter-x-6'>
                    <div className='col-lg-6'>
                      <div className='product-details__item-box'>
                        <label
                          htmlFor='non-searchable'
                          className='availability__item'
                        >
                          <input
                            type='radio'
                            id='non-searchable'
                            name='searchability'
                            value='non-searchable'
                            className='sr-only'
                            readOnly
                          />
                          <span className='custom-radio-circle'></span>
                          <div className='availability__item__content'>
                            <h3 className='availability__item__title'>
                              Non-searchable
                            </h3>
                            <p className='availability__item__text'>
                              Does not appear in Sadamata search results
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className='product-details__btn-group'>
                        <button type='submit' className='commerce-btn'>
                          Save Publish Settings{" "}
                          <i className='icon-right-arrow'></i>
                        </button>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <div className='product-details__item-box'>
                        <label
                          htmlFor='searchable'
                          className='availability__item'
                        >
                          <input
                            type='radio'
                            id='searchable'
                            name='searchability'
                            value='non-searchable'
                            className='sr-only'
                          />
                          <span className='custom-radio-circle'></span>
                          <div className='availability__item__content'>
                            <h3 className='availability__item__title'>
                              Searchable
                            </h3>
                            <p className='availability__item__text'>
                              Appears in amazon search results
                            </p>
                            <p className='availability__item__text'>
                              Customers can find these products through sadamata
                              search <br /> results
                            </p>
                          </div>
                        </label>
                      </div>
                      <div className='product-details__btn-group'>
                        <button type='submit' className='commerce-btn'>
                          Save draft<i className='icon-right-arrow'></i>
                        </button>
                        <button type='submit' className='commerce-btn'>
                          Publish <i className='icon-right-arrow'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <p className='product-details__availability__text'>
                  By submitting for production, you acknowledge you have all the
                  necessary rights to the original artwork, Brand name, design
                  title, product features and description.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
