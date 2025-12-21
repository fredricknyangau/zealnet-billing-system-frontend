import React, { useState, useRef, useEffect } from "react";
import {
  Country,
  ALL_COUNTRIES,
  DEFAULT_COUNTRY,
  getCountryByCode,
  parsePhoneNumber,
  validateE164,
  validatePhoneForCountry,
} from "@/lib/countries";

interface PhoneInputProps {
  value: string; // E.164 format: "+254712345678"
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: string; // ISO code: "KE", "TZ", etc.
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  error,
  label,
  placeholder = "712 345 678",
  required = false,
  disabled = false,
  defaultCountry = "KE",
  className = "",
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    getCountryByCode(defaultCountry) || DEFAULT_COUNTRY
  );
  const [nationalNumber, setNationalNumber] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const parsed = parsePhoneNumber(value);
      if (parsed.country) {
        setSelectedCountry(parsed.country);
        setNationalNumber(parsed.nationalNumber);
      }
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setNationalNumber(input);

    // Update parent with E.164 format
    const e164 = input ? `+${selectedCountry.dialCode}${input}` : "";
    onChange(e164);
  };

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery("");

    // Update parent with new country code
    if (nationalNumber) {
      const e164 = `+${country.dialCode}${nationalNumber}`;
      onChange(e164);
    }
  };

  // Filter countries by search query
  const filteredCountries = ALL_COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate primary and other countries
  const primaryFiltered = filteredCountries.filter((c) => c.priority);
  const otherFiltered = filteredCountries.filter((c) => !c.priority);

  const isValid = value ? validateE164(value) && validatePhoneForCountry(value, selectedCountry) : true;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-content-primary">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Main input container */}
        <div
          className={`
            flex items-center w-full rounded-lg border transition-all
            ${
              error
                ? "border-semantic-error focus-within:ring-2 focus-within:ring-semantic-error/20"
                : isValid
                ? "border-border-primary focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20"
                : "border-semantic-warning focus-within:ring-2 focus-within:ring-semantic-warning/20"
            }
            ${disabled ? "bg-bg-secondary opacity-60 cursor-not-allowed" : "bg-bg-primary"}
          `}
        >
          {/* Country selector button */}
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-3 py-2.5 rounded-l-lg
              border-r border-border-primary
              hover:bg-bg-secondary transition-colors
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
            aria-label="Select country"
            aria-expanded={isDropdownOpen}
          >
            <span className="text-xl" role="img" aria-label={selectedCountry.name}>
              {selectedCountry.flag}
            </span>
            <span className="text-sm font-medium text-content-primary">
              +{selectedCountry.dialCode}
            </span>
            <svg
              className={`w-4 h-4 text-content-tertiary transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Phone number input */}
          <input
            type="tel"
            value={nationalNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`
              flex-1 px-3 py-2.5 bg-transparent outline-none
              text-content-primary placeholder-content-tertiary
              ${disabled ? "cursor-not-allowed" : ""}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? "phone-error" : undefined}
          />
        </div>

        {/* Country dropdown */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-bg-primary border border-border-primary rounded-lg shadow-lg max-h-64 overflow-hidden"
          >
            {/* Search input */}
            <div className="p-2 border-b border-border-primary">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-9 pr-3 py-2 bg-bg-secondary rounded-md text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 text-content-primary placeholder-content-tertiary"
                />
              </div>
            </div>

            {/* Country list */}
            <div className="overflow-y-auto max-h-48">
              {primaryFiltered.length > 0 && (
                <div>
                  {primaryFiltered.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 text-left
                        hover:bg-bg-secondary transition-colors
                        ${
                          country.code === selectedCountry.code
                            ? "bg-brand-primary/10 text-brand-primary"
                            : "text-content-primary"
                        }
                      `}
                    >
                      <span className="text-xl" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <span className="flex-1 text-sm font-medium">
                        {country.name}
                      </span>
                      <span className="text-sm text-content-tertiary">
                        +{country.dialCode}
                      </span>
                    </button>
                  ))}
                  {otherFiltered.length > 0 && (
                    <div className="border-t border-border-primary my-1" />
                  )}
                </div>
              )}

              {otherFiltered.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left
                    hover:bg-bg-secondary transition-colors
                    ${
                      country.code === selectedCountry.code
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "text-content-primary"
                    }
                  `}
                >
                  <span className="text-xl" role="img" aria-label={country.name}>
                    {country.flag}
                  </span>
                  <span className="flex-1 text-sm font-medium">
                    {country.name}
                  </span>
                  <span className="text-sm text-content-tertiary">
                    +{country.dialCode}
                  </span>
                </button>
              ))}

              {filteredCountries.length === 0 && (
                <div className="px-4 py-8 text-center text-content-tertiary text-sm">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p id="phone-error" className="text-sm text-semantic-error flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Validation hint */}
      {!error && value && !isValid && (
        <p className="text-sm text-semantic-warning flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Please enter a valid phone number for {selectedCountry.name}
        </p>
      )}
    </div>
  );
}
