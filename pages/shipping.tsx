import React, { useContext, useEffect } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FieldValues, useForm } from 'react-hook-form';
import { Button, List, ListItem, Typography } from '@mui/material';

import Layout from '../components/Layout';
import FormInput from '../components/FormInput';
import Form from '../components/Form';
import { ActionType, Store } from '../utils/store';

const ShippingScreen = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
    userInfo,
  } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
      return;
    }

    const { address, city, country, fullName, postalCode } =
      shippingAddress || {};

    setValue('fullName', fullName);
    setValue('address', address);
    setValue('city', city);
    setValue('postalCode', postalCode);
    setValue('country', country);
  }, [shippingAddress, router, setValue, userInfo]);

  const submitHandler = ({
    address,
    city,
    country,
    fullName,
    postalCode,
  }: FieldValues) => {
    dispatch({
      type: ActionType.SAVE_SHIPPING_ADDRESS,
      payload: { address, city, country, fullName, postalCode },
    });

    Cookies.set(
      'shippingAddress',
      JSON.stringify({ address, city, country, fullName, postalCode }),
      { sameSite: 'Strict' }
    );

    router.push('/payment');
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <FormInput
              name="fullName"
              control={control}
              rules={{
                required: true,
                minLength: 2,
              }}
              label="Full Name"
              inputProps={{ type: 'fullName' }}
              error={Boolean(errors.fullName)}
              helperText={
                errors.fullName
                  ? errors.fullName.type === 'minLength'
                    ? 'Full Name length is more than 1'
                    : 'Full Name is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <FormInput
              control={control}
              rules={{
                required: true,
                minLength: 2,
              }}
              name="address"
              label="Address"
              inputProps={{ type: 'address' }}
              error={Boolean(errors.address)}
              helperText={
                errors.address
                  ? errors.address.type === 'minLength'
                    ? 'Address length is more than 1'
                    : 'Address is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <FormInput
              control={control}
              rules={{
                required: true,
                minLength: 2,
              }}
              name="city"
              label="City"
              inputProps={{ type: 'city' }}
              error={Boolean(errors.city)}
              helperText={
                errors.city
                  ? errors.city.type === 'minLength'
                    ? 'City length is more than 1'
                    : 'City is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <FormInput
              control={control}
              rules={{
                required: true,
                minLength: 2,
              }}
              name="postalCode"
              label="Postal Code"
              inputProps={{ type: 'postalCode' }}
              error={Boolean(errors.postalCode)}
              helperText={
                errors.postalCode
                  ? errors.postalCode.type === 'minLength'
                    ? 'Postal Code length is more than 1'
                    : 'Postal Code is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <FormInput
              control={control}
              rules={{
                required: true,
                minLength: 2,
              }}
              name="country"
              label="Country"
              inputProps={{ type: 'country' }}
              error={Boolean(errors.country)}
              helperText={
                errors.country
                  ? errors.country.type === 'minLength'
                    ? 'Country length is more than 1'
                    : 'Country is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continue
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
};

export default ShippingScreen;
