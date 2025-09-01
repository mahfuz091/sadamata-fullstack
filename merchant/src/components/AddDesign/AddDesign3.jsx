"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, Image as FabricImage } from "fabric";
import DashSidebar from "../DashSidebar/DashSidebar";

import item1 from "@/assets/images/products/product-4-1.png";

export default function AddDesign3() {
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
  const colorBackMockups = {
    black: "/mockup-2.png",
    green: "/mockup.png",
    teal: "/mockup-2.png",
    red: "/mockup.png",
    blue: "/mockup-2.png",
    lightBlue: "/mockup.png",
    lightGray: "/mockup-2.png",
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
        width: 300,
        height: 300,
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
      updateCanvasMockup(
        backCanvas,
        colorBackMockups[hoveredColor || selectedColor],
        designBack
      );
    }
  }, [backCanvas, designBack, selectedColor, hoveredColor]);

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

  console.log(isBackView);

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
              </div>

              {/* Upload area */}
              <div className='dashboard-area__uplode'>
                <div className='dashboard-area__uplode-box'>
                  <form>
                    <label
                      htmlFor='image-upload'
                      className='file-upload__label'
                    >
                      <input
                        type='file'
                        id='image-upload'
                        hidden
                        onChange={handleFileChange}
                      />
                      {designImage ? (
                        <img
                          src={designImage}
                          alt='Uploaded Design'
                          width={200}
                        />
                      ) : (
                        <span>Upload your design</span>
                      )}
                    </label>
                  </form>
                </div>
              </div>

              {/* Product preview */}
              <div className='product-preview-panel'>
                <h2>Product Preview</h2>
                <div className='product-preview-panel__view-toggle'>
                  <button
                    onClick={handleFrontButtonClick}
                    className={`toggle-btn ${!isBackView ? "active" : ""}`}
                  >
                    Front
                  </button>
                  <button
                    onClick={handleBackButtonClick}
                    className={`toggle-btn ${isBackView ? "active" : ""}`}
                  >
                    Back
                  </button>
                </div>

                {isBackView ? (
                  <canvas
                    ref={canvasBackRef}
                    style={{ border: "1px solid #e72727ff" }}
                    className='back-canvas'
                  />
                ) : (
                  <canvas
                    ref={canvasRef}
                    style={{ border: "1px solid #ddd" }}
                    className='front-canvas'
                  />
                )}
              </div>

              {/* Color options */}
              <div className='color-options'>
                {Object.keys(colorMockups).map((color) => (
                  <span
                    key={color}
                    className={`color ${color}`}
                    onClick={() => handleColorChange(color)}
                    onMouseEnter={() => handleHoverColor(color)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: color,
                      margin: "5px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>

              {/* Save button */}
              <button onClick={saveImage}>Download Design</button>

              {/* Product list preview */}
              <div className='product-category-list'>
                {products.map((item, index) => (
                  <canvas
                    key={index}
                    ref={item.ref}
                    style={{ border: "1px solid #ddd", margin: "5px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
