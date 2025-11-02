import { BibleTranslation } from "../types";
import { kjvTranslation } from "./kjv";
import { esvTranslation } from "./esv";
import { nivTranslation } from "./niv";

// Available translations
export const bibleTranslations: BibleTranslation[] = [
  kjvTranslation,
  esvTranslation,
  nivTranslation
];

export function getTranslationById(id: string): BibleTranslation | undefined {
  return bibleTranslations.find((translation) => translation.id === id);
}

export const defaultTranslationId = "kjv";

// Async functions for JSON loading (future use)
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