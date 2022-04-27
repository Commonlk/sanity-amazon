import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import {
  Alert,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import IProduct from '../../models/product';
import client from '../../utils/client';
import classes from '../../utils/classes';
import Image from 'next/image';
import { urlFor } from '../../utils/image';

const ProductScreen = (props: { slug: string }) => {
  const { slug } = props;
  const [state, setState] = useState<{
    product: IProduct | null;
    loading: boolean;
    error: string;
  }>({
    product: null,
    loading: true,
    error: '',
  });

  const { product, loading, error } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]`,
          { slug }
        );
        setState({ ...state, product, loading: false });
      } catch (error: any) {
        setState({ ...state, error: error.message, loading: false });
      }
    };
    fetchData();
  }, [setState, slug, state]);

  return (
    <Layout title={product?.title}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
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
            <Grid md={3} xs={12}>
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
                          $
                          {product!.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button fullWidth variant='contained'>
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
    return {
      props: { slug: context.params.slug },
    };
  }

  return {
    notFound: true,
  };
};

export default ProductScreen;
