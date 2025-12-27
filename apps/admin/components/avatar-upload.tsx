'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { Upload, X, Check } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  value?: string;
  onChange: (file: File | null, preview: string) => void;
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 3145728, // 3MB
    multiple: false,
  });

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx || !croppedAreaPixels) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
          const preview = canvas.toDataURL('image/jpeg');
          onChange(file, preview);
          setCropDialogOpen(false);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleRemove = () => {
    onChange(null, '');
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div 
          {...getRootProps()}
          className="relative cursor-pointer group"
        >
          <input {...getInputProps()} />
          
          {/* Círculo principal com borda tracejada */}
          <div className={cn(
            "relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-200",
            "border-2 border-dashed",
            isDragActive 
              ? "border-primary bg-primary/10" 
              : "border-border/40 hover:border-primary/50 hover:bg-muted/50"
          )}>
            {value ? (
              <>
                {/* Avatar com imagem */}
                <Avatar className="w-full h-full">
                  <AvatarImage src={value} alt="Avatar preview" className="object-cover" />
                </Avatar>
                
                {/* Overlay no hover quando tem imagem */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-8 w-8 text-white mb-1" />
                  <span className="text-xs text-white font-medium">Update photo</span>
                </div>
              </>
            ) : (
              <>
                {/* Estado vazio - ícone de câmera */}
                <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Upload photo</span>
                </div>
              </>
            )}
          </div>
          
          {/* Botão de remover quando tem imagem */}
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-md z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Texto de ajuda */}
        <p className="text-xs text-center text-muted-foreground">
          Allowed *.jpeg, *.jpg, *.png, *.gif
          <br />
          max size of 3 MB
        </p>
      </div>

      {/* Crop Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-[400px] w-full bg-muted/30 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createCroppedImage}>
              <Check className="mr-2 h-4 w-4" />
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
