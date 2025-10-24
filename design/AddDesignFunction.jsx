"use client";

import { useState, useRef, useEffect } from "react";
import DashSidebar from "../DashSidebar/DashSidebar";
import Tag from "./Tag";
import { fabric } from "fabric";

export default function AddDesignFunction({ allMockup }) {
  // Refs for canvases
  const canvasRef = useRef(null);
  const canvasBackRef = useRef(null);
  const canvasInstance = useRef(null);
  const canvasBackInstance = useRef(null);

  // Product states
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const activeProduct = activeProductIndex !== null ? allMockup[activeProductIndex] : null;

  // File uploads
  const [designImage, setDesignImage] = useState(null);
  const [designBack, setDesignBack] = useState(null);
  const [fileName, setFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");

  // UI toggles
  const [isBackView, setIsBackView] = useState(false);

  // Product options
  const [fitTypes, setFitTypes] = useState(["Slim", "Regular", "Loose"]);
  const [activeFit, setActiveFit] = useState({});
  const [colors, setColors] = useState(["#ff0000", "#00ff00", "#0000ff"]);
  const [activeColor, setActiveColor] = useState({});

  // Tags
  const [tags, setTags] = useState([]);

  // Brand and price
  const [brandOption, setBrandOption] = useState("non-brand");
  const [brands] = useState(["Nike", "Adidas", "Puma"]);
  const [price, setPrice] = useState(500);

  // Product features
  const [features, setFeatures] = useState({
    title: "",
    feature1: "",
    feature2: "",
    description: "",
  });

  // ------------------- FILE HANDLERS -------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setDesignImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBackFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setDesignBack(reader.result);
    reader.readAsDataURL(file);
  };

  // ------------------- CANVAS SETUP -------------------
  useEffect(() => {
    if (canvasRef.current && !canvasInstance.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 400,
        selection: false,
      });
    }
    if (canvasBackRef.current && !canvasBackInstance.current) {
      canvasBackInstance.current = new fabric.Canvas(canvasBackRef.current, {
        width: 400,
        height: 400,
        selection: false,
      });
    }
  }, []);

  useEffect(() => {
    if (canvasInstance.current && designImage) {
      fabric.Image.fromURL(designImage, (img) => {
        img.set({
          left: 0,
          top: 0,
          scaleX: canvasInstance.current.width / img.width,
          scaleY: canvasInstance.current.height / img.height,
          selectable: false,
        });
        canvasInstance.current.clear();
        canvasInstance.current.add(img);
      });
    }
  }, [designImage]);

  useEffect(() => {
    if (canvasBackInstance.current && designBack) {
      fabric.Image.fromURL(designBack, (img) => {
        img.set({
          left: 0,
          top: 0,
          scaleX: canvasBackInstance.current.width / img.width,
          scaleY: canvasBackInstance.current.height / img.height,
          selectable: false,
        });
        canvasBackInstance.current.clear();
        canvasBackInstance.current.add(img);
      });
    }
  }, [designBack]);

  // ------------------- TAG HANDLERS -------------------
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !tags.includes(tag) && tags.length < 10) setTags([...tags, tag]);
      e.target.value = "";
    }
  };

  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index));

  // ------------------- FIT & COLOR -------------------
  const handleFitChange = (fit) => {
    setActiveFit({ ...activeFit, [activeProductIndex]: fit });
  };

  const handleColorChange = (color) => {
    setActiveColor({ ...activeColor, [activeProductIndex]: color });
  };

  const handleFrontButtonClick = () => setIsBackView(false);
  const handleBackButtonClick = () => setIsBackView(true);

  // ------------------- FEATURE HANDLERS -------------------
  const handleFeatureChange = (field, value) => {
    setFeatures({ ...features, [field]: value });
  };

  return (
    <section className="dashboard-area section-space">
      <div className="container">
        <div className="row gutter-x-40">
          <div className="col-lg-3">
            <DashSidebar />
          </div>
          <div className="col-lg-9">
            <div className="dashboard-area__content">
              {/* Upload Area */}
              <div className="dashboard-area__uplode">
                <div className="dashboard-area__uplode-box">
                  <form>
                    <div className="upload-area file-upload__area">
                      <label htmlFor="image-upload" className="file-upload__label">
                        <input
                          type="file"
                          id="image-upload"
                          hidden
                          onChange={handleFileChange}
                        />
                        {designImage ? (
                          <img src={designImage} alt="Uploaded Design" width={200} height={200} />
                        ) : (
                          <div>
                            <div className="image-upload__icon">📁</div>
                            <span className="file-name">{fileName}</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              {/* Product Grid */}
              <div className="product-category-list d-flex overflow-x-auto">
                {allMockup.map((item, index) => (
                  <div className="item" key={item.id ?? index}>
                    <div className="product__item-two">
                      <div className="product__item-two__img">
                        <canvas
                          ref={(el) => {
                            if (el) canvasRefs.current[index] = el;
                          }}
                          style={{ border: "1px solid #ddd", position: "relative" }}
                        />
                      </div>
                      <div className="product__item-two__content">
                        <h4 className="product__item-two__title">{item.name}</h4>
                        <button onClick={() => setActiveProductIndex(index)} className="commerce-btn">
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Product Preview */}
              {activeProduct && (
                <div className="product-preview-panel">
                  <h2>Preview for {activeProduct.name}</h2>
                  <div className="row gutter-x-30 gutter-y-30">
                    <div className="col-lg-6">
                      <div className="product-preview-panel__view-toggle">
                        <button className={`toggle-btn ${!isBackView ? "active" : ""}`} onClick={handleFrontButtonClick}>
                          Front
                        </button>
                        <button className={`toggle-btn ${isBackView ? "active" : ""}`} onClick={handleBackButtonClick}>
                          Back
                        </button>
                      </div>
                      {isBackView ? (
                        <label htmlFor="backimage-upload">
                          <canvas ref={canvasBackRef} style={{ border: "1px solid #ddd" }} />
                          <input
                            type="file"
                            id="backimage-upload"
                            hidden
                            onChange={handleBackFileChange}
                            disabled={!!designBack}
                          />
                        </label>
                      ) : (
                        <canvas ref={canvasRef} style={{ border: "1px solid #ddd" }} />
                      )}
                    </div>

                    <div className="col-lg-6">
                      {/* Fit Types */}
                      <div className="product-preview-panel__fit-type-selector">
                        <p className="product-preview-panel__label">Choose fit types:</p>
                        <div className="d-flex gap-3 flex-wrap">
                          {fitTypes.map((fit) => (
                            <label key={fit} className="fit-checkbox">
                              <input
                                type="radio"
                                name={`fitType-${activeProductIndex}`}
                                checked={activeFit[activeProductIndex] === fit}
                                onChange={() => handleFitChange(fit)}
                              />
                              <span className="custom-check"></span>
                              {fit}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Color Selector */}
                      <div className="product-preview-panel__color-chooser">
                        <p className="product-preview-panel__label">Choose colors:</p>
                        <div className="color-options d-flex gap-2 flex-wrap">
                          {colors.map((color) => (
                            <label key={color} className="color-option">
                              <input
                                type="radio"
                                name={`color-${activeProductIndex}`}
                                checked={activeColor[activeProductIndex] === color}
                                onChange={() => handleColorChange(color)}
                                hidden
                              />
                              <span
                                className="color-circle"
                                style={{
                                  backgroundColor: color,
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  border: "1px solid #ccc",
                                  display: "inline-block",
                                }}
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="product-preview-panel__price-input-field">
                        <label className="product-preview-panel__label">Price (Minimum BDT 500):</label>
                        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="product-details__keyword">
                <div className="tag-box">
                  {tags.map((tag, index) => (
                    <Tag key={index} tag={tag} onRemove={() => removeTag(index)} />
                  ))}
                  <input type="text" onKeyDown={handleTagKeyDown} placeholder="Enter tag and press Enter" />
                </div>
              </div>

              {/* Product Features */}
              <div className="product-details__form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Design Title"
                    value={features.title}
                    onChange={(e) => handleFeatureChange("title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Feature 1"
                    value={features.feature1}
                    onChange={(e) => handleFeatureChange("feature1", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Feature 2"
                    value={features.feature2}
                    onChange={(e) => handleFeatureChange("feature2", e.target.value)}
                  />
                  <textarea
                    placeholder="Product Description"
                    value={features.description}
                    onChange={(e) => handleFeatureChange("description", e.target.value)}
                  />
                </div>
              </div>

              {/* Brand selection */}
              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="brandOption"
                    value="non-brand"
                    checked={brandOption === "non-brand"}
                    onChange={(e) => setBrandOption(e.target.value)}
                  />
                  Non-brand
                </label>
                <label>
                  <input
                    type="radio"
                    name="brandOption"
                    value="select-brand"
                    checked={brandOption === "select-brand"}
                    onChange={(e) => setBrandOption(e.target.value)}
                  />
                  Select Brand
                </label>
                {brandOption === "non-brand" && <input type="text" placeholder="Write your brand" />}
                {brandOption === "select-brand" && (
                  <select>
                    <option value="">--Select a Brand--</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
