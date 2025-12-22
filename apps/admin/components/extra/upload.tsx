import * as React from 'react';
import { Upload as UploadIcon, X, File, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface UploadProps {
  /**
   * Accepted file types
   */
  accept?: string;
  /**
   * Multiple files
   */
  multiple?: boolean;
  /**
   * Max file size (bytes)
   */
  maxSize?: number;
  /**
   * Max files
   */
  maxFiles?: number;
  /**
   * Files
   */
  files?: UploadFile[];
  /**
   * Callback when files change
   */
  onChange?: (files: UploadFile[]) => void;
  /**
   * Callback when file is uploaded
   */
  onUpload?: (file: File) => Promise<void>;
  /**
   * Disabled
   */
  disabled?: boolean;
  /**
   * Show preview
   */
  showPreview?: boolean;
}

export const Upload: React.FC<UploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  files: controlledFiles = [],
  onChange,
  onUpload,
  disabled = false,
  showPreview = true,
}) => {
  const [files, setFiles] = React.useState<UploadFile[]>(controlledFiles);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const currentFiles = controlledFiles.length > 0 ? controlledFiles : files;

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: UploadFile[] = [];

    for (const file of fileArray) {
      // Check max files
      if (currentFiles.length + validFiles.length >= maxFiles) {
        break;
      }

      // Check file size
      if (file.size > maxSize) {
        continue;
      }

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      const uploadFile: UploadFile = {
        id: `${Date.now()}-${file.name}`,
        file,
        preview,
        progress: 0,
      };

      validFiles.push(uploadFile);

      // Upload file if callback provided
      if (onUpload) {
        try {
          await onUpload(file);
          uploadFile.progress = 100;
        } catch (error) {
          uploadFile.error = error instanceof Error ? error.message : 'Erro ao fazer upload';
        }
      }
    }

    const newFileList = [...currentFiles, ...validFiles];
    setFiles(newFileList);
    onChange?.(newFileList);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleRemove = (id: string) => {
    const newFiles = currentFiles.filter(f => f.id !== id);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="size-8" />;
    if (file.type.startsWith('text/')) return <FileText className="size-8" />;
    return <File className="size-8" />;
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging && 'border-primary-main bg-primary-main/5',
          !isDragging && 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <UploadIcon className="size-12 mx-auto mb-4 text-text-secondary" />
        <p className="text-sm font-medium mb-1">
          Clique para fazer upload ou arraste arquivos aqui
        </p>
        <p className="text-xs text-text-secondary">
          {accept && `Tipos aceitos: ${accept}`}
          {maxSize && ` • Tamanho máximo: ${formatFileSize(maxSize)}`}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* File list */}
      {showPreview && currentFiles.length > 0 && (
        <div className="space-y-2">
          {currentFiles.map((uploadFile) => (
            <div
              key={uploadFile.id}
              className="flex items-center gap-3 p-3 border border-divider rounded-lg"
            >
              {/* Preview or icon */}
              {uploadFile.preview ? (
                <img
                  src={uploadFile.preview}
                  alt={uploadFile.file.name}
                  className="size-12 object-cover rounded"
                />
              ) : (
                <div className="size-12 flex items-center justify-center bg-background-default rounded">
                  {getFileIcon(uploadFile.file)}
                </div>
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                <p className="text-xs text-text-secondary">
                  {formatFileSize(uploadFile.file.size)}
                </p>
                {uploadFile.error && (
                  <p className="text-xs text-error-main">{uploadFile.error}</p>
                )}
                {uploadFile.progress !== undefined && uploadFile.progress < 100 && (
                  <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-main transition-all"
                      style={{ width: `${uploadFile.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(uploadFile.id)}
                className="p-1 hover:bg-action-hover rounded transition-colors"
                aria-label="Remover arquivo"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Upload.displayName = 'Upload';
