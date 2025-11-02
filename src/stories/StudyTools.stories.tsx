import type { Meta, StoryObj } from '@storybook/react';
import { InteractiveWordStudy } from '../components/study/InteractiveWordStudy';
import { CrossReferenceGraph } from '../components/study/CrossReferenceGraph';
import { CommentarySidebar } from '../components/study/CommentarySidebar';
import { OriginalLanguageTools } from '../components/study/OriginalLanguageTools';

// Sample data
const sampleReferences = [
  {
    id: 'john-3-16',
    book: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world...',
    connections: ['rom-5-8', '1john-4-9'],
    strength: 0.9
  },
  {
    id: 'rom-5-8',
    book: 'Romans',
    chapter: 5,
    verse: 8,
    text: 'But God demonstrates his own love...',
    connections: ['john-3-16', '1john-4-10'],
    strength: 0.8
  },
  {
    id: '1john-4-9',
    book: '1 John',
    chapter: 4,
    verse: 9,
    text: 'This is how God showed his love...',
    connections: ['john-3-16', '1john-4-10'],
    strength: 0.7
  },
  {
    id: '1john-4-10',
    book: '1 John',
    chapter: 4,
    verse: 10,
    text: 'This is love: not that we loved God...',
    connections: ['rom-5-8', '1john-4-9'],
    strength: 0.6
  }
];

const sampleCommentaries = [
  {
    id: '1',
    author: 'Matthew Henry',
    title: 'Complete Commentary on the Whole Bible',
    date: '1706',
    text: 'Here is the great gospel mystery, the incarnation of the Son of God, his taking upon him the human nature. The Word was made flesh, that is, he assumed the human nature into union with the divine nature.',
    verse: 'John 3:16'
  },
  {
    id: '2',
    author: 'John Calvin',
    title: 'Commentary on the Gospel of John',
    date: '1553',
    text: 'By these words he removes every ground of doubt, when he declares that God is so inclined to reconcile the world to himself, that he spared not his only-begotten Son.',
    verse: 'John 3:16'
  }
];

const sampleGreekText = {
  text: 'οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον',
  transliteration: 'houtōs gar ēgapēsen ho theos ton kosmon',
  pronunciation: 'HOO-toce gar ay-GAH-pay-sen ho theh-OSS ton KOS-mon',
  morphology: 'Adverb, Conjunction, Verb, Article, Noun, Article, Noun',
  parsing: ['Adverb', 'Conjunction', 'Aorist Active Indicative 3rd Singular', 'Nominative Masculine Singular', 'Accusative Masculine Singular']
};

// Word Study Stories
const wordStudyMeta: Meta<typeof InteractiveWordStudy> = {
  title: 'Study Tools/Interactive Word Study',
  component: InteractiveWordStudy,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    word: { control: 'text' },
    strongsNumber: { control: 'text' },
    onClose: { action: 'closed' },
  },
};

export default wordStudyMeta;
type WordStudyStory = StoryObj<typeof wordStudyMeta>;

export const WordStudyDefault: WordStudyStory = {
  args: {
    word: 'love',
    strongsNumber: 'G26',
  },
};

export const WordStudyHebrew: WordStudyStory = {
  args: {
    word: 'God',
    strongsNumber: 'H430',
  },
};

// Cross Reference Graph Stories
const graphMeta: Meta<typeof CrossReferenceGraph> = {
  title: 'Study Tools/Cross Reference Graph',
  component: CrossReferenceGraph,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    references: { control: 'object' },
    centerReference: { control: 'text' },
    onReferenceClick: { action: 'reference-clicked' },
  },
};

export const CrossReferenceDefault: StoryObj<typeof graphMeta> = {
  args: {
    references: sampleReferences,
    centerReference: 'john-3-16',
  },
};

// Commentary Sidebar Stories
const commentaryMeta: Meta<typeof CommentarySidebar> = {
  title: 'Study Tools/Commentary Sidebar',
  component: CommentarySidebar,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    onToggle: { action: 'toggled' },
    commentaries: { control: 'object' },
    currentVerse: { control: 'text' },
    position: { control: 'select', options: ['left', 'right'] },
  },
};

export const CommentaryDefault: StoryObj<typeof commentaryMeta> = {
  args: {
    isOpen: true,
    commentaries: sampleCommentaries,
    currentVerse: 'John 3:16',
    position: 'right',
  },
};

export const CommentaryLeft: StoryObj<typeof commentaryMeta> = {
  args: {
    isOpen: true,
    commentaries: sampleCommentaries,
    currentVerse: 'John 3:16',
    position: 'left',
  },
};

// Original Language Tools Stories
const languageMeta: Meta<typeof OriginalLanguageTools> = {
  title: 'Study Tools/Original Language Tools',
  component: OriginalLanguageTools,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    verse: { control: 'text' },
    isOpen: { control: 'boolean' },
    onToggle: { action: 'toggled' },
  },
};

export const LanguageToolsDefault: StoryObj<typeof languageMeta> = {
  args: {
    verse: 'John 3:16',
    isOpen: true,
    greekText: sampleGreekText,
  },
};

export const LanguageToolsBoth: StoryObj<typeof languageMeta> = {
  args: {
    verse: 'Genesis 1:1',
    isOpen: true,
    hebrewText: {
      text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים',
      transliteration: 'bereshit bara elohim',
      pronunciation: 'be-ray-SHEET bah-RAH el-o-HEEM',
      morphology: 'Preposition, Noun, Verb, Noun',
      parsing: ['Preposition + Noun', 'Qal Perfect 3rd Masculine Singular', 'Noun Masculine Plural']
    },
    greekText: sampleGreekText,
  },
};