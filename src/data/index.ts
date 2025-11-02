import { BibleTranslation } from "../types";
import { kjvTranslation } from "./kjv";
import { esvTranslation } from "./esv";
import { nivTranslation } from "./niv";
import processedTranslations from "./processed/index";

// Available translations (fallback to TypeScript files)
export const bibleTranslations: BibleTranslation[] = [
  kjvTranslation,
  esvTranslation,
  nivTranslation
];

// All available translations including JSON files
export const allTranslations = processedTranslations;

export function getTranslationById(id: string): BibleTranslation | undefined {
  return bibleTranslations.find((translation) => translation.id === id);
}

export function getBibleTranslations(): BibleTranslation[] {
  return bibleTranslations;
}

export const defaultTranslationId = "kjv";

// Load translation from JSON files
export async function loadTranslationFromJSON(id: string): Promise<BibleTranslation | null> {
  try {
    const response = await fetch(`/src/data/processed/${id}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Failed to load translation ${id}:`, error);
    return null;
  }
}

// Get all available translations
export function getAllTranslations() {
  return allTranslations;
}