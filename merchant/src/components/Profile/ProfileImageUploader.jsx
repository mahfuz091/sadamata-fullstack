"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserProfileImageS3 } from "@/app/actions/auth/userAddressActions";

const FALLBACK = "/assets/images/resources/avater.png";

export default function ProfileImageUploader({ userId, initialUrl }) {
  const [preview, setPreview] = useState(initialUrl || FALLBACK);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // parent থেকে URL change হলে sync
    if (initialUrl) setPreview(initialUrl);
  }, [initialUrl]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // instant preview
    const localUrl = URL.createObjectURL(selectedFile);
    setPreview(localUrl);

    try {
      setUploading(true);
      const updated = await updateUserProfileImageS3(userId, selectedFile);

      // signed url returned from server
      setPreview(updated.profileImageUrl || FALLBACK);

      toast.success("Profile image updated!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to upload image");
      setPreview(initialUrl || FALLBACK);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='user-profile__info__avater'>
      <div className='avatar-container'>
        <img src={preview} alt='Profile Avatar' className='avatar' />

        <div className='verified-badge'>
          <input
            type='file'
            name='image'
            id='avater'
            accept='image/*'
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor='avater' style={{ opacity: uploading ? 0.6 : 1 }}>
            {/* তোমার SVG same রাখো */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13'
                stroke='#1B2124'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16.0418 3.02001L8.16183 10.9C7.86183 11.2 7.56183 11.79 7.50183 12.22L7.07183 15.23C6.91183 16.32 7.68183 17.08 8.77183 16.93L11.7818 16.5C12.2018 16.44 12.7918 16.14 13.1018 15.84L20.9818 7.96001C22.3418 6.60001 22.9818 5.02001 20.9818 3.02001C18.9818 1.02001 17.4018 1.66001 16.0418 3.02001Z'
                stroke='#1B2124'
                strokeWidth='1.5'
                strokeMiterlimit='10'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
}
