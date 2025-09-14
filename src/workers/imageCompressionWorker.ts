// Dynamic imports for Web Worker compatibility

export interface CompressionMessage {
  type: "compress";
  file: File;
  targetSizeBytes: number;
  maxDimension: number;
}

export interface ProgressMessage {
  type: "progress";
  step: string;
  progress: number;
}

export interface ResultMessage {
  type: "result";
  compressedFile: File;
}

export interface ErrorMessage {
  type: "error";
  error: string;
}

type WorkerMessage = CompressionMessage;

const postProgress = (step: string, progress: number) => {
  self.postMessage({ type: "progress", step, progress } as ProgressMessage);
};

const postError = (error: string) => {
  console.error("Image compression error:", error);
  self.postMessage({ type: "error", error } as ErrorMessage);
};

const postResult = (compressedFile: File) => {
  self.postMessage({ type: "result", compressedFile } as ResultMessage);
};

const decodeImage = async (file: File): Promise<ImageData> => {
  console.log(`Decoding ${file.type || "unknown"} image...`);
  postProgress("Decoding image...", 20);

  const arrayBuffer = await file.arrayBuffer();

  try {
    if (
      file.type === "image/jpeg" ||
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".jpeg")
    ) {
      const { decode } = await import("@jsquash/jpeg");
      return await decode(arrayBuffer);
    }
    if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      const { decode } = await import("@jsquash/png");
      return await decode(arrayBuffer);
    }
    if (
      file.type === "image/webp" ||
      file.name.toLowerCase().endsWith(".webp")
    ) {
      const { decode } = await import("@jsquash/webp");
      return await decode(arrayBuffer);
    }

    throw new Error(`Unsupported image format: ${file.type}`);
  } catch (error) {
    throw new Error(`Image decoding failed: ${error}`);
  }
};

const resizeImageData = (
  imageData: ImageData,
  newWidth: number,
  newHeight: number,
): ImageData => {
  console.log(
    `Resizing from ${imageData.width}x${imageData.height} to ${newWidth}x${newHeight}`,
  );

  const canvas = new OffscreenCanvas(newWidth, newHeight);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  const tempCanvas = new OffscreenCanvas(imageData.width, imageData.height);
  const tempCtx = tempCanvas.getContext("2d");

  if (!tempCtx) {
    throw new Error("Failed to get temporary canvas context");
  }

  tempCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);

  return ctx.getImageData(0, 0, newWidth, newHeight);
};

const calculateNewDimensions = (
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } => {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > height) {
    return {
      width: maxDimension,
      height: Math.round(maxDimension / aspectRatio),
    };
  } else {
    return {
      width: Math.round(maxDimension * aspectRatio),
      height: maxDimension,
    };
  }
};

const compressToWebP = async (
  imageData: ImageData,
  targetSizeBytes: number,
): Promise<ArrayBuffer> => {
  console.log("Starting WebP compression...");

  let quality = 90;
  let attempt = 0;
  const maxQualityAttempts = 8;

  while (attempt < maxQualityAttempts) {
    console.log(`Compression attempt ${attempt + 1}: quality ${quality}`);
    postProgress(`Compressing (quality: ${quality}%)...`, 60 + attempt * 5);

    try {
      const { encode } = await import("@jsquash/webp");
      const compressed = await encode(imageData, { quality });

      console.log(
        `Compressed size: ${compressed.byteLength} bytes (target: ${targetSizeBytes})`,
      );

      if (compressed.byteLength <= targetSizeBytes) {
        console.log("✓ Compression successful within target size");
        return compressed;
      }

      quality -= 10;

      attempt++;
    } catch (error) {
      throw new Error(`WebP encoding failed: ${error}`);
    }
  }
};

const compressImage = async (
  file: File,
  targetSizeBytes: number,
  maxDimension: number,
): Promise<File> => {
  try {
    // HEIC conversion is now handled on the main thread before the worker
    let imageData = await decodeImage(file);

    const { width: targetWidth, height: targetHeight } = calculateNewDimensions(
      imageData.width,
      imageData.height,
      maxDimension,
    );

    if (targetWidth !== imageData.width || targetHeight !== imageData.height) {
      console.log(`Resizing to fit max dimension: ${maxDimension}px`);
      postProgress("Resizing image...", 35);
      imageData = resizeImageData(imageData, targetWidth, targetHeight);
    }

    const compressedBuffer = await compressToWebP(imageData, targetSizeBytes);

    postProgress("Finalizing...", 95);

    const compressedBlob = new Blob([compressedBuffer], { type: "image/webp" });
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^.]*$/, ".webp"),
      {
        type: "image/webp",
      },
    );

    console.log(`✓ Final compressed file: ${compressedFile.size} bytes`);

    return compressedFile;
  } catch (error) {
    throw new Error(`Compression failed: ${error}`);
  }
};

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, file, targetSizeBytes, maxDimension } = event.data;

  if (type !== "compress") {
    postError("Invalid message type");
    return;
  }

  try {
    console.log(
      `Starting compression: ${file.name} (${file.size} bytes) -> target: ${targetSizeBytes} bytes`,
    );
    postProgress("Starting compression...", 0);

    const compressedFile = await compressImage(
      file,
      targetSizeBytes,
      maxDimension,
    );

    postProgress("Complete!", 100);
    postResult(compressedFile);
  } catch (error) {
    postError(error instanceof Error ? error.message : String(error));
  }
};

export default self;
