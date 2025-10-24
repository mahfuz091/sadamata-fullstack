"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, FabricText } from "fabric"; // Correct import for Fabric.js v6
// import Image from "next/image";
import Link from "next/link";
import image from "@/assets/images/products/product-d-4-1.png";

import item1 from "@/assets/images/products/product-4-1.png";

import DashSidebar from "../DashSidebar/DashSidebar";
import Tag from "./Tag";
import { toast } from "sonner";

export default function AddDesignC() {
  const [fileName, setFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [designImage, setDesignImage] = useState(null); // Store the uploaded design
  const [designBack, setDesignBack] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black"); // Default color
  const [hoveredColor, setHoveredColor] = useState(null);
  const [canvas, setCanvas] = useState(null); // Store the Fabric canvas instance
  const [canvasTwo, setCanvasTwo] = useState(null); // Store the Fabric canvas instance
  const [backCanvas, setBackCanvas] = useState(null); // Store the Fabric canvas instance

  const [designPosition, setDesignPosition] = useState({ x: 100, y: 100 });
  const [designBackPosition, setDesignBackPosition] = useState({
    x: 100,
    y: 100,
  });
  const [designSize, setDesignSize] = useState({ width: 200, height: 200 });
  const [designBackSize, setDesignBackSize] = useState({
    width: 200,
    height: 200,
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isBackLoading, setIsBackLoading] = useState(false); // Loading state
  const [isBackView, setIsBackView] = useState(false);
  const inputFileRef = useRef(null);
  const mockupImage = "/mockup.png"; // Track start position for resize
  const mockupBackImage = "/mockup-2.png"; // Back mockup
  const canvasRef = useRef(null); // Reference to the canvas element
  const canvasTwoRef = useRef(null); // Reference to the canvas element
  const canvasBackRef = useRef(null); // Reference to the canvas element
  const [spinnerObj, setSpinnerObj] = useState(null);

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
    // {
    //   id: 2,
    //   brand: "Disney",
    //   title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    //   price: "$17.95",
    //   rating: 4.9,
    //   reviews: 65,
    //   image: item2,
    //   ref: "canvasThreeRef",
    // },
    // {
    //   id: 3,
    //   brand: "Disney",
    //   title: "Disney The Lion King Scar I'm Surrounded T-Shirt",
    //   price: "$17.95",
    //   rating: 4.9,
    //   reviews: 65,
    //   image: item3,
    //   ref: "canvasFourRef",
    // },

    // Add more product objects here
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
  // Handle file upload
  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      // Start loading state
      setIsLoading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulate a 5-second delay before displaying the image
        setTimeout(() => {
          // Set the uploaded image as the design after the delay
          setDesignImage(reader.result);
          setIsLoading(false); // End loading state after the delay
        }, 3000); // 5 seconds delay
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
    }
  };
  const handleBackFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setBackFileName(file.name);

      // Start loading state
      setIsBackLoading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulate a 5-second delay before displaying the image
        setTimeout(() => {
          // Set the uploaded image as the design after the delay
          setDesignBack(reader.result);
          setIsBackLoading(false); // End loading state after the delay
        }, 3000); // 5 seconds delay
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
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
  }, [isBackView, selectedColor, hoveredColor]);

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
  }, [isBackView, selectedColor, hoveredColor]);

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

  // const initializeCanvas = () => {
  //   if (canvas) {
  //     canvas.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }
  //   if (backCanvas) {
  //     backCanvas.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }
  //   if (canvasTwo) {
  //     canvasTwo.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }

  //   // Initialize the Fabric.js canvas
  //   const fabricCanvas = new Canvas(canvasRef.current, {
  //     width: 400,
  //     height: 400,
  //     selection: false,
  //   });

  //   // Proceed with initialization and image setup
  //   const colorToUse = hoveredColor || selectedColor;
  //   const mockupImg = new Image();
  //   mockupImg.src = colorMockups[colorToUse];

  //   mockupImg.onload = () => {
  //     if (!fabricCanvas) return;

  //     fabricCanvas.clear(); // Clear previous contents

  //     const fabricImg = new FabricImage(mockupImg);
  //     fabricImg.set({
  //       left: 0,
  //       top: 0,
  //       scaleX: fabricCanvas.width / mockupImg.width,
  //       scaleY: fabricCanvas.height / mockupImg.height,
  //       selectable: false,
  //       evented: false,
  //     });

  //     fabricCanvas.add(fabricImg);
  //     fabricCanvas.renderAll();

  //     addDesignToCanvas(fabricCanvas); // Re-add the design image on top
  //   };

  //   setCanvas(fabricCanvas); // Set the canvas state
  // };

  // const initializeBackCanvas = () => {
  //   // Check if the back canvas is already initialized and dispose of it
  //   if (backCanvas) {
  //     backCanvas.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }
  //   if (canvas) {
  //     canvas.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }
  //   if (canvasTwo) {
  //     canvasTwo.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }

  //   const fabricBackCanvas = new Canvas(canvasBackRef.current, {
  //     width: 400,
  //     height: 400,
  //     selection: false,
  //   });

  //   const mockupImg = new Image();
  //   mockupImg.src = mockupBackImage;

  //   mockupImg.onload = () => {
  //     fabricBackCanvas.clear(); // Clear the previous canvas contents, if any

  //     const fabricImg = new FabricImage(mockupImg);
  //     fabricImg.set({
  //       left: 0,
  //       top: 0,
  //       scaleX: fabricBackCanvas.width / mockupImg.width,
  //       scaleY: fabricBackCanvas.height / mockupImg.height,
  //       selectable: false,
  //       evented: false,
  //     });

  //     fabricBackCanvas.add(fabricImg);
  //     fabricBackCanvas.renderAll();

  //     if (designBack) {
  //       addDesignToBackCanvas(fabricBackCanvas);
  //     }
  //   };

  //   setBackCanvas(fabricBackCanvas);
  // };

  const handleBackButtonClick = () => {
    setIsBackView(true); // Switch to back view
  };

  const handleFrontButtonClick = () => {
    setIsBackView(false); // Switch to front view
  };

  // const initializeCanvasTwo = () => {
  //   if (canvasTwo) {
  //     canvasTwo.dispose(); // Dispose the previous canvas before initializing a new one
  //   }

  //   if (backCanvas) {
  //     backCanvas.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }
  //   if (canvas) {
  //     canvas.dispose(); // Dispose of the previous canvas before initializing a new one
  //   }

  //   // Initialize the Fabric.js canvas
  //   const fabricTwoCanvas = new Canvas(canvasTwoRef.current, {
  //     width: 200,
  //     height: 200,
  //     selection: false,
  //   });

  //   // Ensure the canvas is initialized before proceeding
  //   if (!fabricTwoCanvas) return;

  //   const colorToUse = hoveredColor || selectedColor;
  //   const mockupImg = new Image();
  //   mockupImg.src = colorMockups[colorToUse]; // Use the selected or hovered color to set the mockup image

  //   // Wait until the mockup image is fully loaded before adding it to the canvas
  //   mockupImg.onload = () => {
  //     if (!fabricTwoCanvas) return; // Check again to ensure the canvas exists

  //     // Clear the previous canvas contents, if any
  //     fabricTwoCanvas.clear();

  //     // Add the new mockup image to the canvas
  //     const fabricImg = new FabricImage(mockupImg);
  //     fabricImg.set({
  //       left: 0,
  //       top: 0,
  //       scaleX: fabricTwoCanvas.width / mockupImg.width, // Scale to fit the canvas width
  //       scaleY: fabricTwoCanvas.height / mockupImg.height, // Scale to fit the canvas height
  //       selectable: false, // Lock the image so it can't be resized or moved
  //       evented: false, // Disable events for this image
  //     });

  //     fabricTwoCanvas.add(fabricImg); // Add mockup image as the base
  //     fabricTwoCanvas.renderAll(); // Ensure the image is rendered immediately

  //     // After adding the mockup, add the design image on top of it
  //     addDesignToCanvasTwo(fabricTwoCanvas); // Re-add the design image with the saved size and position
  //   };

  //   setCanvasTwo(fabricTwoCanvas); // Set the canvas state
  // };

  const addDesignToCanvas = (fabricCanvas) => {
    if (fabricCanvas && designImage) {
      const designImg = new Image(); // Create an image element
      designImg.src = designImage;

      designImg.onload = () => {
        // Calculate the scale factor to fit the design image within the canvas, while maintaining aspect ratio
        const scaleX = fabricCanvas.width / designImg.width;
        const scaleY = fabricCanvas.height / designImg.height;

        // Use the smaller scale to fit the image into the canvas
        const scale = Math.min(scaleX, scaleY);

        // Re-apply the saved size and position of the design
        const fabricImg = new FabricImage(designImg); // Create a Fabric image from the loaded img element
        fabricImg.set({
          left: designPosition.x, // Use the saved position
          top: designPosition.y, // Use the saved position
          scaleX: designSize.width / designImg.width, // Use the saved size
          scaleY: designSize.height / designImg.height, // Use the saved size
          hasControls: true, // Allow resizing and rotating
          lockUniScaling: true, // Keep the aspect ratio while resizing
          layer: 1, // Ensure this is on top of the mockup
        });

        fabricCanvas.add(fabricImg); // Add design image to the canvas
        fabricCanvas.renderAll(); // Ensure the image is rendered immediately
      };
    }
  };
  const addDesignToBackCanvas = (fabricCanvas) => {
    if (fabricCanvas && designBack) {
      const designImg = new Image(); // Create an image element
      designImg.src = designBack;

      designImg.onload = () => {
        // Calculate the scale factor to fit the design image within the canvas, while maintaining aspect ratio
        const scaleX = fabricCanvas.width / designImg.width;
        const scaleY = fabricCanvas.height / designImg.height;

        // Use the smaller scale to fit the image into the canvas
        const scale = Math.min(scaleX, scaleY);

        // Re-apply the saved size and position of the design
        const fabricImg = new FabricImage(designImg); // Create a Fabric image from the loaded img element
        fabricImg.set({
          left: designBackPosition.x, // Use the saved position
          top: designBackPosition.y, // Use the saved position
          scaleX: designBackSize.width / designImg.width, // Use the saved size
          scaleY: designBackSize.height / designImg.height, // Use the saved size
          hasControls: true, // Allow resizing and rotating
          lockUniScaling: true, // Keep the aspect ratio while resizing
          layer: 1, // Ensure this is on top of the mockup
        });

        fabricCanvas.add(fabricImg); // Add design image to the canvas
        fabricCanvas.renderAll(); // Ensure the image is rendered immediately
      };
    }
  };
  const addDesignToCanvasTwo = (fabricCanvas) => {
    if (fabricCanvas && designImage) {
      const designImg = new Image(); // Create an image element
      designImg.src = designImage;

      designImg.onload = () => {
        // Set the desired size for the design image
        const targetWidth = 80; // Set the width you want (in pixels)
        const targetHeight = 80; // Set the height you want (in pixels)

        // Calculate the scale factor to fit the design image size
        const scaleX = targetWidth / designImg.width;
        const scaleY = targetHeight / designImg.height;

        // Calculate the centered position
        const centerX = (fabricCanvas.width - targetWidth) / 2;
        const centerY = (fabricCanvas.height - targetHeight) / 2;

        // Re-apply the saved size and position of the design, adjusted to center it
        const fabricImg = new FabricImage(designImg); // Create a Fabric image from the loaded img element
        fabricImg.set({
          left: centerX, // Center the image horizontally
          top: centerY, // Center the image vertically
          scaleX: scaleX, // Scale the image to the target width
          scaleY: scaleY, // Scale the image to the target height
          hasControls: true, // Allow resizing and rotating
          lockUniScaling: true, // Keep the aspect ratio while resizing
          layer: 1, // Ensure this is on top of the mockup
        });

        fabricCanvas.add(fabricImg); // Add design image to the canvas
        fabricCanvas.renderAll(); // Ensure the image is rendered immediately
      };
    }
  };

  // Front canvas
  useEffect(() => {
    if (canvas) {
      const colorToUse = hoveredColor || selectedColor;
      const mockupImg = new Image();
      mockupImg.src = colorMockups[colorToUse];

      mockupImg.onload = () => {
        if (!canvas) return;

        const fabricImg = new FabricImage(mockupImg);
        fabricImg.set({
          left: 0,
          top: 0,
          scaleX: canvas.width / mockupImg.width,
          scaleY: canvas.height / mockupImg.height,
          selectable: false,
          evented: false,
        });

        canvas.add(fabricImg);
        canvas.renderAll();

        addDesignToCanvas(canvas);
      };
    }
  }, [canvas, selectedColor, hoveredColor, designImage]);

  // Back canvas
  useEffect(() => {
    if (backCanvas) {
      const colorToUse = hoveredColor || selectedColor;
      const mockupImg = new Image();
      mockupImg.src = colorBackMockups[colorToUse];

      mockupImg.onload = () => {
        if (!backCanvas) return;

        // backCanvas.clear(); // Clear previous contents

        const fabricImg = new FabricImage(mockupImg);
        fabricImg.set({
          left: 0,
          top: 0,
          scaleX: backCanvas.width / mockupImg.width,
          scaleY: backCanvas.height / mockupImg.height,
          selectable: false,
          evented: false,
        });

        backCanvas.add(fabricImg);
        backCanvas.renderAll();

        addDesignToBackCanvas(backCanvas);
      };
    }
  }, [backCanvas, selectedColor, hoveredColor, designBack]);

  // Product canvas
  useEffect(() => {
    if (canvasTwo) {
      const colorToUse = hoveredColor || selectedColor;
      const mockupImg = new Image();
      mockupImg.src = colorMockups[colorToUse];

      mockupImg.onload = () => {
        if (!canvasTwo) return;

        // backCanvas.clear(); // Clear previous contents

        const fabricImg = new FabricImage(mockupImg);
        fabricImg.set({
          left: 0,
          top: 0,
          scaleX: canvasTwo.width / mockupImg.width,
          scaleY: canvasTwo.height / mockupImg.height,
          selectable: false,
          evented: false,
        });

        canvasTwo.add(fabricImg);
        canvasTwo.renderAll();

        addDesignToCanvasTwo(canvasTwo);
      };
    }
  }, [canvas, selectedColor, hoveredColor, designImage]);

  const SPINNER_SVG_DATAURI =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="20" stroke="#3b82f6" stroke-width="5" fill="none" opacity="0.2"/>
  <path fill="none" stroke="#3b82f6" stroke-width="5"
        d="M25 5 a20 20 0 0 1 0 40"/>
