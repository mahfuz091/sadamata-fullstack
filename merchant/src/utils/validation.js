import { toast } from "sonner";

// Email validator
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Bangladeshi phone validator
export function isValidBDPhone(phone) {
  // Accepts: 017xxxxxxxx, 018xxxxxxxx OR +88017xxxxxxxx
  const regex = /^(?:\+8801|01)[3-9][0-9]{8}$/;
  return regex.test(phone);
}

// export const validatePngFile = (file) => {
//   if (!file) return false;

//   // size check (25 MB)
//   const MAX_SIZE = 25 * 1024 * 1024;
//   if (file.size > MAX_SIZE) {
//     toast.error("File size must be less than 25 MB.");
//     return false;
//   }

//   // strict PNG check
//   const isPng =
//     file.type === "image/png" || file.name.toLowerCase().endsWith(".png");

//   if (!isPng) {
//     toast.error("Only PNG files are allowed.");
//     return false;
//   }

//   return true;
// };

export const validatePngFile = async (
  file,
  minWidth = 4500,
  minHeight = 5400
) => {
  if (!file) return false;

  if (file.type !== "image/png") {
    toast.error("Only PNG files are allowed.");
    return false;
  }

  const img = new Image();
  const url = URL.createObjectURL(file);

  const isValid = await new Promise((resolve) => {
    img.onload = () => {
      const ok = img.width >= minWidth && img.height >= minHeight;

      if (!ok) {
        toast.error(
          `Design resolution too small.
Minimum required: ${minWidth} × ${minHeight}px
Uploaded: ${img.width} × ${img.height}px`
        );
      }

      URL.revokeObjectURL(url);
      resolve(ok);
    };

    img.onerror = () => {
      toast.error("Invalid image file.");
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });

  return isValid;
};
