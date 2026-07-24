const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters
  if (password.length < 8) return false;
  return true;
};

const validatePasswordStrength = (password) => {
  // Check for uppercase, lowercase, number, special char
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

const validatePhone = (phone) => {
  const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePasswordStrength,
  validatePhone
};
