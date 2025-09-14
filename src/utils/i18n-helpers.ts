// Translation helper functions for tags and traits
import { useTranslation } from "react-i18next";

// Import the unified translation data
import tagsTranslations from "../data/tags.json";
import traitsTranslations from "../data/traits.json";

// Types for the unified translation data
interface UnifiedTagTranslation {
  name: {
    en: string;
    zh: string;
  };
  desc?: {
    en: string;
    zh: string;
  };
}

interface UnifiedTraitTranslation {
  name: {
    en: string;
    zh: string;
  };
}

// Helper to determine the correct language key
const getLanguageKey = (language: string): "en" | "zh" => {
  return language === "zh-CN" ? "zh" : "en";
};

/**
 * Get translated tag name by ID
 * @param tagId - The tag ID to translate
 * @param language - Current language (e.g., "en-US", "zh-CN")
 * @returns Translated tag name or fallback to tagId if not found
 */
export const getTranslatedTagName = (
  tagId: string,
  language: string,
): string => {
  const langKey = getLanguageKey(language);
  const tagData = (tagsTranslations as Record<string, UnifiedTagTranslation>)[tagId];
  return tagData?.name[langKey] || tagId;
};

/**
 * Get translated tag description by ID
 * @param tagId - The tag ID to get description for
 * @param language - Current language (e.g., "en-US", "zh-CN")
 * @returns Translated tag description or undefined if not found
 */
export const getTranslatedTagDesc = (
  tagId: string,
  language: string,
): string | undefined => {
  const langKey = getLanguageKey(language);
  const tagData = (tagsTranslations as Record<string, UnifiedTagTranslation>)[tagId];
  return tagData?.desc?.[langKey];
};

/**
 * Get translated trait name by ID
 * @param traitId - The trait ID to translate
 * @param language - Current language (e.g., "en-US", "zh-CN")
 * @returns Translated trait name or fallback to traitId if not found
 */
export const getTranslatedTraitName = (
  traitId: string,
  language: string,
): string => {
  const langKey = getLanguageKey(language);
  const traitData = (traitsTranslations as Record<string, UnifiedTraitTranslation>)[traitId];
  return traitData?.name[langKey] || traitId;
};

/**
 * React hook to get tag translation functions that automatically use current language
 * @returns Object with translation functions that use current language
 */
export const useTagTranslation = () => {
  const { i18n } = useTranslation();

  return {
    getTagName: (tagId: string) => getTranslatedTagName(tagId, i18n.language),
    getTagDesc: (tagId: string) => getTranslatedTagDesc(tagId, i18n.language),
  };
};

/**
 * React hook to get trait translation functions that automatically use current language
 * @returns Object with translation functions that use current language
 */
export const useTraitTranslation = () => {
  const { i18n } = useTranslation();

  return {
    getTraitName: (traitId: string) =>
      getTranslatedTraitName(traitId, i18n.language),
  };
};
