import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { apiService } from "../lib/api";

interface AuthenticatedImageProps {
  src: string | null;
  alt?: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  size?: number | "small" | "default" | "large";
  useAvatar?: boolean;
}

interface AuthenticatedImageState {
  imageUrl: string | null;
  loading: boolean;
  error: boolean;
  showPreview: boolean;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  src,
  alt = "Profile photo",
  className = "",
  fallbackIcon = <UserOutlined />,
  size = 80,
  useAvatar = true,
}) => {
  const [state, setState] = useState<AuthenticatedImageState>({
    imageUrl: null,
    loading: true,
    error: false,
    showPreview: false,
  });

  useEffect(() => {
    if (!src) {
      setState((prev) => {
        // Clean up previous image URL
        if (prev.imageUrl) {
          URL.revokeObjectURL(prev.imageUrl);
        }
        return {
          imageUrl: null,
          loading: false,
          error: false,
          showPreview: false,
        };
      });
      return;
    }

    const fetchImage = async () => {
      try {
        setState((prev) => {
          // Clean up previous image URL when starting new fetch
          if (prev.imageUrl) {
            URL.revokeObjectURL(prev.imageUrl);
          }
          return { ...prev, loading: true, error: false, imageUrl: null };
        });

        // Get the base URL and construct full URL
        const baseURL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8090";
        const fullUrl = src.startsWith("http") ? src : `${baseURL}${src}`;

        // Get access token from localStorage (apiService handles token management)
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error("No access token available");
        }

        const response = await fetch(fullUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token might be expired, let's try to refresh and retry once
            try {
              // This will trigger token refresh if needed
              await apiService.getProfile();
              const newToken = localStorage.getItem("access_token");

              if (newToken && newToken !== accessToken) {
                const retryResponse = await fetch(fullUrl, {
                  headers: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });

                if (retryResponse.ok) {
                  const blob = await retryResponse.blob();
                  const imageUrl = URL.createObjectURL(blob);
                  setState((prev) => ({
                    ...prev,
                    imageUrl,
                    loading: false,
                    error: false,
                  }));
                  return;
                }
              }
            } catch (refreshError) {
              console.error("Failed to refresh token for image:", refreshError);
            }
          }
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setState((prev) => ({
          ...prev,
          imageUrl,
          loading: false,
          error: false,
        }));
      } catch (error) {
        console.error("Error fetching authenticated image:", error);
        setState((prev) => ({
          ...prev,
          imageUrl: null,
          loading: false,
          error: true,
        }));
      }
    };

    fetchImage();
  }, [src]);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (state.imageUrl) {
        URL.revokeObjectURL(state.imageUrl);
      }
    };
  }, [state.imageUrl]);

  const handleImageClick = () => {
    if (state.imageUrl && !state.loading && !state.error) {
      setState((prev) => ({ ...prev, showPreview: true }));
    }
  };

  const handlePreviewClose = useCallback(() => {
    setState((prev) => ({ ...prev, showPreview: false }));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageClick();
    }
  };

  const handlePreviewKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePreviewClose();
    }
  };

  // Handle escape key to close preview
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.showPreview) {
        handlePreviewClose();
      }
    };

    if (state.showPreview) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when preview is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [state.showPreview, handlePreviewClose]);

  if (useAvatar) {
    if (state.loading) {
      return (
        <Avatar
          size={size}
          icon={fallbackIcon}
          className={`opacity-50 ${className}`}
        />
      );
    }

    if (state.error || !state.imageUrl) {
      return <Avatar size={size} icon={fallbackIcon} className={className} />;
    }

    return (
      <>
        <button
          type="button"
          tabIndex={0}
          className={`cursor-pointer ${className}`}
          onClick={handleImageClick}
          onKeyDown={handleKeyDown}
          aria-label={`Preview ${alt}`}
        >
          <Avatar size={size} src={state.imageUrl} alt={alt} />
        </button>
        {state.showPreview && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={handlePreviewClose}
            onKeyDown={handlePreviewKeyDown}
            tabIndex={-1}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] p-4">
              <img
                src={state.imageUrl}
                alt={alt}
                className="max-w-full max-h-full max-w-4xl object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Non-avatar mode for custom styling
  if (state.loading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
      >
        <div className="text-gray-400 text-2xl">{fallbackIcon}</div>
      </div>
    );
  }

  if (state.error || !state.imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
      >
        <div className="text-gray-400 text-2xl">{fallbackIcon}</div>
      </div>
    );
  }

  return (
    <>
      <button
        className={`cursor-pointer ${className}`}
        onClick={handleImageClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        type="button"
        aria-label={`Preview ${alt}`}
      >
        <img
          src={state.imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </button>
      {state.showPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={handlePreviewClose}
          onKeyDown={handlePreviewKeyDown}
          tabIndex={-1}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] p-4">
            <img
              src={state.imageUrl}
              alt={alt}
              className="max-h-xl max-w-xl object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AuthenticatedImage;
