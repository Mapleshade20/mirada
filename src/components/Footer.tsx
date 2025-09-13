import type React from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-2 px-6 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-s text-muted-foreground/60">
        <div className="text-center sm:text-left">
          © {currentYear} Encontrar. {t("footer.experimental")}
        </div>

        <div className="flex items-center gap-4">
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
  );
};

export default Footer;
