import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import Login from "./pages/Login";
import Index from "./pages/Index";
import ProfileForm from "./pages/ProfileForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ef9678',
          borderRadius: 8,
          wireframe: false,
          fontFamily: 'Heebo, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/form" element={
              <ProtectedRoute requiredStatus={['verified']}>
                <ProfileForm />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
  );
};

export default App;
