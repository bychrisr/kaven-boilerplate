'use client';

import { PhoneInput as ReactInternationalPhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

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
  id,
}: PhoneInputProps) {
  return (
    <ReactInternationalPhoneInput
      defaultCountry="br"
      value={value}
      onChange={(phone) => onChange(phone)}
      placeholder={placeholder}
      inputProps={{
        id,
      }}
    />
  );
}
