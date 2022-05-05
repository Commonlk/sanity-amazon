import React, { useContext, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';

import classes from '../utils/classes';
import dynamic from 'next/dynamic';
import { ActionType, Store } from '../utils/store';

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Layout = ({ title, description, children }: Props) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

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
    dispatch({
      type: darkMode ? ActionType.DARK_MODE_OFF : ActionType.DARK_MODE_ON,
    });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF', { sameSite: 'Strict' });
  };

  const loginMenuCloseHandler = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    redirect: string
  ) => {
    setAnchorEl(null);

    if (redirect) {
      router.push(redirect);
    }
  };

  const loginClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(e.currentTarget);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: ActionType.USER_LOGOUT });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippingAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Sanity Amazon` : 'Sanity Amazon'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <NextLink href="/" passHref>
                <Link>
                  <Typography sx={classes.brand}>Amazon</Typography>
                </Link>
              </NextLink>
            </Box>
            <Box>
              <Switch checked={darkMode} onChange={darkModeChangeHandler} />
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
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
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    sx={classes.navbarButton}
                    onClick={loginClickHandler}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={e => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>All rights reserved. Sanity Amazon</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
};

// export default Layout;
export default dynamic(() => Promise.resolve(Layout), { ssr: false });
