'use client';

import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
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
  return (
    <div className={cn('phone-input-wrapper', className)}>
      <PhoneInputWithCountry
        international
        defaultCountry="BR"
        value={value}
        onChange={(value) => onChange(value || '')}
        placeholder={placeholder}
        id={id}
        className="phone-input-container"
        numberInputProps={{
          className: 'phone-number-input',
        }}
        countrySelectProps={{
          className: 'phone-country-select',
        }}
      />
    </div>
  );
}
