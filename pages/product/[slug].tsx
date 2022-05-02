import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import Image from 'next/image';
import IProduct from '../../models/product';
import axios from 'axios';
import client from '../../utils/client';
import classes from '../../utils/classes';
import {
  Alert,
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { urlFor, urlForThumbnail } from '../../utils/image';
import { Store } from '../../utils/store';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const ProductScreen = ({
  product,
  error,
}: {
  product: IProduct;
  error: any;
}) => {
  const router = useRouter();
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const { enqueueSnackbar } = useSnackbar();

  const addToCartHandler = async () => {
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
    <Layout title={product?.title}>
      {error ? (
        <Alert severity='error'>{error}</Alert>
      ) : (
        <Box>
          <Box sx={classes.section}>
            <NextLink href='/' passHref>
              <Link>
                <Typography>back to result</Typography>
              </Link>
            </NextLink>
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Image
                src={urlFor(product?.image)}
                alt={product?.name}
                layout='responsive'
                width={340}
                height={340}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <List>
                <ListItem>
                  <Typography component='h1' variant='h1'>
                    {product?.name}
                  </Typography>
                </ListItem>
                <ListItem>Category: {product?.category}</ListItem>
                <ListItem>Brand: {product?.brand}</ListItem>
                <ListItem>
                  <Rating value={product?.rating} readOnly />
                  <Typography sx={classes.smallText}>
                    ({product?.numReviews} reviews)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>
                    Description:{' '}
                    {product!.description.length > 256
                      ? product?.description.slice(0, 256)
                      : product?.description}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>${product?.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product!.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      onClick={addToCartHandler}
                      fullWidth
                      variant='contained'
                    >
                      Add to cart
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  if (context.params) {
    let product;

    try {
      product = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: context.params.slug }
      );

      return {
        props: { product },
      };
    } catch (error: any) {
      return {
        props: { error },
      };
    }
  }

  return {
    notFound: true,
  };
};

export default ProductScreen;
