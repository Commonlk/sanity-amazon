import React, { useContext } from 'react';
import axios from 'axios';
import { Alert, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import type { GetServerSideProps } from 'next';
import { ServerError } from '@sanity/client';

import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/product';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { ActionType, Store } from '../utils/store';

interface Props {
  products: Product[];
  error: ServerError;
}

const Home = ({ products, error }: Props) => {
  const router = useRouter();
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const { enqueueSnackbar } = useSnackbar();

  const addToCartHandler = async (product: Product) => {
    const existItem = cart.cartItems.find(x => x._key === product?._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data }: { data: Product } = await axios.get(
      `/api/products/${product?._id}`
    );

    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }

    dispatch({
      type: ActionType.CART_ADD_ITEM,
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
        {error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <Grid container spacing={3}>
            {products?.map(product => (
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

export const getServerSideProps: GetServerSideProps = async () => {
  let products: Product[];

  try {
    products = await client.fetch(`*[_type == "product"]`);

    return {
      props: { products },
    };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

export default Home;
