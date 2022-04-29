import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Form from '../components/Form';
import Layout from '../components/Layout';
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Store } from '../utils/store';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { dispatch, state } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, [router, shippingAddress.address]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };

  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <Form onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='Payment Method'
                name='paymentMethod'
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label='Paypal'
                  value='Paypal'
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label='Sripe'
                  value='Sripe'
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label='Cash'
                  value='Cash'
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type='submit' variant='contained' color='primary'>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type='button'
              variant='contained'
              color='secondary'
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
};

export default PaymentScreen;
