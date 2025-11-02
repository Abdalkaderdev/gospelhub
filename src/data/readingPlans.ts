export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  readings: { day: number; book: string; chapter: number; verses?: string }[];
}

export const readingPlans: ReadingPlan[] = [
  {
    id: "bible-in-year",
    name: "Bible in a Year",
    description: "Read through the entire Bible in 365 days",
    duration: 365,
    readings: [
      { day: 1, book: "Genesis", chapter: 1 },
      { day: 1, book: "Matthew", chapter: 1 },
      { day: 2, book: "Genesis", chapter: 2 },
      { day: 2, book: "Matthew", chapter: 2 },
      { day: 3, book: "Genesis", chapter: 3 },
      { day: 3, book: "Matthew", chapter: 3 },
      { day: 4, book: "Genesis", chapter: 4 },
      { day: 4, book: "Matthew", chapter: 4 },
      { day: 5, book: "Genesis", chapter: 5 },
      { day: 5, book: "Matthew", chapter: 5 }
    ]
  },
  {
    id: "new-testament-30",
    name: "New Testament in 30 Days",
    description: "Read the entire New Testament in one month",
    duration: 30,
    readings: [
      { day: 1, book: "Matthew", chapter: 1 },
      { day: 1, book: "Matthew", chapter: 2 },
      { day: 2, book: "Matthew", chapter: 3 },
      { day: 2, book: "Matthew", chapter: 4 },
      { day: 3, book: "Matthew", chapter: 5 },
      { day: 3, book: "Matthew", chapter: 6 },
      { day: 4, book: "Matthew", chapter: 7 },
      { day: 4, book: "Matthew", chapter: 8 },
      { day: 5, book: "Matthew", chapter: 9 },
      { day: 5, book: "Matthew", chapter: 10 }
    ]
  },
  {
    id: "psalms-proverbs",
    name: "Psalms & Proverbs",
    description: "Read through Psalms and Proverbs for wisdom and worship",
    duration: 60,
    readings: [
      { day: 1, book: "Psalms", chapter: 1 },
      { day: 1, book: "Proverbs", chapter: 1 },
      { day: 2, book: "Psalms", chapter: 2 },
      { day: 2, book: "Proverbs", chapter: 2 },
      { day: 3, book: "Psalms", chapter: 3 },
      { day: 3, book: "Proverbs", chapter: 3 },
      { day: 4, book: "Psalms", chapter: 4 },
      { day: 4, book: "Proverbs", chapter: 4 },
      { day: 5, book: "Psalms", chapter: 5 },
      { day: 5, book: "Proverbs", chapter: 5 }
    ]
  },
  {
    id: "gospels-21",
    name: "Four Gospels in 21 Days",
    description: "Focus on the life and teachings of Jesus",
    duration: 21,
    readings: [
      { day: 1, book: "Matthew", chapter: 1 },
      { day: 2, book: "Matthew", chapter: 2 },
      { day: 3, book: "Matthew", chapter: 3 },
      { day: 4, book: "Mark", chapter: 1 },
      { day: 5, book: "Mark", chapter: 2 },
      { day: 6, book: "Luke", chapter: 1 },
      { day: 7, book: "Luke", chapter: 2 },
      { day: 8, book: "John", chapter: 1 },
      { day: 9, book: "John", chapter: 2 },
      { day: 10, book: "John", chapter: 3 }
    ]
  }
];