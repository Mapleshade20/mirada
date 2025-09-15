import { useCallback, useState } from "react";
import type {
  CompressionOptions,
  CompressionResult,
} from "../utils/imageCompressionTypes";
import { ImageCompressionError } from "../utils/imageCompressionTypes";

export interface CompressionState {
  isCompressing: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
}

export interface UseImageCompressionReturn {
  compressImage: (file: File, options?: CompressionOptions) => Promise<File>;
  state: CompressionState;
  reset: () => void;
}

const initialState: CompressionState = {
  isCompressing: false,
  progress: 0,
  currentStep: "",
  error: null,
};

export const useImageCompression = (): UseImageCompressionReturn => {
  const [state, setState] = useState<CompressionState>(initialState);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const compressImage = useCallback(
    async (file: File, options: CompressionOptions = {}): Promise<File> => {
      if (state.isCompressing) {
        throw new ImageCompressionError("Compression already in progress");
      }

      setState({
        isCompressing: true,
        progress: 0,
        currentStep: "Initializing...",
        error: null,
      });

      try {
        const { compressImage: compress } = await import(
          "../utils/imageCompression"
        );

        const onProgress = (step: string, progress: number) => {
          setState((prev) => ({
            ...prev,
            currentStep: step,
            progress: Math.min(100, Math.max(0, progress)),
          }));
        };

        const result: CompressionResult = await compress(file, {
          ...options,
          onProgress,
        });

        setState({
          isCompressing: false,
          progress: 100,
          currentStep: "Complete!",
          error: null,
        });

        console.log(`Image compression completed:`, {
          originalSize: `${(result.originalSize / 1024 / 1024).toFixed(2)}MB`,
          compressedSize: `${(result.compressedSize / 1024 / 1024).toFixed(2)}MB`,
          compressionRatio: `${result.compressionRatio.toFixed(2)}x`,
        });

        return result.compressedFile;
      } catch (error) {
        const errorMessage =
          error instanceof ImageCompressionError
            ? error.message
            : "An unexpected error occurred during compression";

        setState({
          isCompressing: false,
          progress: 0,
          currentStep: "",
          error: errorMessage,
        });

        console.error("Image compression failed:", error);
        throw error;
      }
    },
    [state.isCompressing],
  );

  return {
    compressImage,
    state,
    reset,
  };
};
