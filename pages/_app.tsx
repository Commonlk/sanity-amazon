import React from 'react';
import type { AppProps } from 'next/app';
import createCache from '@emotion/cache';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { SnackbarProvider } from 'notistack';

import { StoreProvider } from '../utils/store';
import '../styles/globals.css';

const clientSideEmotionCache = createCache({ key: 'css' });

interface Props extends AppProps {
  emotionCache: EmotionCache;
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: Props) {
  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <StoreProvider>
          <PayPalScriptProvider
            deferLoading={true}
            options={{ 'client-id': 'test' }}
          >
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </StoreProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;
