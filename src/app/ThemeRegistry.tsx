'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { PropsWithChildren } from 'react';
import theme from './theme';

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
