import '../styles/globals.css';
import type { AppProps } from 'next/app';
import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { StoreProvider } from '../utils/store';
import { SnackbarProvider } from 'notistack';

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
          <Component {...pageProps} />
        </StoreProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;
