import { BibleReference, BibleVerse, SearchResult, BibleSearchResult, isSingleVerse } from "../types";
import { bibleTranslations } from "../data";

const API_BASE_URL = "https://api.bible-api.com/bible";

export function getTranslationById(id: string) {
  return bibleTranslations.find((translation) => translation.id === id);
}

export async function fetchBibleVerse(
  reference: BibleReference,
  translationId: string = "kjv"
): Promise<SearchResult<BibleVerse | BibleVerse[]>> {
  const translation = getTranslationById(translationId);
  if (!translation) {
    throw new Error(`Translation ${translationId} not found`);
  }

  const url = isSingleVerse(reference)
    ? `${API_BASE_URL}/${translationId}/${reference.book}/${reference.chapter}/${reference.verse}`
    : `${API_BASE_URL}/${translationId}/${reference.book}/${reference.chapter}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();

    if (isSingleVerse(reference)) {
      return {
        results: data as BibleVerse,
        total: 1,
      };
    } else {
      return {
        results: data as BibleVerse[],
        total: Array.isArray(data) ? data.length : 0,
      };
    }
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    throw error;
  }
}

export async function fetchBibleBooks(translationId: string = "kjv"): Promise<string[]> {
  const translation = getTranslationById(translationId);
  if (!translation) {
    throw new Error(`Translation ${translationId} not found`);
  }

  const url = `${API_BASE_URL}/${translationId}/books`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Bible books:", error);
    throw error;
  }
}