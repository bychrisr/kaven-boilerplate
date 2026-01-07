import { type ReactNode } from 'react';

interface ComponentPreviewProps {
  children: ReactNode;
  className?: string;
}

/**
 * ComponentPreview - Wrapper to render components with background and padding
 * Used to display components visually in the documentation (Bootstrap style)
 */
export function ComponentPreview({ 
  children, 
  className = '' 
}: ComponentPreviewProps) {
  return (
    <div className={`not-prose my-6 ${className}`}>
      <div className="rounded-lg border bg-background p-8 flex items-center justify-center min-h-[120px]">
        {children}
      </div>
    </div>
  );
}
