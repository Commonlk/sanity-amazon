import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import { urlForThumbnail } from '../utils/image';
import IProduct from '../models/product';

interface Props {
  product: IProduct;
  addToCartHandler: (product: IProduct) => void;
}

const ProductItem = ({ product, addToCartHandler }: Props) => {
  return (
    <Card sx={{ minHeight: 400 }}>
      <NextLink href={`/product/${product.slug.current}`} passHref>
        <CardActionArea>
          <CardMedia
            component='img'
            image={urlForThumbnail(product.image)}
            title={product.name}
          />
          <CardContent sx={{ minHeight: 150 }}>
            <Typography>{product.name}</Typography>
            <Typography>
              <Rating value={product?.rating} readOnly />
              <Typography>({product.numReviews} reviews)</Typography>
            </Typography>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>${product.price}</Typography>
        <Button
          size='small'
          color='primary'
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
