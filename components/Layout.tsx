import {
  AppBar,
  Box,
  Container,
  createTheme,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import React from 'react';
import NextLink from 'next/link';

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Layout = ({ title, description, children }: Props) => {
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  return (
    <>
      <Head>
        <title>{title ? `${title} - Sanity Amazon` : 'Sanity Amazon'}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static'>
          <Toolbar>
            <NextLink href='/' passHref>
              <Link>
                <Typography>Amazon</Typography>
              </Link>
            </NextLink>
          </Toolbar>
        </AppBar>
        <Container component='main'>{children}</Container>
        <Box component='footer'>
          <Typography>All rights reserved. Sanity Amazon Clone</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Layout;
