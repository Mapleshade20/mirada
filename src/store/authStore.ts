import { create } from 'zustand';
import { apiService, UserProfile } from '../lib/api';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

// Helper function to check if error is an AxiosError
const isAxiosError = (error: unknown): error is import('axios').AxiosError => {
  return axios.isAxiosError(error);
};

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, code: string) => Promise<void>;
  logout: () => void;
  sendVerificationCode: (email: string) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: async (email: string, code: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiService.verifyCode(email, code);
      const profile = await apiService.getProfile();
      
      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        error: isAxiosError(error) ? error.response?.data?.message || 'Authentication failed' : 'Authentication failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    apiService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  sendVerificationCode: async (email: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiService.sendVerificationCode(email);
      set({ isLoading: false });
    } catch (error: unknown) {
      set({
        error: isAxiosError(error) ? error.response?.data?.message || 'Failed to send verification code' : 'Failed to send verification code',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchUserProfile: async () => {
    const state = get();
    if (!state.isAuthenticated || state.isLoading) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const profile = await apiService.getProfile();
      set({
        user: profile,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = isAxiosError(error) ? error.response?.data?.message || 'Failed to fetch profile' : 'Failed to fetch profile';
      
      // Only logout for 401 unauthorized errors (invalid/expired tokens)
      // For network errors or server errors, show error message but keep user logged in
      if (isAxiosError(error) && error.response?.status === 401) {
        get().logout();
        set({
          error: 'Session expired. Please log in again.',
          isLoading: false,
        });
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive",
        });
      } else {
        // For network errors or other server errors, don't logout, show toast
        const isConnectionError = error.code === 'NETWORK_ERROR' || !error.response;
        const connectionErrorMessage = 'Server is temporarily unavailable. Please try again later.';
        
        set({
          error: isConnectionError ? connectionErrorMessage : errorMessage,
          isLoading: false,
        });
        
        toast({
          title: isConnectionError ? "Connection Error" : "Server Error",
          description: isConnectionError ? connectionErrorMessage : errorMessage,
          variant: "destructive",
        });
      }
    }
  },

  updateUserProfile: (profile: UserProfile) => {
    set({ user: profile });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: async () => {
    const hasToken = !!localStorage.getItem('access_token');
    
    if (!hasToken) {
      set({ isAuthenticated: false });
      return;
    }

    // If we have a token, try to fetch user profile to verify it's valid
    try {
      const profile = await apiService.getProfile();
      set({
        user: profile,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: unknown) {
      // Only clear token for 401 errors (invalid token)
      // For network errors, keep the token and user logged in
      if (isAxiosError(error) && error.response?.status === 401) {
        apiService.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      } else {
        // For network errors, keep user authenticated but show toast
        const isConnectionError = error.code === 'NETWORK_ERROR' || !error.response;
        const connectionErrorMessage = 'Server is temporarily unavailable. Your session will be restored when connection is re-established.';
        
        set({
          isAuthenticated: true,
          error: isConnectionError ? connectionErrorMessage : 'Failed to verify session',
        });
        
        // Only show toast for connection errors during initialization
        if (isConnectionError) {
          toast({
            title: "Connection Error",
            description: connectionErrorMessage,
            variant: "destructive",
          });
        }
      }
    }
  },
}));