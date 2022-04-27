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

interface Props {
  product: any;
}

const ProductItem = ({ product }: Props) => {
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
        <Button size='small' color='primary'>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
