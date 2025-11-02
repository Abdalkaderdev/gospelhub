import { NavigationDirection, AppState } from "../types";

export function navigateChapter(
  currentState: AppState,
  direction: NavigationDirection,
  availableBooks: string[]
): AppState {
  const { currentBook, currentChapter } = currentState;
  const bookIndex = availableBooks.indexOf(currentBook);

  if (bookIndex === -1) {
    return currentState;
  }

  let newChapter = currentChapter;
  let newBook = currentBook;

  switch (direction) {
    case NavigationDirection.Previous: {
      if (currentChapter > 1) {
        newChapter = currentChapter - 1;
      } else if (bookIndex > 0) {
        newBook = availableBooks[bookIndex - 1];
        newChapter = 1;
      }
      break;
    }
    case NavigationDirection.Next: {
      if (currentChapter < 50) {
        newChapter = currentChapter + 1;
      } else if (bookIndex < availableBooks.length - 1) {
        newBook = availableBooks[bookIndex + 1];
        newChapter = 1;
      }
      break;
    }
  }

  return {
    ...currentState,
    currentBook: newBook,
    currentChapter: newChapter,
    currentVerse: "all",
  };
}