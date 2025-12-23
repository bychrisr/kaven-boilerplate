import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image source
   */
  src?: string;
  /**
   * Alt text for image
   */
  alt?: string;
  /**
   * Size
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Shape
   * @default 'circular'
   */
  variant?: 'circular' | 'rounded' | 'square';
  /**
   * Children (for letter avatar)
   */
  children?: React.ReactNode;
}

const sizeClasses = {
  xs: 'size-6 text-xs',
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
  xl: 'size-14 text-xl',
  '2xl': 'size-16 text-2xl',
};

const variantClasses = {
  circular: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-none',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', variant = 'circular', children, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden bg-gray-200 font-semibold text-gray-600',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <Image
            src={src}
            alt={alt || ''}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          children
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum avatars to show
   */
  max?: number;
  /**
   * Spacing between avatars
   * @default 'md'
   */
  spacing?: 'sm' | 'md' | 'lg';
  /**
   * Size of avatars
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

const spacingClasses = {
  sm: '-space-x-2',
  md: '-space-x-3',
  lg: '-space-x-4',
};

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, spacing = 'md', size = 'md', children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const displayedChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const surplus = max && childrenArray.length > max ? childrenArray.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingClasses[spacing], className)}
        {...props}
      >
        {displayedChildren.map((child, index) => (
          <div key={index} className="ring-2 ring-white dark:ring-gray-900">
            {React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
              : child}
          </div>
        ))}
        {surplus > 0 && (
          <Avatar size={size} className="ring-2 ring-white dark:ring-gray-900">
            +{surplus}
          </Avatar>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
