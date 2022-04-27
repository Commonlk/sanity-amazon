import { Alert, CircularProgress, Grid, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import IProduct from '../models/product';
import client from '../utils/client';

const Home: NextPage = () => {
  const [state, setState] = useState<{
    products?: IProduct[] | null;
    error?: string;
    loading: boolean;
  }>({
    products: null,
    error: '',
    loading: true,
  });

  const { loading, error, products } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products: IProduct[] = await client.fetch(
          `*[_type == "product"]`
        );
        setState({ products, loading: false });
      } catch (error: any) {
        setState({ loading: false, error: error.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Layout>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity='error'>{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {products!.map(product => (
              <Grid item md={4} key={product.slug}>
                <ProductItem product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Layout>
    </div>
  );
};

export default Home;
