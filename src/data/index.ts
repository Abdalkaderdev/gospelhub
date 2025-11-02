import { BibleTranslation } from "../types";
import { kjvTranslation } from "./kjv";
import { esvTranslation } from "./esv";
import { nivTranslation } from "./niv";

export function getTranslationById(id: string): BibleTranslation | undefined {
  return bibleTranslations.find((translation) => translation.id === id);
}

export const bibleTranslations: BibleTranslation[] = [
  kjvTranslation,
  esvTranslation,
  nivTranslation,
];

export const defaultTranslationId = "kjv";