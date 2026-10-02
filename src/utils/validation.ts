export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) return true; // Email can be optional if mobile number is provided
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const cleanPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.substring(2);
  }
  return digits;
};

export const validatePhone = (phone: string): boolean => {
  const clean = cleanPhoneNumber(phone);
  // Valid 10-digit Indian phone number (typically starts with 6, 7, 8, 9)
  return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
};

export const validateSignup = (data: {
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  email?: string;
}): { isValid: boolean; error?: string } => {
  if (!data.fullName || data.fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name is required (at least 2 characters).' };
  }
  if (!data.phone || !validatePhone(data.phone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' };
  }
  if (data.email && data.email.trim() && !validateEmail(data.email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  if (!data.password || data.password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  if (data.password !== data.confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  if (!data.address || data.address.trim().length < 5) {
    return { isValid: false, error: 'Please enter your delivery address.' };
  }
  return { isValid: true };
};
