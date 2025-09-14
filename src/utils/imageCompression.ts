import type {
  CompressionMessage,
  ErrorMessage,
  ProgressMessage,
  ResultMessage,
} from "../workers/imageCompressionWorker";
import heic2any from "heic2any";

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

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const SUPPORTED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
];

export const isSupportedImageFormat = (file: File): boolean => {
  const hasValidType = SUPPORTED_FORMATS.includes(file.type.toLowerCase());
  const hasValidExtension = SUPPORTED_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  );

  return hasValidType || hasValidExtension;
};

export const getFileExtensionFromName = (filename: string): string => {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
};

export const validateImageFile = (file: File): void => {
  if (!file) {
    throw new ImageCompressionError("No file provided");
  }

  if (!isSupportedImageFormat(file)) {
    throw new ImageCompressionError(
      `Unsupported file format. Supported formats: JPEG, PNG, WebP, HEIC`,
    );
  }

  if (file.size === 0) {
    throw new ImageCompressionError("File is empty");
  }

  const maxFileSize = 50 * 1024 * 1024;
  if (file.size > maxFileSize) {
    throw new ImageCompressionError(
      `File too large. Maximum size: ${maxFileSize / 1024 / 1024}MB`,
    );
  }
};

const isHEIC = (file: File): boolean => {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
};

const convertHEICToJPEG = async (
  file: File,
  onProgress?: (step: string, progress: number) => void,
): Promise<File> => {
  console.log("Converting HEIC to JPEG...");
  onProgress?.("Converting HEIC format...", 10);

  try {
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const heicBlob = Array.isArray(result) ? result[0] : result;
    return new File([heicBlob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
      type: "image/jpeg",
    });
  } catch (error) {
    throw new ImageCompressionError(`HEIC conversion failed: ${error}`);
  }
};

export const compressImage = async (
  file: File,
  options: CompressionOptions = {},
): Promise<CompressionResult> => {
  const {
    targetSizeBytes = 1024 * 1024,
    maxDimension = 2160,
    onProgress,
  } = options;

  validateImageFile(file);

  const originalSize = file.size;

  console.log(`🖼 Starting image compression:`, {
    filename: file.name,
    originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
    targetSize: `${(targetSizeBytes / 1024 / 1024).toFixed(2)}MB`,
    maxDimension: `${maxDimension}px`,
  });

  // Handle HEIC conversion on main thread before worker processing
  let processedFile = file;
  if (isHEIC(file)) {
    processedFile = await convertHEICToJPEG(file, onProgress);
  }

  if (
    processedFile.size <= targetSizeBytes &&
    processedFile.type === "image/webp"
  ) {
    console.log("✓ File already meets requirements, no compression needed");
    onProgress?.("Complete - no compression needed", 100);

    return {
      compressedFile: processedFile,
      originalSize,
      compressedSize: processedFile.size,
      compressionRatio: originalSize / processedFile.size,
    };
  }

  return new Promise((resolve, reject) => {
    let worker: Worker;

    try {
      worker = new Worker(
        new URL("../workers/imageCompressionWorker.ts", import.meta.url),
        { type: "module" },
      );
    } catch (error) {
      reject(
        new ImageCompressionError(
          "Failed to create compression worker. Your browser may not support this feature.",
          error,
        ),
      );
      return;
    }

    let cleanup = () => {
      worker?.terminate();
    };

    const handleMessage = (
      event: MessageEvent<ProgressMessage | ResultMessage | ErrorMessage>,
    ) => {
      const { type } = event.data;

      switch (type) {
        case "progress": {
          const { step, progress } = event.data;
          console.log(`📊 ${step} (${progress}%)`);
          onProgress?.(step, progress);
          break;
        }

        case "result": {
          const { compressedFile } = event.data;
          const compressedSize = compressedFile.size;
          const compressionRatio = originalSize / compressedSize;

          console.log(`✅ Compression complete:`, {
            originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
            compressedSize: `${(compressedSize / 1024 / 1024).toFixed(2)}MB`,
            compressionRatio: `${compressionRatio.toFixed(2)}x`,
            savedSpace: `${((1 - compressedSize / originalSize) * 100).toFixed(1)}%`,
          });

          cleanup();
          resolve({
            compressedFile,
            originalSize,
            compressedSize,
            compressionRatio,
          });
          break;
        }

        case "error": {
          const { error } = event.data;
          console.error(`❌ Compression failed:`, error);
          cleanup();
          reject(new ImageCompressionError(error));
          break;
        }

        default:
          console.warn("Unknown message type from worker:", event.data);
      }
    };

    const handleError = (error: ErrorEvent) => {
      console.error("❌ Worker error:", error);
      cleanup();
      reject(
        new ImageCompressionError(
          "Image compression worker encountered an error",
          error,
        ),
      );
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);

    const message: CompressionMessage = {
      type: "compress",
      file: processedFile,
      targetSizeBytes,
      maxDimension,
    };

    worker.postMessage(message);

    const timeout = setTimeout(() => {
      cleanup();
      reject(
        new ImageCompressionError("Compression timed out after 60 seconds"),
      );
    }, 60000);

    const originalCleanup = cleanup;
    cleanup = () => {
      clearTimeout(timeout);
      originalCleanup();
    };
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};
