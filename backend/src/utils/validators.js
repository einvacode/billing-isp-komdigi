/**
 * Validate NPWP (Nomor Pokok Wajib Pajak)
 * Format: 15 digits total
 * Structure: DD.DDD.DDD.D-DDD.DDD
 */
const validateNPWP = (npwp) => {
  if (!npwp) return true; // NPWP is optional

  // Remove formatting characters
  const cleanNPWP = npwp.replace(/[.\-\s]/g, '');

  // Check length
  if (cleanNPWP.length !== 15) return false;

  // Check if all digits
  if (!/^[0-9]{15}$/.test(cleanNPWP)) return false;

  // Validate check digit using modulo 11
  const npwpDigits = cleanNPWP.split('').map(Number);
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7];

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    sum += npwpDigits[i] * multipliers[i];
  }

  const remainder = sum % 11;
  const checkDigit = remainder === 0 ? 0 : 11 - remainder;

  return checkDigit === npwpDigits[14];
};

/**
 * Validate KTP (Kartu Tanda Penduduk)
 * Format: 16 digits
 */
const validateKTP = (ktp) => {
  if (!ktp) return true; // KTP is optional

  // Remove formatting characters
  const cleanKTP = ktp.replace(/[.\-\s]/g, '');

  // Check length
  if (cleanKTP.length !== 16) return false;

  // Check if all digits
  if (!/^[0-9]{16}$/.test(cleanKTP)) return false;

  return true;
};

/**
 * Validate Email
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Phone
 */
const validatePhone = (phone) => {
  const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * Validate Postal Code (Indonesia)
 */
const validatePostalCode = (postalCode) => {
  return /^[0-9]{5}$/.test(postalCode);
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword: (password) => password && password.length >= 8,
  validateNPWP,
  validateKTP,
  validatePostalCode,
  validatePasswordStrength: (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }
};
