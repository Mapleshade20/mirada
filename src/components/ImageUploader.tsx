import { Image as ImageIcon, Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useImageCompression } from "../hooks/useImageCompression";
import { isSupportedImageFormat } from "../utils/imageCompression";
import { Button } from "./ui/glass-button";
import { GlassCard } from "./ui/glass-card";

interface ImageUploaderProps {
  onImageUpload: (filename: string) => void;
  currentImage?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  uploadEndpoint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ],
  uploadEndpoint = "/api/upload/profile-photo",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { compressImage, state: compressionState } = useImageCompression();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate file type with enhanced support
    if (!isSupportedImageFormat(file)) {
      setError("Please select a valid image file (JPEG, PNG, WebP, or HEIC)");
      return;
    }

    // Validate file size (before compression)
    const maxOriginalSize = 50 * 1024 * 1024; // 50MB limit for original files
    if (file.size > maxOriginalSize) {
      setError(
        `Original file size must be less than ${maxOriginalSize / 1024 / 1024}MB`,
      );
      return;
    }

    // Create preview (for supported formats that browser can display)
    if (file.type !== "image/heic" && file.type !== "image/heif") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Compress and upload file
    setIsUploading(true);
    try {
      // Compress image to WebP format, ≤1MB, max 2160px
      const compressedFile = await compressImage(file, {
        targetSizeBytes: 1024 * 1024, // 1MB
        maxDimension: 2160,
      });

      // Create preview from compressed file
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(compressedFile);

      // Upload compressed file
      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      onImageUpload(result.filename);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process and upload image. Please try again.",
      );
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        input.dispatchEvent(new Event("change", { bubbles: true }));
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
                JPEG, PNG, WebP, or HEIC up to 50MB
              </p>
              <p className="text-xs text-muted-foreground">
                Images will be automatically compressed to WebP format (≤1MB)
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
              src={
                preview || (currentImage ? `/api/images/${currentImage}` : "")
              }
              alt="Profile preview"
              className="w-32 h-32 object-cover rounded-lg border border-border/50"
            />
            <button
              type="button"
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
      {(isUploading || compressionState.isCompressing) && (
        <div className="text-sm text-primary text-center space-y-2">
          {compressionState.isCompressing ? (
            <>
              <div>Processing image... ({compressionState.progress}%)</div>
              <div className="text-xs text-muted-foreground">
                {compressionState.currentStep}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${compressionState.progress}%` }}
                />
              </div>
            </>
          ) : (
            <div>Uploading compressed image...</div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || compressionState.isCompressing}
      />
    </div>
  );
};
