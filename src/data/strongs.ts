export interface StrongsEntry {
  number: string;
  word: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
  etymology: string;
  usage: string[];
  relatedWords: string[];
}

export const strongsData: Record<string, StrongsEntry> = {
  'H430': {
    number: 'H430',
    word: 'אֱלֹהִים',
    transliteration: 'elohim',
    pronunciation: 'el-o-heem',
    definition: 'God, gods, judges, angels',
    etymology: 'Plural of H433; gods in the ordinary sense',
    usage: ['God', 'gods', 'judges', 'divine ones'],
    relatedWords: ['H433', 'H410', 'H426']
  },
  'H776': {
    number: 'H776',
    word: 'אֶרֶץ',
    transliteration: 'erets',
    pronunciation: 'eh-rets',
    definition: 'earth, land, country, ground',
    etymology: 'From an unused root probably meaning to be firm',
    usage: ['earth', 'land', 'country', 'ground', 'world'],
    relatedWords: ['H127', 'H8064']
  },
  'G2316': {
    number: 'G2316',
    word: 'θεός',
    transliteration: 'theos',
    pronunciation: 'theh-os',
    definition: 'God, deity, divine',
    etymology: 'Of uncertain affinity; a deity',
    usage: ['God', 'god', 'godly'],
    relatedWords: ['G2304', 'G2318', 'G2319']
  },
  'G26': {
    number: 'G26',
    word: 'ἀγάπη',
    transliteration: 'agape',
    pronunciation: 'ag-ah-pay',
    definition: 'love, charity, dear, beloved',
    etymology: 'From G25; love, i.e. affection or benevolence',
    usage: ['love', 'charity', 'dear', 'beloved'],
    relatedWords: ['G25', 'G27', 'G5368']
  }
};

export const getStrongsEntry = (number: string): StrongsEntry | null => {
  return strongsData[number] || null;
};

export const searchStrongs = (query: string): StrongsEntry[] => {
  const results: StrongsEntry[] = [];
  const lowerQuery = query.toLowerCase();
  
  Object.values(strongsData).forEach(entry => {
    if (
      entry.word.includes(query) ||
      entry.transliteration.toLowerCase().includes(lowerQuery) ||
      entry.definition.toLowerCase().includes(lowerQuery) ||
      entry.usage.some(usage => usage.toLowerCase().includes(lowerQuery))
    ) {
      results.push(entry);
    }
  });
  
  return results;
};