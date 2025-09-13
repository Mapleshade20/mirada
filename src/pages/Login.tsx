import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import AuthForm from "../components/AuthForm";
import LanguageSwitcher from "../components/LanguageSwitcher";
import heroBackground from "../assets/hero-background.jpg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.title = t('app.title');
    
    // Redirect authenticated users to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, t]);


  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/80 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Navigation and Language Switcher */}
        <div className="absolute -top-16 left-0 right-0 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="pefa-button-outline inline-flex items-center space-x-2 px-4 py-2"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
          <LanguageSwitcher />
        </div>
        <AuthForm />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t('app.tagline')}
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-700" />
    </div>
  );
};

export default Login;
