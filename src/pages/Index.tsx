import { ArrowRight, Heart } from "lucide-react";
import { useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuthStore } from "../store/authStore";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const howItWorksId = useId();
  const currentYear = new Date().getFullYear();

  // Check if activity has ended
  const isActivityEnded = import.meta.env.VITE_ENDED === "true";

  useEffect(() => {
    document.title = t("app.title");
  }, [t]);

  const handleGetStarted = () => {
    if (isActivityEnded) {
      navigate("/summary");
    } else if (isAuthenticated) {
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
            {isActivityEnded ? (
              <button
                type="button"
                onClick={() => navigate("/summary")}
                className="pefa-button-outline"
              >
                {t("homepage.header.activityReview")}
              </button>
            ) : isAuthenticated ? (
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
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-16">
            {/* Left 1/3 - Image */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="flex justify-center">
                <img
                  src="/home.webp"
                  alt="Contigo homepage illustration"
                  className="max-w-[400px] h-auto"
                />
              </div>
            </div>

            {/* Right 2/3 - Content */}
            <div className="w-full lg:w-2/3 text-center lg:text-left lg:max-w-none max-w-2xl mx-auto lg:mx-0">
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
                  className="pefa-button inline-flex items-center justify-center space-x-2"
                >
                  <span>
                    {isActivityEnded
                      ? t("hero.viewActivityReview")
                      : isAuthenticated
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
              .map((paragraph) => {
                const emailRegex = /<([^>]+@[^>]+)>/g;
                const parts = paragraph.split(emailRegex);

                return (
                  <p key={paragraph} className="mb-4 last:mb-0 text-justify">
                    {parts.map((part) => {
                      if (
                        part.includes("@") &&
                        !part.includes("<") &&
                        !part.includes(">")
                      ) {
                        return (
                          <a
                            key={part}
                            href={`mailto:${part}`}
                            className="text-pefa-peach hover:text-pefa-orange transition-colors underline"
                          >
                            {part}
                          </a>
                        );
                      }
                      return part;
                    })}
                  </p>
                );
              })}
          </div>
          <button
            type="button"
            onClick={handleGetStarted}
            className="pefa-button inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>
              {isActivityEnded
                ? t("hero.viewActivityReview")
                : isAuthenticated
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
          <p className="pefa-text mb-4">
            © Copyleft {currentYear} {t("hero.copyright")}
          </p>
          <div className="pefa-text flex items-center justify-center gap-6">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              {t("footer.termsOfService")}
            </Link>
            <a
              href="https://github.com/Mapleshade20/hilo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <img
                height="16"
                width="16"
                alt="Rust"
                src="https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/rust.svg"
              />
              <span>hilo</span>
            </a>
            <a
              href="https://github.com/Mapleshade20/mirada"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <img
                height="16"
                width="16"
                alt="React"
                src="https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/react.svg"
              />
              <span>mirada</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
