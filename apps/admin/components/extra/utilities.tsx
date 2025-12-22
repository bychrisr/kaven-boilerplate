import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// CopyToClipboard Component
export interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, children }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded hover:bg-action-hover transition-colors"
      title="Copiar para área de transferência"
    >
      {children || text}
      {copied ? (
        <Check className="size-4 text-success-main" />
      ) : (
        <Copy className="size-4 text-text-secondary" />
      )}
    </button>
  );
};

// TextMaxLine Component
export interface TextMaxLineProps extends React.HTMLAttributes<HTMLDivElement> {
  line?: number;
  children: React.ReactNode;
}

export const TextMaxLine: React.FC<TextMaxLineProps> = ({
  className,
  line = 2,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: line,
        WebkitBoxOrient: 'vertical',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// SvgColor Component
export interface SvgColorProps extends React.SVGProps<SVGSVGElement> {
  src: string;
  color?: string;
}

export const SvgColor: React.FC<SvgColorProps> = ({ src, color, className, ...props }) => {
  return (
    <svg
      className={cn('inline-block', className)}
      style={{ color }}
      {...props}
    >
      <use href={src} />
    </svg>
  );
};

// Iconify Wrapper (placeholder)
export interface IconifyProps {
  icon: string;
  width?: number;
  height?: number;
  color?: string;
}

export const Iconify: React.FC<IconifyProps> = ({
  icon,
  width = 24,
  height = 24,
  color,
}) => {
  return (
    <span
      className="inline-flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        color,
      }}
      title={icon}
    >
      {/* Placeholder - integrate with @iconify/react for real icons */}
      <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" opacity="0.2" />
        <path d="M12 2L15 9L22 10L17 15L18 22L12 18L6 22L7 15L2 10L9 9Z" />
      </svg>
    </span>
  );
};

CopyToClipboard.displayName = 'CopyToClipboard';
TextMaxLine.displayName = 'TextMaxLine';
SvgColor.displayName = 'SvgColor';
Iconify.displayName = 'Iconify';
