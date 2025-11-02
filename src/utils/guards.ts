import { BibleReference } from "../types";

export function isSingleVerse(reference: BibleReference): reference is BibleReference & { verse: number } {
  return reference.verse !== undefined;
}