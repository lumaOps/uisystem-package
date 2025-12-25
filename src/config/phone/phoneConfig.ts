export const PHONE_COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸', mask: '(999) 999-9999' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', mask: '(999) 999-9999' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', mask: '99999 999999' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', mask: '9999 999 999' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', mask: '9999 9999999' },
  { name: 'Italy', code: '+39', flag: '🇮🇹', mask: '999 999 9999' },
  { name: 'Spain', code: '+34', flag: '🇪🇸', mask: '999 99 99 99' },
  { name: 'France', code: '+33', flag: '🇫🇷', mask: '9 99 99 99 99' },
  { name: 'India', code: '+91', flag: '🇮🇳', mask: '99999 99999' },
  { name: 'China', code: '+86', flag: '🇨🇳', mask: '999 9999 9999' },
] as const;

export type PhoneCountry = (typeof PHONE_COUNTRIES)[number];

// Helper function to get mask by country code
export const getPhoneMaskByCountryCode = (countryCode: string): string => {
  const country = PHONE_COUNTRIES.find(c => c.code === countryCode);
  return country?.mask || '(999) 999-9999';
};

// Helper function to format phone number
export const formatPhoneNumber = (value: string, mask: string): string => {
  if (!value) return '';

  const numbers = value.replace(/\D/g, '');
  let result = '';
  let numberIndex = 0;

  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '9') {
      result += numbers[numberIndex];
      numberIndex++;
    } else {
      result += mask[i];
    }
  }

  return result;
};

// Helper to clean phone number (remove formatting, keep only numbers and plus sign)
export const cleanPhoneNumber = (value: string): string => {
  return value.replace(/[^\d+]/g, '');
};

// Validate phone number (basic validation)
export const isValidPhoneNumber = (value: string, countryCode: string): boolean => {
  const cleanedNumber = cleanPhoneNumber(value);
  if (!cleanedNumber.startsWith(countryCode)) return false;

  // Get expected length based on country
  const country = PHONE_COUNTRIES.find(c => c.code === countryCode);
  if (!country) return false;

  const expectedLength = country.mask.replace(/[^9]/g, '').length + countryCode.length - 1;
  return cleanedNumber.length === expectedLength;
};
