import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import NextLink from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import classes from '../utils/classes';
import Layout from '../components/Layout';
import { ActionType, Store } from '../utils/store';
import { getError } from '../utils/error';

const PlaceOrderScreen = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { state, dispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod, cartItems },
    userInfo,
  } = state;

  const { address, city, country, fullName, postalCode } =
    shippingAddress || {};

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (!paymentMethod) {
        router.push('/payment');
        return;
      }
    }

    return () => {
      isMounted = false;
    };
  }, [cartItems.length, paymentMethod, router]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems.map(x => ({
            ...x,
            countInStock: undefined,
            slug: undefined,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      setLoading(false);
      dispatch({ type: ActionType.CART_CLEAR });
      Cookies.remove('cartItems');
      router.push(`/order/${data}`);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Place Order
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {fullName}, {address}, {city}, {postalCode}, {country}
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => router.push('/shipping')}
                  variant="contained"
                  color="secondary"
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
              <ListItem>
                <Button
                  onClick={() => router.push('/payment')}
                  variant="contained"
                  color="secondary"
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Order Items
                </Typography>
              </ListItem>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map(item => (
                      <TableRow key={item._key}>
                        <TableCell>
                          <NextLink href={`/product/${item.slug}`} passHref>
                            <Link>
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              />
                            </Link>
                          </NextLink>
                        </TableCell>
                        <TableCell>
                          <NextLink href={`/product/${item.slug}`} passHref>
                            <Link>
                              <Typography>{item.name}</Typography>
                            </Link>
                          </NextLink>
                        </TableCell>
                        <TableCell align="right">
                          <Typography>{item.quantity}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography>$ {item.price}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <ListItem>
                <Button
                  onClick={() => router.push('/payment')}
                  variant="contained"
                  color="secondary"
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Total: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">$ {totalPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
