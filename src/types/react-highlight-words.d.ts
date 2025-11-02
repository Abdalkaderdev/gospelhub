declare module 'react-highlight-words' {
  import { ComponentType } from 'react';

  interface HighlighterProps {
    highlightClassName?: string;
    searchWords: string[];
    autoEscape?: boolean;
    textToHighlight: string;
    className?: string;
    style?: React.CSSProperties;
  }

  const Highlighter: ComponentType<HighlighterProps>;
  export default Highlighter;
}