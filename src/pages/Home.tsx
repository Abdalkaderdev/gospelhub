import React, { Fragment, useEffect, useMemo, useState, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bibleTranslations, getTranslationById, defaultTranslationId, getAllTranslations, loadTranslationFromJSON } from "../data";
import { BibleReference, AppState, NavigationDirection, BibleVerse } from "../types";
import { isSingleVerse } from "../utils/guards";
import { navigateChapter } from "../utils/navigation";
import { SearchService } from "../search";
import { security, csrfToken } from "../utils/security";
import { TranslationSelector } from "../components/TranslationSelector";
import { MainLayout } from './layouts';

export const Home = () => {
  const [selectedTranslationId, setSelectedTranslationId] = useState(defaultTranslationId);
  const [appState, setAppState] = useState<AppState>({
    currentBook: "",
    currentChapter: 1,
    currentVerse: "all",
  });

  return (
    <MainLayout title="Gospel Hub">
      <div className="px-4 sm:px-6 py-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold">Gospel Hub</h1>
          <p>Coming soon...</p>
        </div>
      </div>
    </MainLayout>
  );
};