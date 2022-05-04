import React, { useContext, useEffect, useReducer } from 'react';
import { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import axios from 'axios';
import {
  Alert,
  Box,
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

import Order from '../../models/order';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import { Store } from '../../utils/store';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';

enum ActionType {
  REQUEST = 'FETCH_REQUEST',
  SUCCESS = 'FETCH_SUCCESS',
  FAIL = 'FETCH_FAIL',
  PAY_REQUEST = 'PAY_REQUEST',
  PAY_SUCCESS = 'PAY_SUCCESS',
  PAY_FAIL = 'PAY_FAIL',
  PAY_RESET = 'PAY_RESET',
}

interface Props {
  params: { id: string };
}

interface State {
  order: Order | null;
  error: string;
  errorPay: string;
  loading: boolean;
  loadingPay: boolean;
  successPay: boolean;
}

type Action =
  | { type: ActionType.REQUEST }
  | { type: ActionType.SUCCESS; payload: Order }
  | { type: ActionType.FAIL; payload: string }
  | { type: ActionType.PAY_REQUEST }
  | { type: ActionType.PAY_SUCCESS }
  | { type: ActionType.PAY_FAIL; payload: string }
  | { type: ActionType.PAY_RESET };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.REQUEST: {
      return { ...state, loading: true, error: '' };
    }
    case ActionType.SUCCESS: {
      return { ...state, loading: false, order: action.payload, error: '' };
    }
    case ActionType.FAIL: {
      return { ...state, loading: false, error: action.payload };
    }
    case ActionType.PAY_REQUEST: {
      return { ...state, loadingPay: true };
    }
    case ActionType.PAY_SUCCESS: {
      return { ...state, loadingPay: false, successPay: true };
    }
    case ActionType.PAY_FAIL: {
      return { ...state, loadingPay: false, errorPay: action.payload };
    }
    case ActionType.PAY_RESET: {
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    }
    default: {
      return { ...state };
    }
  }
};

const initialState: State = {
  order: null,
  error: '',
  errorPay: '',
  loading: false,
  loadingPay: false,
  successPay: false,
};

const OrderScreen = ({ params }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id: orderId } = params;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();

  const [{ order, loading, error, successPay }, dispatch] = useReducer(
    reducer,
    initialState
  );
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
  } = order || {};

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      dispatch({ type: ActionType.REQUEST });
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: ActionType.SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ActionType.FAIL, payload: getError(error) });
      }
    };

    if (!order?._id || successPay || (order?._id && order?._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: ActionType.PAY_RESET });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'USD' },
        });
      };

      paypalDispatch({
        type: 'setLoadingStatus',
        value: SCRIPT_LOADING_STATE.PENDING,
      });
      loadPaypalScript();
    }
  }, [orderId, router, userInfo, successPay, order, paypalDispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createOrder = (data: Record<string, unknown>, actions: any) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID: string) => {
        return orderID;
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onApprove = (data: Record<string, unknown>, actions: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return actions.order.capture().then(async (details: any) => {
      try {
        dispatch({ type: ActionType.PAY_REQUEST });

        await axios.put(`/api/orders/${order?._id}/pay`, details, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });

        dispatch({ type: ActionType.PAY_SUCCESS });
        enqueueSnackbar('Order is paid', { variant: 'success' });
      } catch (err) {
        dispatch({ type: ActionType.PAY_FAIL, payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    });
  };

  const onError = (err: Record<string, unknown>) => {
    enqueueSnackbar(getError(err), { variant: 'error' });
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>
      {loading || !order ? (
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
                  {shippingAddress?.fullName}, {shippingAddress?.address},{' '}
                  {shippingAddress?.city}, {shippingAddress?.postalCode},{' '}
                  {shippingAddress?.country}
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
                        {orderItems?.map(item => (
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
                              <Typography>${item.price}</Typography>
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
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <Box sx={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </Box>
                    )}
                  </ListItem>
                )}
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
