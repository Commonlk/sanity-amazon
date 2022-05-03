import React, { useContext, useEffect, useReducer } from 'react';
import Order from '../../models/order';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import classes from '../../utils/classes';
import Image from 'next/image';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import {
  Alert,
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
import { Store } from '../../utils/store';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';

enum ActionType {
  REQUEST = 'FETCH_REQUEST',
  SUCCESS = 'FETCH_SUCCESS',
  FAIL = 'FETCH_FAIL',
}

interface Props {
  params: any;
}

interface State {
  order: Order;
  error: string;
  loading: boolean;
}

interface Action {
  type: ActionType;
  payload?: any;
}

const reducer = (state: State, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.REQUEST: {
      return { ...state, loading: true, error: '' };
    }
    case ActionType.SUCCESS: {
      return { ...state, loading: false, order: payload, error: '' };
    }
    case ActionType.FAIL: {
      return { ...state, loading: false, error: payload };
    }
    default: {
      return { ...state };
    }
  }
};

const OrderScreen = ({ params }: Props) => {
  const { id: orderId } = params;
  const router = useRouter();

  const [{ order, loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  const {
    state: { userInfo },
  } = useContext(Store);

  const {
    deliveredAt,
    isDelivered,
    isPaid,
    itemsPrice,
    orderItems,
    paidAt,
    paymentMethod,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
  }: Order = order;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
      return;
    }
    const fetchOrder = async () => {
      // dispatch({ type: ActionType.REQUEST });
      try {
        const { data } = await axios.get(`/api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: ActionType.SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ActionType.FAIL, payload: getError(error) });
      }
    };

    fetchOrder();
  }, [orderId, router, userInfo]);

  return (
    <Layout title={`Order ${orderId}`}>
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </ListItem>
                <ListItem>
                  Status:{' '}
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : 'not delivered'}
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
                  Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
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
                <ListItem>
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
                        {orderItems.map(item => (
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
                              <Typography>{item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                      <Typography align="right">${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Total: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${totalPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return { props: { params } };
};

export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
