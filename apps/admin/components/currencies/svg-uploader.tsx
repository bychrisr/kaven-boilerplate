'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SvgUploaderProps {
  value?: string;
  viewBox?: string;
  onChange: (data: { path: string; viewBox: string }) => void;
  className?: string;
}

export function SvgUploader({ value, viewBox: initialViewBox, onChange, className }: SvgUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState<string>(initialViewBox || '0 0 24 24');

  const extractSvgPath = (svgContent: string): { path: string; viewBox: string } | null => {
    try {
      // Parse SVG content
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      
      // Check for parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG file');
      }

      // Get SVG element to extract viewBox
      const svgElement = doc.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found');
      }

      // Extract viewBox (with fallback)
      const viewBox = svgElement.getAttribute('viewBox') || '0 0 24 24';

      // Find all <path> elements
      const paths = doc.querySelectorAll('path');
      
      if (paths.length === 0) {
        throw new Error('No <path> elements found in SVG');
      }

      // If multiple paths, combine them
      let pathData: string;
      if (paths.length === 1) {
        const d = paths[0].getAttribute('d');
        if (!d) throw new Error('Path element has no "d" attribute');
        pathData = d;
      } else {
        // Multiple paths: combine them
        const combinedPaths = Array.from(paths)
          .map(path => path.getAttribute('d'))
          .filter(Boolean)
          .join(' ');

        if (!combinedPaths) {
          throw new Error('No valid path data found');
        }
        pathData = combinedPaths;
      }

      return { path: pathData, viewBox };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to parse SVG');
    }
  };

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.includes('svg')) {
      setError('Please upload an SVG file');
      return;
    }

    // Validate file size (max 100KB)
    if (file.size > 100 * 1024) {
      setError('SVG file is too large (max 100KB)');
      return;
    }

    try {
      const content = await file.text();
      const result = extractSvgPath(content);
      
      if (result) {
        onChange(result); // Passa objeto completo
        setViewBox(result.viewBox);
        setFileName(file.name);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process SVG');
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleClear = () => {
    onChange({ path: '', viewBox: '0 0 24 24' });
    setFileName(null);
    setError(null);
    setViewBox('0 0 24 24');
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border',
          error ? 'border-destructive' : ''
        )}
      >
        <input
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          {value ? (
            <>
              <Check className="h-8 w-8 text-green-600" />
              <p className="text-sm font-medium">SVG path extracted successfully!</p>
              {fileName && (
                <p className="text-xs text-muted-foreground">{fileName}</p>
              )}
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drop SVG file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: 100KB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Preview</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
            {/* Icon Preview */}
            <div className="flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox={viewBox}
                fill="currentColor"
                className="text-foreground"
              >
                <path d={value} />
              </svg>
              <span className="text-sm text-muted-foreground">32px</span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox={viewBox}
                fill="currentColor"
                className="text-foreground"
              >
                <path d={value} />
              </svg>
              <span className="text-sm text-muted-foreground">24px</span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox={viewBox}
                fill="currentColor"
                className="text-foreground"
              >
                <path d={value} />
              </svg>
              <span className="text-sm text-muted-foreground">16px</span>
            </div>
          </div>

          {/* Path Data (collapsed by default) */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View extracted path data
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
              {value}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
