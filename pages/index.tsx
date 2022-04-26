import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Sanity Amazon</title>
        <meta
          name='description'
          content='A ecommerce website created with nextjs and sanity'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Typography component='h1' variant='h1'>
        Sanity Amazon
      </Typography>
    </div>
  );
};

export default Home;