</svg>`);
  // Add a spinner to the canvas during loading
  const addSpinnerToCanvas = (fabricCanvas) => {
    // Ensure spinner doesn't already exist
    if (!fabricCanvas || spinnerObj) return;

    const img = new Image();
    img.src = SPINNER_SVG_DATAURI;
    img.onload = () => {
      const spin = new FabricImage(img, {
        originX: "center",
        originY: "center",
        left: fabricCanvas.getWidth() / 2,
        top: fabricCanvas.getHeight() / 2,
        selectable: false,
        evented: false,
        opacity: 0.9,
      });

      // Add to canvas
      fabricCanvas.add(spin);
      setSpinnerObj(spin);

      // Continuously animate the spinner
      let angle = 0; // Initial angle
      const rotateSpinner = () => {
        if (spin.__spin !== false) {
          angle += 2; // Adjust speed of rotation by changing increment value
          spin.set({ angle: angle });
          fabricCanvas.renderAll();
          requestAnimationFrame(rotateSpinner); // Keep spinning
        }
      };
      rotateSpinner(); // Start the animation
    };
  };

  const removeSpinnerFromCanvas = (fabricCanvas) => {
    if (fabricCanvas && spinnerObj) {
      spinnerObj.__spin = false; // Stop the spinning
      fabricCanvas.remove(spinnerObj);
      setSpinnerObj(null);
      fabricCanvas.renderAll();
    }
  };

  useEffect(() => {
    if (canvas) {
      // Listen for when the design image is modified
      canvas.on("object:modified", (e) => {
        const obj = e.target;
        if (obj && obj.type === "image") {
          setDesignPosition({ x: obj.left, y: obj.top }); // Save new position
          setDesignSize({
            width: obj.width * obj.scaleX,
            height: obj.height * obj.scaleY,
          }); // Save new size
        }
      });
    }
  }, [canvas]);

  useEffect(() => {
    if (backCanvas) {
      // Listen for when the design image is modified
      backCanvas.on("object:modified", (e) => {
        const obj = e.target;
        if (obj && obj.type === "image") {
          setDesignBackPosition({ x: obj.left, y: obj.top }); // Save new position
          setDesignBackSize({
            width: obj.width * obj.scaleX,
            height: obj.height * obj.scaleY,
          }); // Save new size
        }
      });
    }
  }, [backCanvas]);
  useEffect(() => {
    if (!canvas) return;

    if (isLoading) {
      addSpinnerToCanvas(canvas);
      addSpinnerToCanvas(canvasTwo);
    } else {
      removeSpinnerFromCanvas(canvas);
      removeSpinnerFromCanvas(canvasTwo);
      // addDesignToCanvas(canvas);
    }
  }, [isLoading, designImage, canvas, canvasTwo]);
  useEffect(() => {
    if (!backCanvas) return;

    if (isBackLoading) {
      addSpinnerToCanvas(backCanvas);
    } else {
      removeSpinnerFromCanvas(backCanvas);

      // addDesignToBackCanvas(canvas);
    }
  }, [isBackLoading, designBack, backCanvas]);

  const handleColorChange = (color) => {
    setSelectedColor(color); // Update selected color
  };

  const handleHoverColor = (color) => {
    setHoveredColor(color); // Set hovered color
  };

  useEffect(() => {
    if (designImage) {
      addDesignToCanvas(); // Add the uploaded design to the canvas
    }
  }, [designImage]);
  useEffect(() => {
    if (designBack) {
      addDesignToBackCanvas(); // Add the uploaded design to the canvas
    }
  }, [designBack]);

  const handleMouseLeave = () => {
    setHoveredColor(null);
  };
  const saveImage = () => {
    if (canvas) {
      // Export the canvas as a base64 PNG image
      const dataURL = canvas.toDataURL({
        format: "png", // Export as PNG
        quality: 1.0, // Set image quality
      });

      // Create a download link
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "design_with_mockup.png"; // Set the file name
      link.click(); // Trigger the download
    }
  };

  const options = [
    { value: "chocolate", label: "Marketplace: All" },
    { value: "strawberry", label: "Marketplace: All" },
    { value: "vanilla", label: "Marketplace: All" },
  ];
  const [tags, setTags] = useState([]);
  const tagLimit = 10;
  const handleTagKeyDown = (e) => {
    if (e.keyCode === 188 || e.keyCode === 13) {
      e.preventDefault();
      let tag = e.target.value;
      if (tag && tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setTags([...tags, tag]);
        }
      } else {
        // Optionally, provide feedback to the user that the tag limit has been reached
        toast.warning(`Tag limit reached.`);
      }
      e.target.value = "";
    }
  };
  const removeTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
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
                    {/* <canvas
                      ref={canvasBackRef}
                      className={`back ${isBackView ? "" : ""}`}
                      style={{
                        border: "1px solid #ddd",
                        position: "relative",
                      }}
                    ></canvas> */}

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
                      {tags.map((tag, index) => {
                        return (
                          <Tag
                            key={index}
                            tag={tag}
                            onRemove={() => removeTag(index)}
                          />
                        );
                      })}

                      <input
                        type='text'
                        id='tagInput'
                        className='tag-input'
                        maxLength='200'
                        onKeyDown={handleTagKeyDown}
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
