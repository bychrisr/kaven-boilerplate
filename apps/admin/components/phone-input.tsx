'use client';

import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
    <PhoneInputWithCountry
      international
      defaultCountry="BR"
      value={value}
      onChange={(value) => onChange(value || '')}
      placeholder={placeholder}
      id={id}
      className={className}
    />
  );
}
