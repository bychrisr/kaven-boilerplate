import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Dense padding
   */
  dense?: boolean;
  /**
   * Disable padding
   */
  disablePadding?: boolean;
  children: React.ReactNode;
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, dense = false, disablePadding = false, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(!disablePadding && 'py-2', className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<ListItemProps>, { dense });
          }
          return child;
        })}
      </ul>
    );
  }
);

List.displayName = 'List';

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * Dense padding
   */
  dense?: boolean;
  /**
   * Disable gutters
   */
  disableGutters?: boolean;
  /**
   * Divider
   */
  divider?: boolean;
  /**
   * Button behavior
   */
  button?: boolean;
  /**
   * Selected state
   */
  selected?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  children: React.ReactNode;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      className,
      dense = false,
      disableGutters = false,
      divider = false,
      button = false,
      selected = false,
      disabled = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Component = button ? 'button' : 'li';

    return (
      <Component
        ref={ref as any}
        className={cn(
          'flex items-center w-full text-left',
          {
            'px-4': !disableGutters,
            'py-2': !dense,
            'py-1': dense,
            'border-b border-divider': divider,
            'cursor-pointer hover:bg-action-hover transition-colors': button && !disabled,
            'bg-action-selected': selected,
            'opacity-50 cursor-not-allowed': disabled,
          },
          className
        )}
        onClick={disabled ? undefined : (onClick as any)}
        disabled={button && disabled ? true : undefined}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

ListItem.displayName = 'ListItem';

export interface ListItemTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Primary text
   */
  primary?: React.ReactNode;
  /**
   * Secondary text
   */
  secondary?: React.ReactNode;
  /**
   * Inset
   */
  inset?: boolean;
}

export const ListItemText = React.forwardRef<HTMLDivElement, ListItemTextProps>(
  ({ className, primary, secondary, inset = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 min-w-0', inset && 'pl-14', className)}
        {...props}
      >
        {primary && (
          <div className="text-sm font-medium text-text-primary truncate">
            {primary}
          </div>
        )}
        {secondary && (
          <div className="text-xs text-text-secondary truncate">
            {secondary}
          </div>
        )}
        {children}
      </div>
    );
  }
);

ListItemText.displayName = 'ListItemText';

export interface ListItemIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ListItemIcon = React.forwardRef<HTMLDivElement, ListItemIconProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center mr-4 text-text-secondary', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ListItemIcon.displayName = 'ListItemIcon';

export interface ListItemAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ListItemAvatar = React.forwardRef<HTMLDivElement, ListItemAvatarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center mr-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ListItemAvatar.displayName = 'ListItemAvatar';
