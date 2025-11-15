import { Heart } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";

const ActivitySummary = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.title = `${t("app.title")} - 活动回顾`;
  }, [t]);

  // Placeholder statistics - these should be fetched from backend or configured
  const statistics = {
    totalVisitors: 736,
    totalMatches: 72,
    attemptedMatches: 126,
    completedForms: 148,
  };

  // Placeholder markdown content - this can be edited by administrators
  const thankYouMessage = `
## Contigo 完结了🎉

我们衷心感谢每一位加入这次旅程的朋友，你们的参与让这场活动有了意义。

你们建立的友谊，正是 Contigo 的核心所在。我们祝愿通过这次活动促成的配对能够发展成为持久的关系，并鼓励你继续与配对对象保持联系，共同培养这份友谊。

活动男女比不太均衡，但没有预期的那么悬殊……最后来看是 **106:42**。比较遗憾有不少同学虽填写了问卷但未能成功配对，希望未来类似的活动里会有更多同学参与进来～

根据隐私政策，所有用户数据已被安全删除。如果你希望再次参与未来的活动，欢迎关注你校公众号。

期待下次相遇！

---

*Maple @ Contigo*
  `.trim();

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
            <button
              type="button"
              onClick={() => navigate("/")}
              className="pefa-button-outline"
            >
              {t("common.home") || "Home"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="pefa-section py-12">
        <div className="pefa-container max-w-4xl">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="heading-jumbo mb-4">Activity Summary</h1>
          </div>

          {/* Statistics Section */}
          <div className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-pefa-peach/5 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-pefa-peach mb-2">
                {statistics.totalVisitors}
              </div>
              <div className="text-sm pefa-text">总访客数</div>
            </div>
            <div className="bg-pefa-peach/5 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-pefa-peach mb-2">
                {statistics.completedForms}
              </div>
              <div className="text-sm pefa-text">完成表单</div>
            </div>
            <div className="bg-pefa-peach/5 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-pefa-peach mb-2">
                {statistics.attemptedMatches}
              </div>
              <div className="text-sm pefa-text">尝试匹配人次</div>
            </div>
            <div className="bg-pefa-peach/5 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-pefa-peach mb-2">
                {statistics.totalMatches}
              </div>
              <div className="text-sm pefa-text">成功配对</div>
            </div>
          </div>

          {/* Thank You Message Section */}
          <div className="mb-16">
            <div className="prose prose-lg max-w-none pefa-text">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl pefa-heading mb-4 mt-8">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl pefa-heading mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="pefa-text mb-4 text-lg leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2">
                      {children}
                    </ol>
                  ),
                  em: ({ children }) => (
                    <em className="text-pefa-peach italic">{children}</em>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  hr: () => <hr className="my-8 border-border" />,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-pefa-peach hover:text-pefa-orange transition-colors underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {thankYouMessage}
              </ReactMarkdown>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="pefa-button px-8 py-4"
            >
              返回主页
            </button>
          </div>
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

export default ActivitySummary;
