import React, { useRef, useState } from 'react';
import { Button } from './ui/glass-button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { GlassCard } from './ui/glass-card';

interface ImageUploaderProps {
  onImageUpload: (filename: string) => void;
  currentImage?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      // TODO: Replace with actual API call to your Rust backend
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock upload - replace with actual API call
      const response = await fetch('/api/upload/profile-photo', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      onImageUpload(result.filename);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Simulate file input change
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!preview && !currentImage && (
        <GlassCard
          className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer p-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                JPEG, PNG or WebP up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Preview */}
      {(preview || currentImage) && (
        <GlassCard className="p-4">
          <div className="relative inline-block">
            <img
              src={preview || (currentImage ? `/api/images/${currentImage}` : '')}
              alt="Profile preview"
              className="w-32 h-32 object-cover rounded-lg border border-border/50"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
            >
              <X className="h-4 w-4 text-destructive-foreground" />
            </button>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="glass"
              size="sm"
              disabled={isUploading}
            >
              <ImageIcon className="h-4 w-4" />
              Change Photo
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="text-sm text-primary text-center">
          Uploading image...
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};