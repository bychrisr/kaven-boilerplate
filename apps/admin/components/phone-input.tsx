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
    <PhoneInputWithCountry
      international
      defaultCountry="BR"
      value={value}
      onChange={(value) => onChange(value || '')}
      placeholder={placeholder}
      id={id}
      className={cn(
        'phone-input-container',
        className
      )}
      numberInputProps={{
        className: cn(
          'flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors'
        ),
      }}
      countrySelectProps={{
        className: cn(
          'border-r border-input pr-2 mr-2',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'bg-transparent'
        ),
      }}
    />
  );
}
