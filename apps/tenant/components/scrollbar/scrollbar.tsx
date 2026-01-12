'use client';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

interface ScrollbarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scrollbar Component
 * 
 * Wrapper customizado para SimpleBar (mesma biblioteca do Minimals.cc)
 * Fornece scrollbar invisível por padrão que aparece suavemente no hover.
 * 
 * @see /docs/design-system/components.md - Scrollbar
 */
export function Scrollbar({ children, className, style }: ScrollbarProps) {
  return (
    <SimpleBar
      style={{ maxHeight: '100%', ...style }}
      className={className}
      clickOnTrack={false}
    >
      {children}
    </SimpleBar>
  );
}
