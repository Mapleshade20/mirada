import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GlassCard } from "../components/ui/glass-card";
import { Button } from "../components/ui/glass-button";
import { Heart, Users, Sparkles, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LanguageSwitcher from "../components/LanguageSwitcher";
import heroBackground from "../assets/hero-background.jpg";

const Index = () => {
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

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/85 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                onClick={handleGetStarted}
                variant="gradient"
                size="lg"
                className="text-lg px-12 py-4 h-auto"
              >
                {t('hero.getStarted')}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="text-lg px-12 py-4 h-auto"
              >
                {t('hero.learnMore')}
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <GlassCard className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('features.intelligentMatching.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('features.intelligentMatching.description')}
                </p>
              </GlassCard>

              <GlassCard className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('features.universityNetwork.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('features.universityNetwork.description')}
                </p>
              </GlassCard>

              <GlassCard className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('features.premiumExperience.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('features.premiumExperience.description')}
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t('hero.copyright')}
          </p>
        </footer>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse delay-500" />
    </div>
  );
};

export default Index;
