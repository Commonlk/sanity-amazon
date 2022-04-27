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
import classes from '../utils/classes';

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Layout = ({ title, description, children }: Props) => {
  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'none',
        },
      },
    },
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
        <AppBar position='static' sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <NextLink href='/' passHref>
              <Link>
                <Typography sx={classes.brand}>Amazon</Typography>
              </Link>
            </NextLink>
          </Toolbar>
        </AppBar>
        <Container component='main' sx={classes.main}>
          {children}
        </Container>
        <Box component='footer' sx={classes.footer}>
          <Typography>All rights reserved. Sanity Amazon Clone</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Layout;