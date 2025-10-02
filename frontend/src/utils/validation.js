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
