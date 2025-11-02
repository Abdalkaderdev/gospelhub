import { BibleTranslation, BibleChapterIndex } from "./kjv";

export const nivBible: BibleChapterIndex = {
  Genesis: {
    chapters: [1],
    verses: {
      1: [
        {
          book: "Genesis",
          chapter: 1,
          verse: 1,
          text: "In the beginning God created the heavens and the earth.",
        },
        {
          book: "Genesis",
          chapter: 1,
          verse: 2,
          text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
        },
        {
          book: "Genesis",
          chapter: 1,
          verse: 3,
          text: "And God said, 'Let there be light,' and there was light.",
        },
        {
          book: "Genesis",
          chapter: 1,
          verse: 4,
          text: "God saw that the light was good, and he separated the light from the darkness.",
        },
        {
          book: "Genesis",
          chapter: 1,
          verse: 5,
          text: "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day.",
        },
      ],
    },
  },
  Psalms: {
    chapters: [23],
    verses: {
      23: [
        {
          book: "Psalms",
          chapter: 23,
          verse: 1,
          text: "The LORD is my shepherd, I lack nothing.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 2,
          text: "He makes me lie down in green pastures, he leads me beside quiet waters.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 3,
          text: "He refreshes my soul. He guides me along the right paths for his name's sake.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 4,
          text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 5,
          text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 6,
          text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever.",
        },
      ],
    },
  },
  John: {
    chapters: [1, 3],
    verses: {
      1: [
        {
          book: "John",
          chapter: 1,
          verse: 1,
          text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        },
        {
          book: "John",
          chapter: 1,
          verse: 2,
          text: "He was with God in the beginning.",
        },
        {
          book: "John",
          chapter: 1,
          verse: 3,
          text: "Through him all things were made; without him nothing was made that has been made.",
        },
        {
          book: "John",
          chapter: 1,
          verse: 4,
          text: "In him was life, and that life was the light of all mankind.",
        },
        {
          book: "John",
          chapter: 1,
          verse: 5,
          text: "The light shines in the darkness, and the darkness has not overcome it.",
        },
      ],
      3: [
        {
          book: "John",
          chapter: 3,
          verse: 16,
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 17,
          text: "For God did not send his Son into the world to condemn the world, but to save the world through him.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 18,
          text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God's one and only Son.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 19,
          text: "This is the verdict: Light has come into the world, but people loved darkness instead of light because their deeds were evil.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 20,
          text: "Everyone who does evil hates the light, and will not come into the light for fear that their deeds will be exposed.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 21,
          text: "But whoever lives by the truth comes into the light, so that it may be seen plainly that what they have done has been done in the sight of God.",
        },
      ],
    },
  },
};

export const nivTranslation: BibleTranslation = {
  id: "niv",
  name: "New International Version",
  abbreviation: "NIV",
  language: "English",
  data: nivBible,
};