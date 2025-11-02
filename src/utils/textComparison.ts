export interface TextDifference {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  index: number;
}

export const compareTexts = (text1: string, text2: string): { 
  text1Diffs: TextDifference[], 
  text2Diffs: TextDifference[] 
} => {
  const words1 = text1.split(' ');
  const words2 = text2.split(' ');
  
  const text1Diffs: TextDifference[] = [];
  const text2Diffs: TextDifference[] = [];
  
  let i = 0, j = 0;
  
  while (i < words1.length || j < words2.length) {
    if (i >= words1.length) {
      // Remaining words in text2 are additions
      text2Diffs.push({
        type: 'added',
        text: words2[j],
        index: j
      });
      j++;
    } else if (j >= words2.length) {
      // Remaining words in text1 are removals
      text1Diffs.push({
        type: 'removed',
        text: words1[i],
        index: i
      });
      i++;
    } else if (words1[i].toLowerCase() === words2[j].toLowerCase()) {
      // Words match
      text1Diffs.push({
        type: 'unchanged',
        text: words1[i],
        index: i
      });
      text2Diffs.push({
        type: 'unchanged',
        text: words2[j],
        index: j
      });
      i++;
      j++;
    } else {
      // Words differ - simple approach: mark both as different
      text1Diffs.push({
        type: 'removed',
        text: words1[i],
        index: i
      });
      text2Diffs.push({
        type: 'added',
        text: words2[j],
        index: j
      });
      i++;
      j++;
    }
  }
  
  return { text1Diffs, text2Diffs };
};