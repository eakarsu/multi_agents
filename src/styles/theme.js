import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6750A4',
      light: '#EADDFF',
      dark: '#4F378B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#E8DEF8',
      dark: '#4A4458',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#7D5260',
      light: '#FFD8E4',
      dark: '#633B48',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FEF7FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D1B20',
      secondary: '#49454F',
    },
    divider: '#79747E',
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Inter, Roboto, sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Inter, Roboto, sans-serif',
      fontWeight: 600,
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Inter, Roboto, sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: 'Inter, Roboto, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'Inter, Roboto, sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: 'Inter, Roboto, sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          fontWeight: 500,
          padding: '12px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(103, 80, 164, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(103, 80, 164, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.16), 0 4px 6px rgba(0, 0, 0, 0.23)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px',
          paddingLeft: '16px',
          paddingRight: '16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FEF7FF',
          color: '#1D1B20',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;