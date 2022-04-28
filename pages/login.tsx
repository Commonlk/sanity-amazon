import React, { useContext, useEffect } from 'react';
import Form from '../components/Form';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import axios from 'axios';
import jsCookie from 'js-cookie';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { Store } from '../utils/store';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';

const LoginScreen = () => {
  const { dispatch, state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [router, userInfo]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async ({ email, password }: FieldValues) => {
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });

      jsCookie.set('userInfo', JSON.stringify(data));
      router.push('/');
    } catch (error: any) {
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Login'>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='email'
                  label='Email'
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='password'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='password'
                  label='Password'
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Do not have an account?
            <NextLink href='/register' passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
};

export default LoginScreen;
