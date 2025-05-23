// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // mavi
    },
    secondary: {
      main: '#6b7280', // gri
    },
    error: {
      main: '#ef4444', // kırmızı
    },
  },
});

export default theme;
