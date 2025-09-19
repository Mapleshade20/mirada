import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MatchPreviews from "./pages/MatchPreviews";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProfileForm from "./pages/ProfileForm";
import TermsOfService from "./pages/TermsOfService";
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
            colorPrimary: "#ef9678",
            borderRadius: 8,
            wireframe: false,
            fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, sans-serif",
          },
        }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/form"
                element={
                  <ProtectedRoute requiredStatus={["verified"]}>
                    <ProfileForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/previews"
                element={
                  <ProtectedRoute requiredStatus={["form_completed"]}>
                    <MatchPreviews />
                  </ProtectedRoute>
                }
              />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
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
