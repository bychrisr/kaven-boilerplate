'use client';

import { useRef, useEffect } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';

const libraries: ('places')[] = ['places'];

interface PlaceData {
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (data: PlaceData) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = 'Enter address',
  className,
  id,
}: AddressAutocompleteProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Inject custom CSS to hide "Powered by Google" footer
  useEffect(() => {
    if (isLoaded) {
      const style = document.createElement('style');
      style.textContent = `
        /* Hide "Powered by Google" logo */
        .pac-container:after {
          background-image: none !important;
          height: 0px;
        }
        
        /* Custom styling for dropdown */
        .pac-container {
          background-color: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          margin-top: 4px;
          font-family: inherit;
        }
        
        .pac-item {
          padding: 8px 12px;
          border-top: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          cursor: pointer;
          font-size: 14px;
        }
        
        .pac-item:first-child {
          border-top: none;
        }
        
        .pac-item:hover {
          background-color: hsl(var(--accent));
        }
        
        .pac-item-selected {
          background-color: hsl(var(--accent));
        }
        
        .pac-item-query {
          color: hsl(var(--foreground));
          font-weight: 500;
        }
        
        .pac-matched {
          font-weight: 600;
          color: hsl(var(--primary));
        }
        
        .pac-icon {
          display: none;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isLoaded]);

  const extractPlaceData = (place: google.maps.places.PlaceResult): PlaceData => {
    const components = place.address_components || [];
    
    const getComponent = (type: string): string => {
      const component = components.find((c) => c.types.includes(type));
      return component?.long_name || '';
    };

    // Extract city - try multiple types
    const city = 
      getComponent('locality') || 
      getComponent('administrative_area_level_2') ||
      getComponent('sublocality') ||
      '';

    const state = 
      getComponent('administrative_area_level_1') || '';

    const country = getComponent('country') || '';
    
    const zipcode = getComponent('postal_code') || '';

    return {
      address: place.formatted_address || '',
      city,
      state,
      country,
      zipcode,
    };
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.formatted_address) {
        onChange(place.formatted_address);
        
        if (onPlaceSelected) {
          const placeData = extractPlaceData(place);
          onPlaceSelected(placeData);
        }
      }
    }
  };

  if (loadError) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        id={id}
      />
    );
  }

  if (!isLoaded) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Loading..."
        disabled
        className={className}
        id={id}
      />
    );
  }

  return (
    <Autocomplete
      onLoad={(autocomplete) => {
        autocompleteRef.current = autocomplete;
      }}
      onPlaceChanged={handlePlaceChanged}
      options={{
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry'],
      }}
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        id={id}
      />
    </Autocomplete>
  );
}
