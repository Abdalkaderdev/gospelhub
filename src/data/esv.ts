import { BibleTranslation, BibleChapterIndex } from "./kjv";

export const esvBible: BibleChapterIndex = {
  Genesis: {
    chapters: [1],
    verses: {
      1: [
        {
          book: "Genesis",
          chapter: 1,
          verse: 1,
          text: "In the beginning, God created the heavens and the earth.",
        },
        {
          book: "Genesis",
          chapter: 1,
          verse: 2,
          text: "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.",
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
          text: "And God saw that the light was good. And God separated the light from the darkness.",
        },
        {
          book: "Genesis",
          chapter: 1,
          verse: 5,
          text: "God called the light Day, and the darkness he called Night. And there was evening and there was morning, the first day.",
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
          text: "The LORD is my shepherd; I shall not want.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 2,
          text: "He makes me lie down in green pastures. He leads me beside still waters.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 3,
          text: "He restores my soul. He leads me in paths of righteousness for his name's sake.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 4,
          text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 5,
          text: "You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows.",
        },
        {
          book: "Psalms",
          chapter: 23,
          verse: 6,
          text: "Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever.",
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
          text: "He was in the beginning with God.",
        },
        {
          book: "John",
          chapter: 1,
          verse: 3,
          text: "All things were made through him, and without him was not any thing made that was made.",
        },
        {
          book: "John",
          chapter: 1,
          verse: 4,
          text: "In him was life, and the life was the light of men.",
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
          text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 17,
          text: "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 18,
          text: "Whoever believes in him is not condemned, but whoever does not believe is condemned already, because he has not believed in the name of the only Son of God.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 19,
          text: "And this is the judgment: the light has come into the world, and people loved the darkness rather than the light because their works were evil.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 20,
          text: "For everyone who does wicked things hates the light and does not come to the light, lest his works should be exposed.",
        },
        {
          book: "John",
          chapter: 3,
          verse: 21,
          text: "But whoever does what is true comes to the light, so that it may be clearly seen that his works have been carried out in God.",
        },
      ],
    },
  },
};

export const esvTranslation: BibleTranslation = {
  id: "esv",
  name: "English Standard Version",
  abbreviation: "ESV",
  language: "English",
  data: esvBible,
};