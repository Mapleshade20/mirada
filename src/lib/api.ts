import axios, { type AxiosError, type AxiosInstance } from "axios";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Helper function to check if error is an AxiosError
const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

interface UserProfile {
  email: string;
  status:
    | "unverified"
    | "verification_pending"
    | "verified"
    | "form_completed"
    | "matched"
    | "confirmed";
  grade?: string;
  final_match?: {
    email_domain: string;
    grade: string;
    familiar_tags: string[];
    aspirational_tags: string[];
    self_intro: string;
    photo_url: string | null;
    wechat_id: string | null;
  } | null;
}

interface FormData {
  wechat_id: string;
  gender: "male" | "female";
  familiar_tags: string[];
  aspirational_tags: string[];
  recent_topics: string;
  self_traits: string[];
  ideal_traits: string[];
  physical_boundary: number;
  self_intro: string;
  profile_photo_filename?: string;
}

interface UploadResponse {
  filename: string;
}

interface VetoPreview {
  candidate_id: string;
  familiar_tags: string[];
  aspirational_tags: string[];
  recent_topics: string;
  email_domain: string;
  grade: string;
}

class ApiService {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<void> | null = null;
  private retryAttempts: Map<string, number> = new Map();

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8090",
      timeout: 10000,
    });

    // Load tokens from localStorage
    this.loadTokensFromStorage();

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        await this.ensureValidToken();
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            if (this.refreshPromise) {
              await this.refreshPromise;
            } else {
              this.refreshPromise = this.refreshAccessToken();
              await this.refreshPromise;
              this.refreshPromise = null;
            }
            // Retry the original request
            return this.api.request(error.config);
          } catch (refreshError) {
            this.clearTokens();
            throw refreshError;
          }
        }

        // For network errors and other non-401 errors, don't clear tokens
        // Let the calling code handle the error appropriately
        throw error;
      },
    );
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
    const expiry = localStorage.getItem("token_expiry");
    this.tokenExpiry = expiry ? parseInt(expiry, 10) : null;
  }

  private saveTokensToStorage(tokens: TokenResponse): void {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    this.tokenExpiry = Date.now() + tokens.expires_in * 1000;

    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    localStorage.setItem("token_expiry", this.tokenExpiry.toString());
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry) return;

    // Refresh token if it expires in the next 5 minutes
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    if (this.tokenExpiry <= fiveMinutesFromNow && this.refreshToken) {
      if (this.refreshPromise) {
        await this.refreshPromise;
      } else {
        this.refreshPromise = this.refreshAccessToken();
        await this.refreshPromise;
        this.refreshPromise = null;
      }
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8090"}/api/auth/refresh`,
      {
        refresh_token: this.refreshToken,
      },
    );

    this.saveTokensToStorage(response.data);
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    endpoint: string,
    maxRetries: number = 4,
    baseDelay: number = 3000,
  ): Promise<T> {
    const retryKey = endpoint;
    let attempts = this.retryAttempts.get(retryKey) || 0;

    try {
      const result = await requestFn();
      // Reset retry count on success
      this.retryAttempts.delete(retryKey);
      return result;
    } catch (error: unknown) {
      // Only retry for network errors or 5xx server errors
      const isRetryableError =
        !isAxiosError(error) ||
        !error.response ||
        (error.response.status >= 500 && error.response.status < 600) ||
        error.code === "NETWORK_ERROR" ||
        error.code === "ECONNREFUSED";

      if (!isRetryableError || attempts >= maxRetries) {
        this.retryAttempts.delete(retryKey);
        throw error;
      }

      attempts++;
      this.retryAttempts.set(retryKey, attempts);

      // Exponential backoff with jitter
      const delay = baseDelay * 1.5 ** (attempts - 1) + Math.random() * 1000;

      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.retryRequest(requestFn, endpoint, maxRetries, baseDelay);
    }
  }

  // Auth methods
  async sendVerificationCode(email: string): Promise<void> {
    await this.api.post("/api/auth/send-code", { email });
  }

  async verifyCode(email: string, code: string): Promise<TokenResponse> {
    const response = await this.api.post<TokenResponse>(
      "/api/auth/verify-code",
      {
        email,
        code,
      },
    );

    this.saveTokensToStorage(response.data);
    return response.data;
  }

  // Profile methods
  async getProfile(): Promise<UserProfile> {
    return this.retryRequest(async () => {
      const response = await this.api.get<UserProfile>("/api/profile");
      return response.data;
    }, "/api/profile");
  }

  // Form methods
  async submitForm(formData: FormData): Promise<Partial<FormData>> {
    return this.retryRequest(async () => {
      const response = await this.api.post("/api/form", formData);
      return response.data;
    }, "/api/form");
  }

  async getForm(): Promise<Partial<FormData>> {
    return this.retryRequest(async () => {
      const response = await this.api.get("/api/form");
      return response.data;
    }, "/api/form");
  }

  // Upload methods
  async uploadProfilePhoto(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api.post<UploadResponse>(
      "/api/upload/profile-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  async uploadIdCard(file: File, grade: string): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("card", file);
    formData.append("grade", grade);

    const response = await this.api.post<UserProfile>(
      "/api/upload/card",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  // Veto methods
  async getVetoPreviews(): Promise<VetoPreview[]> {
    const response = await this.api.get<VetoPreview[]>("/api/veto/previews");
    return response.data;
  }

  async submitVeto(vetoedId: string): Promise<void> {
    await this.api.post("/api/veto", { vetoed_id: vetoedId });
  }

  async revokeVeto(vetoedId: string): Promise<void> {
    await this.api.delete("/api/veto", { data: { vetoed_id: vetoedId } });
  }

  async getVetoes(): Promise<string[]> {
    const response = await this.api.get<string[]>("/api/vetoes");
    return response.data;
  }

  // Match methods
  async acceptMatch(): Promise<UserProfile> {
    const response = await this.api.post<UserProfile>(
      "/api/final-match/accept",
    );
    return response.data;
  }

  async rejectMatch(): Promise<UserProfile> {
    const response = await this.api.post<UserProfile>(
      "/api/final-match/reject",
    );
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return (
      !!this.accessToken && !!this.tokenExpiry && this.tokenExpiry > Date.now()
    );
  }

  logout(): void {
    this.clearTokens();
  }
}

export const apiService = new ApiService();
export type { UserProfile, FormData, VetoPreview, TokenResponse };
