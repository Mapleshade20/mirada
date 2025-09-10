import { useCallback } from 'react';

export const useDraftSaving = (key: string) => {
  const saveDraft = useCallback((data: any) => {
    try {
      localStorage.setItem(`draft_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save draft to localStorage:', error);
    }
  }, [key]);

  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem(`draft_${key}`);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.warn('Failed to load draft from localStorage:', error);
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft_${key}`);
    } catch (error) {
      console.warn('Failed to clear draft from localStorage:', error);
    }
  }, [key]);

  return { saveDraft, loadDraft, clearDraft };
};