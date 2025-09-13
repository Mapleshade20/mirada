import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Users, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.title = t("app.title");
  }, [t]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLearnMore = () => {
    const howItWorksSection = document.getElementById("how-it-works");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pefa-container py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pefa-peach" />
            <h1 className="text-2xl font-semibold text-foreground">
              Encontrar
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <button 
                onClick={() => navigate("/dashboard")} 
                className="pefa-button-outline"
              >
                {t("homepage.header.dashboard", "Dashboard")}
              </button>
            ) : (
              <button onClick={handleGetStarted} className="pefa-button-outline">
                {t("homepage.header.logIn")}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pefa-section py-20">
        <div className="pefa-container">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left 1/3 - Image */}
            <div className="w-full lg:w-1/3">
              <div className="aspect-square bg-gradient-to-br from-pefa-peach/20 to-pefa-orange/20 rounded-3xl flex items-center justify-center">
                <Heart className="h-32 w-32 text-pefa-peach opacity-60" />
              </div>
            </div>

            {/* Right 2/3 - Content */}
            <div className="w-full lg:w-2/3 text-center lg:text-left">
              <div className="tagline mb-4">{t("hero.minititle")}</div>
              <h1 className="heading-jumbo mb-6">
                {"Meeting you was fate, becoming your friend was "}
                <span className="orange-underline">a choice.</span>
              </h1>
              <p className="text-xl md:text-2xl pefa-text mb-8 max-w-2xl">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleGetStarted}
                  className="pefa-button inline-flex items-center space-x-2"
                >
                  <span>
                    {isAuthenticated 
                      ? t("hero.goToDashboard", "Go to Dashboard")
                      : t("hero.getStarted")
                    }
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button onClick={handleLearnMore} className="pefa-button-outline">
                  {t("hero.learnMore")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="pefa-section">
        <div className="pefa-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl pefa-heading mb-4">
              {t("homepage.howItWorks.title")}
            </h2>
            <p className="text-lg pefa-text max-w-2xl mx-auto">
              {t("homepage.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: t("homepage.howItWorks.steps.signUp.title"),
                desc: t("homepage.howItWorks.steps.signUp.description"),
              },
              {
                step: "2",
                title: t("homepage.howItWorks.steps.completeProfile.title"),
                desc: t("homepage.howItWorks.steps.completeProfile.description"),
              },
              {
                step: "3",
                title: t("homepage.howItWorks.steps.getMatched.title"),
                desc: t("homepage.howItWorks.steps.getMatched.description"),
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-pefa-peach rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-semibold text-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl pefa-heading mb-4">{item.title}</h3>
                <p className="pefa-text">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pefa-section bg-pefa-peach/5">
        <div className="pefa-container text-center">
          <h2 className="text-3xl md:text-4xl pefa-heading mb-4">
            {t("homepage.cta.title")}
          </h2>
          <p className="text-lg pefa-text max-w-2xl mx-auto mb-8">
            {t("homepage.cta.subtitle")}
          </p>
          <button
            onClick={handleGetStarted}
            className="pefa-button inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>
              {isAuthenticated 
                ? t("homepage.cta.dashboardButtonText", "Go to Dashboard")
                : t("homepage.cta.buttonText")
              }
            </span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pefa-section py-8 border-t border-border">
        <div className="pefa-container text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-pefa-peach" />
            <span className="text-lg font-semibold text-foreground">
              Encontrar
            </span>
          </div>
          <p className="pefa-text">{t("hero.copyright")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
