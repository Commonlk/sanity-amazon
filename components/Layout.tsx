import {
  AppBar,
  Badge,
  Box,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import React, { useContext } from 'react';
import NextLink from 'next/link';
import classes from '../utils/classes';
import { Store } from '../utils/store';
import Cookies from 'js-cookie';

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Layout = ({ title, description, children }: Props) => {
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart } = state;

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
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

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
            <Box display='flex' alignItems='center'>
              <NextLink href='/' passHref>
                <Link>
                  <Typography sx={classes.brand}>Amazon</Typography>
                </Link>
              </NextLink>
            </Box>
            <Box>
              <Switch checked={darkMode} onChange={darkModeChangeHandler} />
              <NextLink href='/cart' passHref>
                <Link>
                  <Typography component='span'>
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color='secondary'
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      'Cart'
                    )}
                  </Typography>
                </Link>
              </NextLink>
              <NextLink href='/login' passHref>
                <Link>Login</Link>
              </NextLink>
            </Box>
          </Toolbar>
        </AppBar>
        <Container component='main' sx={classes.main}>
          {children}
        </Container>
        <Box component='footer' sx={classes.footer}>
          <Typography>All rights reserved. Sanity Amazon</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Layout;
