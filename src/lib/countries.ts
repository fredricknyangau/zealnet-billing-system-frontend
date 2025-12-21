export interface Country {
  code: string;        // ISO 3166-1 alpha-2 code (e.g., "KE")
  name: string;        // Country name
  dialCode: string;    // Country calling code (e.g., "254")
  flag: string;        // Flag emoji
  format?: string;     // Phone number format/mask (optional)
  priority?: number;   // For sorting (lower = higher priority)
}

// Primary countries (shown at top)
export const PRIMARY_COUNTRIES: Country[] = [
  {
    code: "KE",
    name: "Kenya",
    dialCode: "254",
    flag: "🇰🇪",
    format: "### ### ###",
    priority: 1,
  },
  {
    code: "TZ",
    name: "Tanzania",
    dialCode: "255",
    flag: "🇹🇿",
    format: "### ### ###",
    priority: 2,
  },
  {
    code: "UG",
    name: "Uganda",
    dialCode: "256",
    flag: "🇺🇬",
    format: "### ### ###",
    priority: 3,
  },
  {
    code: "RW",
    name: "Rwanda",
    dialCode: "250",
    flag: "🇷🇼",
    format: "### ### ###",
    priority: 4,
  },
];

// All supported countries
export const ALL_COUNTRIES: Country[] = [
  ...PRIMARY_COUNTRIES,
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "27",
    flag: "🇿🇦",
    format: "## ### ####",
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "234",
    flag: "🇳🇬",
    format: "### ### ####",
  },
  {
    code: "GH",
    name: "Ghana",
    dialCode: "233",
    flag: "🇬🇭",
    format: "### ### ###",
  },
  {
    code: "ET",
    name: "Ethiopia",
    dialCode: "251",
    flag: "🇪🇹",
    format: "## ### ####",
  },
  {
    code: "EG",
    name: "Egypt",
    dialCode: "20",
    flag: "🇪🇬",
    format: "### ### ####",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "44",
    flag: "🇬🇧",
    format: "#### ### ###",
  },
  {
    code: "US",
    name: "United States",
    dialCode: "1",
    flag: "🇺🇸",
    format: "(###) ### ####",
  },
];

// Default country
export const DEFAULT_COUNTRY: Country = PRIMARY_COUNTRIES[0]; // Kenya

/**
 * Get country by ISO code
 */
export function getCountryByCode(code: string): Country | undefined {
  return ALL_COUNTRIES.find((c) => c.code === code);
}

/**
 * Get country by dial code
 */
export function getCountryByDialCode(dialCode: string): Country | undefined {
  return ALL_COUNTRIES.find((c) => c.dialCode === dialCode);
}

/**
 * Parse phone number to extract country code
 * Returns country object and national number
 */
export function parsePhoneNumber(phone: string): {
  country: Country | undefined;
  nationalNumber: string;
} {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Try to match country by dial code (longest first)
  const sortedCountries = [...ALL_COUNTRIES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  for (const country of sortedCountries) {
    if (cleaned.startsWith(country.dialCode)) {
      return {
        country,
        nationalNumber: cleaned.slice(country.dialCode.length),
      };
    }
  }

  return {
    country: undefined,
    nationalNumber: cleaned,
  };
}

/**
 * Format phone number to E.164 format
 * @param phone - Phone number in any format
 * @param defaultCountry - Default country to use if no country code present
 * @returns E.164 formatted number (e.g., "+254712345678")
 */
export function formatE164(
  phone: string,
  defaultCountry: Country = DEFAULT_COUNTRY
): string {
  const cleaned = phone.replace(/\D/g, "");

  // Check if already has country code
  const parsed = parsePhoneNumber(cleaned);

  if (parsed.country) {
    return `+${parsed.country.dialCode}${parsed.nationalNumber}`;
  }

  // Use default country
  return `+${defaultCountry.dialCode}${cleaned}`;
}

/**
 * Format phone number for display with spaces
 * @param phone - E.164 phone number (e.g., "+254712345678")
 * @returns Formatted display number (e.g., "+254 712 345 678")
 */
export function formatPhoneDisplay(phone: string): string {
  const parsed = parsePhoneNumber(phone);

  if (!parsed.country || !parsed.nationalNumber) {
    return phone;
  }

  const { country, nationalNumber } = parsed;

  // Apply format mask if available
  if (country.format) {
    let formatted = "";
    let numIndex = 0;

    for (const char of country.format) {
      if (char === "#") {
        if (numIndex < nationalNumber.length) {
          formatted += nationalNumber[numIndex++];
        }
      } else {
        formatted += char;
      }
    }

    return `+${country.dialCode} ${formatted}`;
  }

  // Default formatting: groups of 3
  const groups = nationalNumber.match(/.{1,3}/g) || [];
  return `+${country.dialCode} ${groups.join(" ")}`;
}

/**
 * Validate E.164 phone number format
 * @param phone - Phone number to validate
 * @returns true if valid E.164 format
 */
export function validateE164(phone: string): boolean {
  // E.164 format: +[1-3 digit country code][4-15 digit number]
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Validate phone number for specific country
 * @param phone - Phone number (can be with or without country code)
 * @param country - Country to validate against
 * @returns true if valid for that country
 */
export function validatePhoneForCountry(
  phone: string,
  country: Country
): boolean {
  const cleaned = phone.replace(/\D/g, "");

  // Check if it starts with country's dial code
  if (cleaned.startsWith(country.dialCode)) {
    const nationalNumber = cleaned.slice(country.dialCode.length);
    // Most African countries have 9-10 digit national numbers
    return nationalNumber.length >= 9 && nationalNumber.length <= 10;
  }

  // If no country code, assume it's a national number
  return cleaned.length >= 9 && cleaned.length <= 10;
}
