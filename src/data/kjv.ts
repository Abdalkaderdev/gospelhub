export type BibleVerse = {
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
  
  export type BibleChapterIndex = {
    [book: string]: {
      chapters: number[];
      verses: {
        [chapter: number]: BibleVerse[];
      };
    };
  };
  
  export type BibleTranslation = {
    id: string;
    name: string;
    abbreviation: string;
    language: string;
    data: BibleChapterIndex;
  };
  
  export const kjvBible: BibleChapterIndex = {
    Genesis: {
      chapters: [1],
      verses: {
        1: [
          {
            book: "Genesis",
            chapter: 1,
            verse: 1,
            text: "In the beginning God created the heaven and the earth.",
          },
          {
            book: "Genesis",
            chapter: 1,
            verse: 2,
            text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
          },
          {
            book: "Genesis",
            chapter: 1,
            verse: 3,
            text: "And God said, Let there be light: and there was light.",
          },
          {
            book: "Genesis",
            chapter: 1,
            verse: 4,
            text: "And God saw the light, that it was good: and God divided the light from the darkness.",
          },
          {
            book: "Genesis",
            chapter: 1,
            verse: 5,
            text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
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
            text: "The Lord is my shepherd; I shall not want.",
          },
          {
            book: "Psalms",
            chapter: 23,
            verse: 2,
            text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
          },
          {
            book: "Psalms",
            chapter: 23,
            verse: 3,
            text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
          },
          {
            book: "Psalms",
            chapter: 23,
            verse: 4,
            text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
          },
          {
            book: "Psalms",
            chapter: 23,
            verse: 5,
            text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
          },
          {
            book: "Psalms",
            chapter: 23,
            verse: 6,
            text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.",
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
            text: "The same was in the beginning with God.",
          },
          {
            book: "John",
            chapter: 1,
            verse: 3,
            text: "All things were made by him; and without him was not any thing made that was made.",
          },
          {
            book: "John",
            chapter: 1,
            verse: 4,
            text: "In him was life; and the life was the light of men.",
          },
          {
            book: "John",
            chapter: 1,
            verse: 5,
            text: "And the light shineth in darkness; and the darkness comprehended it not.",
          },
        ],
        3: [
          {
            book: "John",
            chapter: 3,
            verse: 16,
            text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          },
          {
            book: "John",
            chapter: 3,
            verse: 17,
            text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
          },
          {
            book: "John",
            chapter: 3,
            verse: 18,
            text: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",
          },
          {
            book: "John",
            chapter: 3,
            verse: 19,
            text: "And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.",
          },
          {
            book: "John",
            chapter: 3,
            verse: 20,
            text: "For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.",
          },
          {
            book: "John",
            chapter: 3,
            verse: 21,
            text: "But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.",
          },
        ],
      },
    },
  };
  
  export const kjvTranslation: BibleTranslation = {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English",
    data: kjvBible,
  };