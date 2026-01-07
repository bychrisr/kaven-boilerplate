'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SnackbarProps {
  /**
   * Open state
   */
  open: boolean;
  /**
   * Callback when snackbar should close
   */
  onClose: () => void;
  /**
   * Message
   */
  message: React.ReactNode;
  /**
   * Action button
   */
  action?: React.ReactNode;
  /**
   * Auto hide duration (ms)
   * @default 6000
   */
  autoHideDuration?: number | null;
  /**
   * Anchor origin
   */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /**
   * Severity
   */
  severity?: 'success' | 'info' | 'warning' | 'error';
  /**
   * Variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'standard';
}

const severityIcons = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

const severityColors = {
  success: {
    filled: 'bg-success-main text-white',
    outlined: 'border-2 border-success-main text-success-darker bg-transparent',
    standard: 'bg-success-lighter text-success-darker',
  },
  info: {
    filled: 'bg-info-main text-white',
    outlined: 'border-2 border-info-main text-info-darker bg-transparent',
    standard: 'bg-info-lighter text-info-darker',
  },
  warning: {
    filled: 'bg-warning-main text-gray-900',
    outlined: 'border-2 border-warning-main text-warning-darker bg-transparent',
    standard: 'bg-warning-lighter text-warning-darker',
  },
  error: {
    filled: 'bg-error-main text-white',
    outlined: 'border-2 border-error-main text-error-darker bg-transparent',
    standard: 'bg-error-lighter text-error-darker',
  },
};

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  onClose,
  message,
  action,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  severity,
  variant = 'filled',
}) => {
  React.useEffect(() => {
    if (open && autoHideDuration !== null) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  const positionClasses = cn({
    'top-4': anchorOrigin.vertical === 'top',
    'bottom-4': anchorOrigin.vertical === 'bottom',
    'left-4': anchorOrigin.horizontal === 'left',
    'right-4': anchorOrigin.horizontal === 'right',
    'left-1/2 -translate-x-1/2': anchorOrigin.horizontal === 'center',
  });

  const Icon = severity ? severityIcons[severity] : null;
  const colorClasses = severity ? severityColors[severity][variant] : 'bg-gray-800 text-white';

  return (
    <div
      className={cn(
        'fixed z-snackbar flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[600px]',
        'animate-in slide-in-from-bottom-5 fade-in-0',
        positionClasses,
        colorClasses
      )}
      role="alert"
    >
      {Icon && <Icon className="size-5 shrink-0" />}

      <div className="flex-1 text-sm font-medium">{message}</div>

      {action && <div className="shrink-0">{action}</div>}

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X className="size-4" />
      </button>
    </div>
  );
};

Snackbar.displayName = 'Snackbar';

// Hook for easier snackbar management
export function useSnackbar() {
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: React.ReactNode;
    severity?: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
  });

  const showSnackbar = React.useCallback(
    (message: React.ReactNode, severity?: 'success' | 'info' | 'warning' | 'error') => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const hideSnackbar = React.useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
}
