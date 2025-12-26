'use client';

import 'react-international-phone/style.css';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
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
  const showError = value && !isValid;

  return (
    <div className="w-full">
      <div
        className={cn(
          'flex items-stretch h-11 rounded-md border bg-transparent transition-colors',
          showError || error ? 'border-destructive' : 'border-input',
          'focus-within:ring-2 focus-within:ring-offset-2',
          showError || error ? 'focus-within:ring-destructive' : 'focus-within:ring-ring',
          className
        )}
      >
        {/* Country Selector - Reduced width */}
        <Select value={country.iso2} onValueChange={(value) => setCountry(value)}>
          <SelectTrigger className="w-[70px] border-0 border-r border-input rounded-none rounded-l-md bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
            <SelectValue>
              <FlagImage iso2={country.iso2} style={{ display: 'flex', width: '24px', height: '16px' }} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {defaultCountries.map((c) => {
              const countryData = parseCountry(c);
              return (
                <SelectItem key={countryData.iso2} value={countryData.iso2}>
                  <div className="flex items-center gap-2">
                    <FlagImage iso2={countryData.iso2} style={{ width: '24px', height: '16px' }} />
                    <span className="flex-1">{countryData.name}</span>
                    <span className="text-muted-foreground text-sm">+{countryData.dialCode}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handlePhoneValueChange}
          type="tel"
          placeholder={placeholder}
          id={id}
          className={cn(
            'flex-1 border-0 rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent',
            (showError || error) && 'text-destructive placeholder:text-destructive/50'
          )}
        />
      </div>

      {/* Error Message */}
      {(showError || error) && (
        <p className="mt-1 text-sm text-destructive">
          {error || 'Invalid phone number'}
        </p>
      )}
    </div>
  );
}
