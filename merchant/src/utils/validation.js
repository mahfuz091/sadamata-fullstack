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

export const validatePngFile = (file) => {
  if (!file) return false;

  // size check (25 MB)
  const MAX_SIZE = 25 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    toast.error("File size must be less than 25 MB.");
    return false;
  }

  // strict PNG check
  const isPng =
    file.type === "image/png" || file.name.toLowerCase().endsWith(".png");

  if (!isPng) {
    toast.error("Only PNG files are allowed.");
    return false;
  }

  return true;
};
