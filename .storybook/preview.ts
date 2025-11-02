import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { designTheme } from '../src/design-system/theme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: designTheme,
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={designTheme}>
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;