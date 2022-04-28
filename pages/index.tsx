import { Alert, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import IProduct from '../models/product';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/store';

const Home: NextPage = () => {
  const router = useRouter();
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const { enqueueSnackbar } = useSnackbar();

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

  const addToCartHandler = async (product: IProduct) => {
    const existItem = cart.cartItems.find(x => x._key === product?._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data }: { data: IProduct } = await axios.get(
      `/api/products/${product?._id}`
    );

    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product?._id,
        name: product?.name,
        countInStock: product?.countInStock,
        slug: product?.slug.current,
        price: product?.price,
        image: urlForThumbnail(product?.image),
        quantity,
      },
    });

    enqueueSnackbar(`${product?.name} added to the cart`, {
      variant: 'success',
    });

    router.push('/cart');
  };

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
              <Grid item md={4} key={product.slug.current}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Layout>
    </div>
  );
};

export default Home;
