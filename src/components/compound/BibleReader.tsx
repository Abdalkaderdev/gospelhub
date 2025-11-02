import React, { createContext, useContext, ReactNode } from 'react';
import { motion } from 'framer-motion';
import styled, { ThemeProvider } from 'styled-components';
import { designTheme } from '../../design-system/theme';
import { Card, Heading, Text, Stack } from '../../design-system/components';
import { useAnimations } from '../../hooks/useAnimations';
import { BibleVerse } from '../../types';

interface BibleReaderContextType {
  verses: BibleVerse[];
  currentBook: string;
  currentChapter: number;
  onVerseClick?: (verse: BibleVerse) => void;
}

const BibleReaderContext = createContext<BibleReaderContextType | null>(null);

const useBibleReader = () => {
  const context = useContext(BibleReaderContext);
  if (!context) {
    throw new Error('BibleReader compound components must be used within BibleReader');
  }
  return context;
};

const ReaderContainer = styled(motion.div)`
  width: 100%;
`;

const VerseContainer = styled(motion.div)`
  padding: ${props => props.theme.spacing.sm} 0;
  border-left: 3px solid transparent;
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  
  &:hover {
    border-left-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background};
  }
`;

const VerseNumber = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary};
  margin-right: ${props => props.theme.spacing.sm};
  min-width: 2rem;
  display: inline-block;
`;

interface BibleReaderProps {
  verses: BibleVerse[];
  currentBook: string;
  currentChapter: number;
  onVerseClick?: (verse: BibleVerse) => void;
  children: ReactNode;
}

const BibleReader: React.FC<BibleReaderProps> & {
  Header: typeof Header;
  Content: typeof Content;
  Verse: typeof Verse;
} = ({ verses, currentBook, currentChapter, onVerseClick, children }) => {
  const { stagger } = useAnimations();

  return (
    <ThemeProvider theme={designTheme}>
      <BibleReaderContext.Provider value={{ verses, currentBook, currentChapter, onVerseClick }}>
        <ReaderContainer
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {children}
        </ReaderContainer>
      </BibleReaderContext.Provider>
    </ThemeProvider>
  );
};

const Header: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { currentBook, currentChapter } = useBibleReader();
  const { slideDown } = useAnimations();

  return (
    <motion.div variants={slideDown}>
      <Card>
        <Stack gap="sm">
          <Heading level={2}>
            {currentBook} {currentChapter}
          </Heading>
          {children}
        </Stack>
      </Card>
    </motion.div>
  );
};

const Content: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { verses } = useBibleReader();
  const { stagger } = useAnimations();

  return (
    <motion.div variants={stagger}>
      <Card>
        <Stack gap="md">
          {children || verses.map((verse, index) => (
            <Verse key={verse.verse} verse={verse} index={index} />
          ))}
        </Stack>
      </Card>
    </motion.div>
  );
};

interface VerseProps {
  verse: BibleVerse;
  index: number;
  children?: ReactNode;
}

const Verse: React.FC<VerseProps> = ({ verse, index, children }) => {
  const { onVerseClick } = useBibleReader();
  const { slideUp } = useAnimations();

  const handleClick = () => {
    onVerseClick?.(verse);
  };

  return (
    <VerseContainer
      variants={slideUp}
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Stack direction="row" gap="sm" align="start">
        <VerseNumber>{verse.verse}</VerseNumber>
        <Text>
          {children || verse.text}
        </Text>
      </Stack>
    </VerseContainer>
  );
};

BibleReader.Header = Header;
BibleReader.Content = Content;
BibleReader.Verse = Verse;

export { BibleReader };