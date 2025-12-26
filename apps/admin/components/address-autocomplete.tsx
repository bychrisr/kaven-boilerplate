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
      style.id = 'google-places-custom-styles';
      style.textContent = `
        /* Hide "Powered by Google" logo */
        .pac-container:after {
          background-image: none !important;
          height: 0px !important;
        }
        
        /* Custom styling for dropdown - Dark theme hardcoded */
        .pac-container {
          background-color: #212B36 !important;
          border: 1px solid rgba(145, 158, 171, 0.2) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
          margin-top: 4px !important;
          font-family: inherit !important;
          z-index: 9999 !important;
        }
        
        .pac-item {
          padding: 8px 12px !important;
          border-top: 1px solid rgba(145, 158, 171, 0.2) !important;
          color: #FFFFFF !important;
          cursor: pointer !important;
          font-size: 14px !important;
          background-color: #212B36 !important;
        }
        
        .pac-item:first-child {
          border-top: none !important;
        }
        
        .pac-item:hover {
          background-color: rgba(145, 158, 171, 0.08) !important;
        }
        
        .pac-item-selected {
          background-color: rgba(145, 158, 171, 0.08) !important;
        }
        
        .pac-item-query {
          color: #FFFFFF !important;
          font-weight: 500 !important;
        }
        
        .pac-matched {
          font-weight: 600 !important;
          color: #00AB55 !important;
        }
        
        .pac-icon {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('google-places-custom-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
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
