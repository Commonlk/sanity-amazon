import React, { useContext, useEffect } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Form from '../components/Form';
import Layout from '../components/Layout';
import FormInput from '../components/FormInput';
import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Store } from '../utils/store';
import Cookies from 'js-cookie';

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

    const { address, city, country, fullName, postalCode } = shippingAddress;

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
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { address, city, country, fullName, postalCode },
    });

    Cookies.set(
      'shippingAddress',
      JSON.stringify({ address, city, country, fullName, postalCode })
    );

    router.push('/payment');
  };

  return (
    <Layout title='Shipping Address'>
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='fullName'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='fullName'
                  label='Full Name'
                  inputProps={{ type: 'fullName' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Full Name length is more than 1'
                        : 'Full Name is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <FormInput
              control={control}
              name='address'
              label='Address'
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
              name='city'
              label='City'
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
              name='postalCode'
              label='Postal Code'
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
              name='country'
              label='Country'
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
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Continue
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
};

export default ShippingScreen;
