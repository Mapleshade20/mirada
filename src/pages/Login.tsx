import { Home } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import LanguageSwitcher from "../components/LanguageSwitcher";
import NovatrixBackground from "../components/ui/uvcanvas-background";
import { useAuthStore } from "../store/authStore";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.title = t("app.title");

    // Redirect authenticated users to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, t]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <NovatrixBackground opacity={0.9} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Navigation and Language Switcher */}
        <div className="absolute -top-16 left-0 right-0 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="pefa-button-outline inline-flex items-center space-x-2 px-4 py-2"
          >
            <Home className="h-4 w-4" />
            <span>{t("common.home")}</span>
          </button>
          <LanguageSwitcher />
        </div>
        <AuthForm />

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            {t("auth.tagline")
              .split("\n")
              .map((paragraph) => (
                <p key={paragraph} className="m-2">
                  {paragraph}
                </p>
              ))}
          </div>
          <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground/60">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <span>•</span>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              {t("footer.termsOfService")}
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-700" />
    </div>
  );
};

export default Login;
