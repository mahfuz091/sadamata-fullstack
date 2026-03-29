"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import DashSidebar from "../DashSidebar/DashSidebar";
import bgImage from "@/assets/images/backgrounds/admin-bg-home.jpg";
import userImage from "@/assets/images/resources/user-1-1.png";
import { useTransition } from "react";
import { updateBrand } from "@/app/actions/brandActions";
import { Modal } from "react-bootstrap";

// Custom styles for brand socials
const brandStyles = `
  .brand-socials-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .brand-social-link {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--commerce-text);
    transition: all 0.3s ease;
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  .brand-social-link:hover {
    background-color: var(--commerce-base);
    color: white;
    transform: translateY(-2px);
  }
  .input-group-text {
    background-color: #f8f9fa;
    border-color: #e8effc;
    width: 45px;
    justify-content: center;
    color: var(--commerce-text);
  }
  .banner-upload-preview {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #f7f8fa;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s ease;
  }
  .banner-upload-preview:hover {
    border-color: var(--commerce-base) !important;
  }
  .banner-upload-preview.is-dragging {
    border: 2px dashed var(--commerce-base) !important;
    background-color: rgba(var(--commerce-base-rgb), 0.05);
  }
  .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 2;
  }
  .banner-upload-preview:hover .banner-overlay {
    opacity: 1;
  }
  .banner-upload-preview i {
    font-size: 24px;
    margin-bottom: 8px;
  }
  .reposition-hint {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    pointer-events: none;
    z-index: 3;
  }
  .grabbing {
    cursor: grabbing !important;
  }
  .grab {
    cursor: grab !important;
  }
  .banner-edit-container {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;
  }
  .banner-edit-btn {
    background: white;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1c1e21;
    transition: background 0.2s;
  }
  .banner-edit-btn:hover {
    background: #f2f2f2;
  }
  .banner-dropdown-menu {
    position: absolute;
    bottom: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 200px;
    padding: 8px 0;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }
  .banner-dropdown-item {
    background: none;
    border: none;
    padding: 8px 16px;
    text-align: left;
    font-size: 14px;
    color: #1c1e21;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background 0.2s;
  }
  .banner-dropdown-item:hover {
    background: #f2f2f2;
  }
  .banner-reposition-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 12px 20px;
    background: rgba(0,0,0,0.6);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 15;
  }
  .banner-reposition-controls {
    display: flex;
    gap: 12px;
  }
  .banner-btn-save {
    background: var(--commerce-base);
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 6px;
    font-weight: 600;
  }
  .banner-btn-cancel {
    background: rgba(255,255,255,0.2);
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 6px;
    font-weight: 600;
  }
`;

