import React, { useContext, useEffect, useReducer } from 'react';
import NextLink from 'next/link';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import Layout from '../components/Layout';
import Order from '../models/order';
import { getError } from '../utils/error';
import { Store } from '../utils/store';

enum ActionType {
  FETCH_FAIL,
  FETCH_REQUEST,
  FETCH_SUCCESS,
}

type Action =
  | { type: ActionType.FETCH_FAIL; payload: string }
  | { type: ActionType.FETCH_REQUEST }
  | { type: ActionType.FETCH_SUCCESS; payload: Order[] };

interface State {
  error: string;
  loading: boolean;
  orders: Order[];
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.FETCH_REQUEST: {
      return { ...state, loading: true, error: '' };
    }
    case ActionType.FETCH_SUCCESS: {
      return { ...state, loading: false, orders: action.payload, error: '' };
    }
    case ActionType.FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }
    default: {
      return { ...state };
    }
  }
};

const initialState: State = {
  error: '',
  loading: true,
  orders: [],
};

const OrderHistoryScreen = () => {
  const [{ error, loading, orders }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const {
    state: { userInfo },
  } = useContext(Store);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchOrders = async () => {
      try {
        dispatch({ type: ActionType.FETCH_REQUEST });

        const { data } = await axios.get('/api/orders/history', {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: ActionType.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ActionType.FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchOrders();
  }, [userInfo, router]);

  return (
    <Layout title="Order History">
      <Typography component="h1" variant="h1">
        Order History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error"> {error}</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>TOTAL</TableCell>
                <TableCell>PAID</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    {order.isPaid
                      ? `paid at ${new Date(order.paidAt).toLocaleDateString()}`
                      : 'not paid'}
                  </TableCell>
                  <TableCell>
                    <NextLink href={`/order/${order._id}`} passHref>
                      <Button variant="contained">Details</Button>
                    </NextLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(OrderHistoryScreen), {
  ssr: false,
});
