import React, { createContext, useContext, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { ThemeProvider } from 'styled-components';
import { Search, X, Loader } from 'lucide-react';
import { designTheme } from '../../design-system/theme';
import { Input, Button, Card, Text, Stack } from '../../design-system/components';
import { useAnimations } from '../../hooks/useAnimations';

interface SearchBoxContextType {
  query: string;
  setQuery: (query: string) => void;
  results: any[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSearch: (query: string) => void;
  onResultClick?: (result: any) => void;
}

const SearchBoxContext = createContext<SearchBoxContextType | null>(null);

const useSearchBox = () => {
  const context = useContext(SearchBoxContext);
  if (!context) {
    throw new Error('SearchBox compound components must be used within SearchBox');
  }
  return context;
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  width: 1rem;
  height: 1rem;
  pointer-events: none;
`;

const ClearButton = styled(Button)`
  position: absolute;
  right: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs};
  min-width: auto;
  height: auto;
`;

const StyledInput = styled(Input)`
  padding-left: ${props => props.theme.spacing.xl};
  padding-right: ${props => props.theme.spacing.xl};
`;

const ResultsContainer = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: ${props => props.theme.spacing.xs};
`;

const ResultItem = styled(motion.div)`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

interface SearchBoxProps {
  onSearch: (query: string) => void;
  results?: any[];
  isLoading?: boolean;
  placeholder?: string;
  onResultClick?: (result: any) => void;
  children: ReactNode;
}

const SearchBox: React.FC<SearchBoxProps> & {
  Input: typeof SearchInput;
  Results: typeof Results;
  Result: typeof Result;
  Loading: typeof Loading;
  Empty: typeof Empty;
} = ({ onSearch, results = [], isLoading = false, placeholder, onResultClick, children }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider theme={designTheme}>
      <SearchBoxContext.Provider value={{
        query,
        setQuery,
        results,
        isLoading,
        isOpen,
        setIsOpen,
        onSearch,
        onResultClick
      }}>
        <SearchContainer>
          {children}
        </SearchContainer>
      </SearchBoxContext.Provider>
    </ThemeProvider>
  );
};

const SearchInput: React.FC<{ placeholder?: string }> = ({ placeholder = 'Search...' }) => {
  const { query, setQuery, onSearch, isOpen, setIsOpen, isLoading } = useSearchBox();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    
    if (value.trim()) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <SearchInputContainer>
      <SearchIcon />
      <StyledInput
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => query && setIsOpen(true)}
      />
      {query && (
        <ClearButton variant="ghost" size="sm" onClick={handleClear}>
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </ClearButton>
      )}
    </SearchInputContainer>
  );
};

const Results: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { isOpen, results } = useSearchBox();
  const { slideDown } = useAnimations();

  return (
    <AnimatePresence>
      {isOpen && (
        <ResultsContainer
          variants={slideDown}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Card>
            {children || results.map((result, index) => (
              <Result key={index} result={result} index={index} />
            ))}
          </Card>
        </ResultsContainer>
      )}
    </AnimatePresence>
  );
};

interface ResultProps {
  result: any;
  index: number;
  children?: ReactNode;
}

const Result: React.FC<ResultProps> = ({ result, index, children }) => {
  const { onResultClick, setIsOpen, setQuery } = useSearchBox();
  const { slideUp } = useAnimations();

  const handleClick = () => {
    onResultClick?.(result);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <ResultItem
      variants={slideUp}
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {children || (
        <Stack gap="xs">
          <Text variant="subtitle">
            {result.book} {result.chapter}:{result.verse}
          </Text>
          <Text variant="caption" color="secondary">
            {result.text}
          </Text>
        </Stack>
      )}
    </ResultItem>
  );
};

const Loading: React.FC = () => {
  const { isLoading } = useSearchBox();

  if (!isLoading) return null;

  return (
    <ResultItem
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Stack direction="row" align="center" gap="sm">
        <Loader className="w-4 h-4 animate-spin" />
        <Text variant="caption" color="secondary">
          Searching...
        </Text>
      </Stack>
    </ResultItem>
  );
};

const Empty: React.FC<{ message?: string }> = ({ message = 'No results found' }) => {
  const { results, isLoading, query } = useSearchBox();

  if (isLoading || results.length > 0 || !query) return null;

  return (
    <ResultItem
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Text variant="caption" color="secondary">
        {message}
      </Text>
    </ResultItem>
  );
};

SearchBox.Input = SearchInput;
SearchBox.Results = Results;
SearchBox.Result = Result;
SearchBox.Loading = Loading;
SearchBox.Empty = Empty;

export { SearchBox };