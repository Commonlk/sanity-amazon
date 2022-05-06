import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ClientError } from '@sanity/client';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/product';
import classes from '../utils/classes';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { ActionType, Store } from '../utils/store';

interface State {
  categories?: [];
  products?: Product[];
  error?: string;
  loading?: boolean;
}

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $100',
    value: '201-1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

const SearchScreen = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    category = 'all',
    query = 'all',
    price = 'all',
    rating = 'all',
    sort = 'default',
  } = router.query;

  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const [state, setState] = useState<State>({
    categories: [],
    products: [],
    error: '',
    loading: true,
  });

  const { loading, products, error } = state;
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (error) {
        console.log((error as AxiosError).message);
      }
    };
    fetchCategories();

    const fetchData = async () => {
      try {
        let gQuery = '*[_type == "product"';
        if (category !== 'all') {
          gQuery += ` && category match "${category}" `;
        }
        if (query !== 'all') {
          gQuery += ` && name match "${query}" `;
        }
        if (price !== 'all') {
          const minPrice = Number((price as string).split('-')[0]);
          const maxPrice = Number((price as string).split('-')[1]);
          gQuery += ` && price >= ${minPrice} && price <= ${maxPrice}`;
        }
        if (rating !== 'all') {
          gQuery += ` && rating >= ${Number(rating)} `;
        }
        let order = '';
        if (sort !== 'default') {
          if (sort === 'lowest') order = '| order(price asc)';
          if (sort === 'highest') order = '| order(price desc)';
          if (sort === 'toprated') order = '| order(rating desc)';
        }

        gQuery += `] ${order}`;
        setState({ loading: true });

        const products = await client.fetch(gQuery);
        setState({ products, loading: false });
      } catch (error) {
        setState({ error: (error as ClientError).message, loading: false });
      }
    };
    fetchData();
  }, [category, price, query, rating, sort]);

  const filterSearch = ({
    category,
    sort,
    searchQuery,
    price,
    rating,
  }: {
    category?: string;
    sort?: string;
    searchQuery?: string;
    price?: string;
    rating?: string;
  }) => {
    const path = router.pathname;
    const { query } = router;

    if (searchQuery) query.searchQuery = searchQuery;
    if (category) query.category = category;
    if (sort) query.sort = sort;
    if (price) query.price = price;
    if (rating) query.rating = rating;

    router.push({ pathname: path, query: query });
  };

  const categoryHandler = (e: SelectChangeEvent<string | string[]>) => {
    filterSearch({ category: e.target.value as string });
  };

  const sortHandler = (e: SelectChangeEvent<string | string[]>) => {
    filterSearch({ sort: e.target.value as string });
  };

  const priceHandler = (e: SelectChangeEvent<string | string[]>) => {
    filterSearch({ price: e.target.value as string });
  };

  const ratingHandler = (e: SelectChangeEvent<string | string[]>) => {
    filterSearch({ rating: e.target.value as string });
  };

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
    <Layout title="Search">
      <Grid sx={classes.section} container spacing={2}>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select fullWidth value={price} onChange={priceHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {prices.map(price => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Ratings</Typography>
                <Select fullWidth value={rating} onChange={ratingHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {ratings.map(rating => (
                    <MenuItem key={rating} value={rating}>
                      <Rating value={rating} readOnly />
                      <Typography component="span"> &amp; Up</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {products && products.length !== 0 ? products.length : 'No'}{' '}
              Results
            </Grid>
            {query !== 'all' && query !== '' && ' : ' + query}
            {price !== 'all' && ' : Price ' + price}
            {(query !== 'all' && ' : Rating ' + rating + ' & up') ||
            (rating !== 'all' && query !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button onClick={() => router.push('/search')}>X</Button>
            ) : null}
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography component="span" sx={classes.sort}>
                Sort By
              </Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
                <MenuItem value="toprated">Customer Reviews</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid sx={classes.section} container spacing={3}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Grid container spacing={3}>
                {products?.map(product => (
                  <Grid item md={4} key={product.name}>
                    <ProductItem
                      product={product}
                      addToCartHandler={addToCartHandler}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SearchScreen;
