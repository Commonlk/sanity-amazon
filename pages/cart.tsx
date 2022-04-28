import NextLink from 'next/link';
import Layout from '../components/Layout';
import Image from 'next/image';
import ICartItem from '../models/cartItem';
import IProduct from '../models/product';
import dynamic from 'next/dynamic';
import axios from 'axios';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { Store } from '../utils/store';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const CartScreen = () => {
  const router = useRouter();
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const { enqueueSnackbar } = useSnackbar();

  const updateCartHandler = async (
    item: ICartItem,
    quantity: string | number
  ) => {
    const { data }: { data: IProduct } = await axios.get(
      `/api/products/${item?._key}`
    );

    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry. item is out of stock', {
        variant: 'error',
      });
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: item?._key,
        name: item?.name,
        countInStock: item?.countInStock,
        slug: item?.slug,
        price: item?.price,
        image: item.image,
        quantity,
      },
    });

    enqueueSnackbar(`${item?.name} updated in the cart`, {
      variant: 'success',
    });
  };

  const removeItemHandler = (item: ICartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  return (
    <Layout title='Shopping Cart'>
      <Typography component='h1' variant='h1'>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Box>
          <Typography>
            Cart is empty.{' '}
            <NextLink href='/' passHref>
              <Link>Go shopping</Link>
            </NextLink>
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Quantity</TableCell>
                    <TableCell align='right'>Price</TableCell>
                    <TableCell align='right'>Action</TableCell>
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
                      <TableCell width={250}>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align='right'>
                        <Select
                          value={item.quantity}
                          onChange={e =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map(
                            (x: any) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography>${item.price}</Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Button
                          variant='contained'
                          color='secondary'
                          onClick={() => removeItemHandler(item)}
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant='h2'>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={() => router.push('/shipping')}
                    fullWidth
                    color='primary'
                    variant='contained'
                  >
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
