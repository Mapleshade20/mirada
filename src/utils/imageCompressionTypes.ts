export interface CompressionOptions {
  targetSizeBytes?: number;
  maxDimension?: number;
  onProgress?: (step: string, progress: number) => void;
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export class ImageCompressionError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "ImageCompressionError";
  }
}