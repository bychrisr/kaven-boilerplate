'use client';

import 'react-international-phone/style.css';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = 'Enter phone number',
  className,
  id,
}: PhoneInputProps) {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry: 'br',
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  return (
    <div className={cn('flex items-stretch h-11 rounded-md border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors', className)}>
      {/* Country Selector */}
      <Select value={country.iso2} onValueChange={(value) => setCountry(value)}>
        <SelectTrigger className="w-[80px] border-0 border-r border-input rounded-none rounded-l-md bg-transparent focus:ring-0 focus:ring-offset-0">
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
        className="flex-1 border-0 rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
      />
    </div>
  );
}
