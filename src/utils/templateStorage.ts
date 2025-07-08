import { Template } from '../types';

const STORAGE_KEY = 'miro_templates_history';
const MAX_HISTORY_SIZE = 5;

export const saveTemplateToHistory = (template: Template): void => {
  try {
    const existingHistory = getTemplateHistory();
    const newHistory = [template, ...existingHistory.filter(t => t.id !== template.id)]
      .slice(0, MAX_HISTORY_SIZE);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving template to history:', error);
  }
};

export const getTemplateHistory = (): Template[] => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading template history:', error);
    return [];
  }
};

export const clearTemplateHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing template history:', error);
  }
};