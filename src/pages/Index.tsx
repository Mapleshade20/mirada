import { ArrowRight, Heart } from "lucide-react";
import { useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuthStore } from "../store/authStore";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const howItWorksId = useId();
  const currentYear = new Date().getFullYear();

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
    const howItWorksSection = document.getElementById(howItWorksId);
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
            <h1 className="text-2xl font-semibold text-foreground">Contigo</h1>
          </div>
          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="pefa-button-outline"
              >
                {t("common.dashboard")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGetStarted}
                className="pefa-button-outline"
              >
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
                  type="button"
                  onClick={handleGetStarted}
                  className="pefa-button inline-flex items-center space-x-2"
                >
                  <span>
                    {isAuthenticated
                      ? t("hero.goToDashboard")
                      : t("hero.getStarted")}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleLearnMore}
                  className="pefa-button-outline"
                >
                  {t("hero.learnMore")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id={howItWorksId} className="pefa-section">
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
                desc: t(
                  "homepage.howItWorks.steps.completeProfile.description",
                ),
              },
              {
                step: "3",
                title: t("homepage.howItWorks.steps.getMatched.title"),
                desc: t("homepage.howItWorks.steps.getMatched.description"),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
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
          <div className="text-lg pefa-text max-w-2xl mx-auto mb-8 text-left">
            {t("homepage.cta.subtitle")
              .split("\n")
              .map((paragraph) => (
                <p key={paragraph} className="mb-4 last:mb-0 text-justify">
                  {paragraph}
                </p>
              ))}
          </div>
          <button
            type="button"
            onClick={handleGetStarted}
            className="pefa-button inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>
              {isAuthenticated
                ? t("hero.goToDashboard")
                : t("homepage.cta.buttonText")}
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
              Contigo
            </span>
          </div>
          <p className="pefa-text">
            {"© "}
            {currentYear} {t("hero.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