export default function DashBrand({
  data = [],
  brandName,
  profileImageUrl,
  brand,
  brandBannerUrl,
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeMockup = useMemo(() => data[activeIdx], [data, activeIdx]);

  // State for the form inputs
  const [newBanner, setNewBanner] = useState(null);
  const [facebookLink, setFacebookLink] = useState(brand?.facebookLink || "");
  const [twitterLink, setTwitterLink] = useState(brand?.twitterLink || "");
  const [instagramLink, setInstagramLink] = useState(brand?.instagramLink || "");
  const [linkedinLink, setLinkedinLink] = useState(brand?.linkedinLink || "");

  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(brandBannerUrl); // For the banner image preview
  const [isPending, startTransition] = useTransition(); // For handling transitions

  const fileInputRef = useRef(null);
  const mainFileInputRef = useRef(null);
  const bannerContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bannerPos, setBannerPos] = useState(brand?.bannerPosition || 50); // Vertical position in %
  const [startY, setStartY] = useState(0);
  const [startPos, setStartPos] = useState(50);

  const [showBannerMenu, setShowBannerMenu] = useState(false);
  const [isRepositioningMain, setIsRepositioningMain] = useState(false);
  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [tempBannerPos, setTempBannerPos] = useState(brand?.bannerPosition || 50);

  const bannerMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bannerMenuRef.current && !bannerMenuRef.current.contains(event.target)) {
        setShowBannerMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Sync position if brand data changes
  useEffect(() => {
    if (brand?.bannerPosition) {
      setBannerPos(brand.bannerPosition);
      setTempBannerPos(brand.bannerPosition);
    }
  }, [brand?.bannerPosition]);

  // Function to handle banner file change
  const handleBannerChange = (event) => {
    const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setNewBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewUrl(reader.result); // Set the preview URL
        // If it was a direct upload from the banner area, maybe we enter reposition mode automatically or just save?
        // Let's match FB: Uploading usually just sets it, but maybe we show "Reposition" after.
        // For now, if uploaded from main, we'll just save it.
      };
      reader.readAsDataURL(file);
      
      // If it's the main input, treat as direct save
      if (event.target === mainFileInputRef.current) {
        handleDirectBannerSave(file);
      }
    }
  };

  const handleDirectBannerSave = async (file, pos) => {
    const formData = new FormData();
    formData.append("brandId", brand?.id);
    if (file) formData.append("bannerFile", file);
    if (pos !== undefined) formData.append("bannerPosition", pos);
    
    startTransition(async () => {
      try {
        const res = await updateBrand(formData);
        if (res.success) {
          console.log("Banner updated successfully");
          setIsRepositioningMain(false);
        }
      } catch (err) {
        console.error("Direct save failed:", err);
      }
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleBannerChange(e);
  };

  // Repositioning logic for main banner
  const handleMouseDown = (e) => {
    if (!isRepositioningMain) return;
    setIsDraggingMain(true);
    setStartY(e.clientY);
    setStartPos(parseFloat(tempBannerPos));
    e.preventDefault(); // Prevent text selection
  };

  const handleMouseMove = (e) => {
    if (!isDraggingMain) return;
    
    const deltaY = e.clientY - startY;
    
    // Calculate sensitivity based on container height if available
    // High sensitivity for better feel
    const containerHeight = bannerContainerRef.current?.offsetHeight || 300;
    // Scale sensitivity: 100% of banner height move = 100% shift in background pos
    const sensitivity = 0.8; 
    
    const movement = (deltaY / containerHeight) * 100 * sensitivity;
    
    setTempBannerPos(prev => {
      const next = startPos - movement; 
      return Math.max(0, Math.min(100, next)).toFixed(2);
    });
  };

  const handleMouseUp = () => {
    setIsDraggingMain(false);
  };

  // Repositioning for main banner
  const startMainReposition = () => {
    setIsRepositioningMain(true);
    setShowBannerMenu(false);
  };

  const saveReposition = () => {
    setBannerPos(tempBannerPos);
    handleDirectBannerSave(null, tempBannerPos);
  };

  const cancelReposition = () => {
    setTempBannerPos(bannerPos);
    setIsRepositioningMain(false);
  };

  useEffect(() => {
    if (isDraggingMain) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingMain, startY, startPos]);

  // Function to update brand (direct call to the action function)
  const handleUpdateBrand = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("brandId", brand?.id); // Use the correct brand ID from props
    if (newBanner) {
      formData.append("bannerFile", newBanner); // Add the new banner file
    }
    formData.append("facebookLink", facebookLink);
    formData.append("twitterLink", twitterLink);
    formData.append("instagramLink", instagramLink);
    formData.append("linkedinLink", linkedinLink);
    formData.append("bannerPosition", bannerPos);

    startTransition(async () => {
      try {
        // Directly call the updateBrand function
        const res = await updateBrand(formData);

        if (res.success) {
          console.log("Brand updated successfully");
          handleClose();
        } else {
          console.error("Update failed:", res.message);
        }
      } catch (error) {
        console.error("Error updating brand:", error);
      }
    });
  };

  return (
    <section className="dashboard-area section-space">
      <style>{brandStyles}</style>
      <div className="container">
        <div className="row gutter-x-40">
          <div className="col-lg-3">
            <DashSidebar />
          </div>

          <div className="col-lg-9">
            <div className="dashboard-area__content">
              <div className="brand-profile-top">
                <div
                  ref={bannerContainerRef}
                  className={`brand-profile-top__bg ${isRepositioningMain ? 'grab' : ''} ${isDraggingMain ? 'grabbing' : ''}`}
                  style={{
                    backgroundImage: `url(${bannerPreviewUrl || bgImage.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: `center ${isRepositioningMain ? tempBannerPos : bannerPos}%`,
                    cursor: isRepositioningMain ? (isDraggingMain ? 'grabbing' : 'grab') : 'default'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {isRepositioningMain && (
                    <div className="banner-reposition-header">
                      <span><i className="icon-move"></i> Drag to Reposition Cover Photo</span>
                      <div className="banner-reposition-controls">
                        <button className="banner-btn-cancel" onClick={cancelReposition}>Cancel</button>
                        <button className="banner-btn-save" onClick={saveReposition}>Save Changes</button>
                      </div>
                    </div>
                  )}

                  {!isRepositioningMain && (
                    <div className="banner-edit-container" ref={bannerMenuRef}>
                      <button 
                        className="banner-edit-btn" 
                        onClick={() => setShowBannerMenu(!showBannerMenu)}
                      >
                        <i className="icon-camera-plus"></i> Edit cover photo
                      </button>
                      
                      {showBannerMenu && (
                        <div className="banner-dropdown-menu">
                          <button className="banner-dropdown-item" onClick={() => mainFileInputRef.current.click()}>
                            <i className="icon-upload"></i> Upload photo
                          </button>
                          <button className="banner-dropdown-item" onClick={startMainReposition}>
                            <i className="icon-move"></i> Reposition
                          </button>
                          <button className="banner-dropdown-item" onClick={() => handleDirectBannerSave(null, "50")}>
                            <i className="icon-trash"></i> Remove
                          </button>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        ref={mainFileInputRef} 
                        className="d-none" 
                        onChange={handleBannerChange}
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
                <div className="brand-profile-top__inner">
                  <div className="brand-profile-top__profile">
                    <div className="brand-profile-top__left">
                      <div className="brand-profile-top__image">
                        <Image
                          src={profileImageUrl || userImage}
                          alt="user image"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="brand-profile-top__content">
                        <h4 className="brand-profile-top__name">{brandName}</h4>
                        <span className="brand-profile-top__followers">
                          {(() => {
                            const num = brand?._count?.BrandFollow || 0;
                            if (num >= 1000000) return (Math.floor(num / 100000) / 10) + "M";
                            if (num >= 1000) return (Math.floor(num / 100) / 10) + "K";
                            return num;
                          })()}{" "}
                          Followers
                        </span>
                        <div className="brand-socials-wrapper mt-3">
                          {brand?.facebookLink && (
                            <a href={brand.facebookLink} target="_blank" rel="noopener noreferrer" className="brand-social-link">
                              <i className="fab fa-facebook-f"></i>
                            </a>
                          )}
                          {brand?.twitterLink && (
                            <a href={brand.twitterLink} target="_blank" rel="noopener noreferrer" className="brand-social-link">
                              <i className="icon-twitter"></i>
                            </a>
                          )}
                          {brand?.instagramLink && (
                            <a href={brand.instagramLink} target="_blank" rel="noopener noreferrer" className="brand-social-link">
                              <i className="icon-instragram"></i>
                            </a>
                          )}
                          {brand?.linkedinLink && (
                            <a href={brand.linkedinLink} target="_blank" rel="noopener noreferrer" className="brand-social-link">
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="brand-profile-top__right">
                      <div className="brand-profile-top__btn">
                        <button
                          type="button"
                          className="commerce-btn"
                          onClick={handleShow}
                        >
                          <i className="icon-edit-2"></i> Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  <ul className="brand-profile-top__list list-unstyled">
                    {data.map((m, idx) => (
                      <li key={m.id} className={idx === activeIdx ? "active" : ""}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveIdx(idx);
                          }}
                          title={`${m.name} • ${m.productCount} products`}
                        >
                          {m.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal to update brand */}
              <Modal show={showModal} onHide={handleClose} size="lg" centered className="edit-brand-modal">
                <Modal.Header closeButton>
                  <Modal.Title id="editBrandModalLabel">Edit Brand Profile</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleUpdateBrand}>
                  <Modal.Body>

                    <hr />

                    <div className="mb-3">
                      <label className="form-label fw-bold">Social Media Links</label>
                    </div>
                    
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text"><i className="fab fa-facebook-f"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          value={facebookLink}
                          onChange={(e) => setFacebookLink(e.target.value)}
                          placeholder="Facebook Profile URL"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text"><i className="icon-twitter"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          value={twitterLink}
                          onChange={(e) => setTwitterLink(e.target.value)}
                          placeholder="Twitter Profile URL"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text"><i className="icon-instragram"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          value={instagramLink}
                          onChange={(e) => setInstagramLink(e.target.value)}
                          placeholder="Instagram Profile URL"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text"><i className="fab fa-linkedin-in"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          value={linkedinLink}
                          onChange={(e) => setLinkedinLink(e.target.value)}
                          placeholder="LinkedIn Profile URL"
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isPending}>
                      {isPending ? "Updating..." : "Save Changes"}
                    </button>
                  </Modal.Footer>
                </form>
              </Modal>

              {/* end products */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}