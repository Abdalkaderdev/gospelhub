// Re-export from BibleDataService for backward compatibility
export { bibleDataService as default } from '../services/BibleDataService';
export { bibleDataService } from '../services/BibleDataService';

// Legacy exports for backward compatibility
export const defaultTranslationId = "eng-kjv";

export function getTranslationById(id: string) {
  return bibleDataService.getTranslation(id);
}

export function getBibleTranslations() {
  return bibleDataService.getTranslations();
}

export function getAllTranslations() {
  return bibleDataService.getTranslations();
}

export const bibleTranslations = getAllTranslations();