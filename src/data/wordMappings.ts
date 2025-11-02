export interface WordMapping {
  [word: string]: string; // English word -> Strong's number
}

export const wordMappings: WordMapping = {
  // Common Hebrew words (Old Testament)
  'God': 'H430',
  'LORD': 'H3068',
  'earth': 'H776',
  'heaven': 'H8064',
  'created': 'H1254',
  'love': 'H157',
  'son': 'H1121',
  'king': 'H4428',
  
  // Common Greek words (New Testament)
  'god': 'G2316',
  'loved': 'G26',
  'world': 'G2889',
  'begotten': 'G3439',
  'believe': 'G4100',
  'life': 'G2222',
  'eternal': 'G166',
  'word': 'G3056',
  'light': 'G5457',
  
  // Additional common terms
  'father': 'G3962',
  'spirit': 'G4151',
  'holy': 'G40',
  'christ': 'G5547',
  'jesus': 'G2424',
  'salvation': 'G4991',
  'grace': 'G5485',
  'faith': 'G4102',
  'peace': 'G1515',
  'joy': 'G5479',
  'hope': 'G1680',
  'truth': 'G225',
  'righteousness': 'G1343',
  'sin': 'G266',
  'forgiveness': 'G859',
  'mercy': 'G1656',
  'glory': 'G1391',
  'power': 'G1411',
  'wisdom': 'G4678',
  'church': 'G1577',
  'disciple': 'G3101',
  'apostle': 'G652',
  'prophet': 'G4396',
  'kingdom': 'G932',
  'prayer': 'G4335',
  'blessing': 'G2129'
};

export const getStrongsNumber = (word: string): string | null => {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  return wordMappings[cleanWord] || null;
};

export const isHebrewStrongs = (strongsNumber: string): boolean => {
  return strongsNumber.startsWith('H');
};

export const isGreekStrongs = (strongsNumber: string): boolean => {
  return strongsNumber.startsWith('G');
};