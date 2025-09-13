import { Languages } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/glass-button";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "zh-CN" ? "en-US" : "zh-CN";
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === "zh-CN" ? "中文" : "English";
  const nextLang = i18n.language === "zh-CN" ? "English" : "中文";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      title={`Switch to ${nextLang}`}
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm">{currentLang}</span>
    </Button>
  );
};

export default LanguageSwitcher;
