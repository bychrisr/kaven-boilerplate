'use client';

import 'react-international-phone/style.css';
import { useState } from 'react';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { cn } from '@/lib/utils';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string): boolean => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch {
    return false;
  }
};

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  error?: string;
  onValidationChange?: (isValid: boolean) => void;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = 'Enter phone number',
  className,
  id,
  error,
  onValidationChange,
}: PhoneInputProps) {
  const [touched, setTouched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry: 'br',
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone);
      // Validate and notify parent
      if (onValidationChange) {
        const isValid = data.phone ? isPhoneValid(data.phone) : true; // Empty is valid
        onValidationChange(isValid);
      }
    },
  });

  const isValid = value ? isPhoneValid(value) : true;
  const showError = touched && value && !isValid;

  // Filter countries based on search
  const filteredCountries = defaultCountries.filter((c) => {
    const countryData = parseCountry(c);
    const query = searchQuery.toLowerCase();
    return (
      countryData.name.toLowerCase().includes(query) ||
      countryData.iso2.toLowerCase().includes(query) ||
      countryData.dialCode.includes(query)
    );
  });

  return (
    <div className="w-full">
      {/* Wrapper with unified border and focus ring */}
      <div
        className={cn(
          'flex items-stretch h-11 rounded-md border bg-transparent transition-colors',
          // Border color based on state
          showError || error 
            ? 'border-destructive' 
            : isFocused 
              ? 'border-primary' 
              : 'border-input',
          // Focus ring (same as Input component)
          isFocused && 'ring-2 ring-ring/20',
          className
        )}
      >
        {/* Country Selector - No border, transparent background */}
        <Select 
          value={country.iso2} 
          onValueChange={(value) => {
            setCountry(value);
            setSearchQuery(''); // Reset search on select
          }}
        >
          <SelectTrigger 
            className="w-[70px] h-full border-0 border-r border-input rounded-none rounded-l-md bg-transparent px-2 focus:ring-0 focus:ring-offset-0"
          >
            <SelectValue>
              <FlagImage iso2={country.iso2} style={{ display: 'flex', width: '24px', height: '16px' }} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {/* Search Input */}
            <div className="sticky top-0 z-10 bg-popover p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 bg-transparent"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-[240px] overflow-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => {
                  const countryData = parseCountry(c);
                  return (
                    <SelectItem 
                      key={countryData.iso2} 
                      value={countryData.iso2}
                      className="py-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Flag */}
                        <FlagImage 
                          iso2={countryData.iso2} 
                          style={{ width: '24px', height: '16px', marginTop: '2px' }} 
                        />
                        
                        {/* Country Info - 2 lines */}
                        <div className="flex-1 min-w-0">
                          {/* Line 1: Country Name */}
                          <div className="text-sm font-medium text-foreground truncate">
                            {countryData.name}
                          </div>
                          {/* Line 2: ISO + Dial Code */}
                          <div className="text-xs text-muted-foreground">
                            {countryData.iso2.toUpperCase()} (+{countryData.dialCode})
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No countries found
                </div>
              )}
            </div>
          </SelectContent>
        </Select>

        {/* Phone Number Input - No border, transparent background */}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handlePhoneValueChange}
          onBlur={() => {
            setTouched(true);
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          type="tel"
          placeholder={placeholder}
          id={id}
          className={cn(
            'flex-1 h-full border-0 rounded-none rounded-r-md bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
            (showError || error) && 'text-destructive placeholder:text-destructive/50'
          )}
        />
      </div>

      {/* Error Message - Only show after touched */}
      {(showError || error) && (
        <p className="mt-1 text-sm text-destructive">
          {error || 'Invalid phone number'}
        </p>
      )}
    </div>
  );
}
