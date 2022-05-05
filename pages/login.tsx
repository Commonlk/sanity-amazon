import React, { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useForm, FieldValues } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { Button, Link, List, ListItem, Typography } from '@mui/material';

import User from '../models/user';
import Layout from '../components/Layout';
import Form from '../components/Form';
import { ActionType, Store } from '../utils/store';
import { getError } from '../utils/error';
import FormInput from '../components/FormInput';

const LoginScreen = () => {
  const { dispatch, state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (userInfo) {
      router.push((redirect as string) || '/');
    }
  }, [router, userInfo, redirect]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async ({ email, password }: FieldValues) => {
    try {
      const { data }: { data: User } = await axios.post('/api/users/login', {
        email,
        password,
      });

      dispatch({ type: ActionType.USER_LOGIN, payload: data });

      Cookies.set('userInfo', JSON.stringify(data), { sameSite: 'Strict' });
      router.push((redirect as string) || '/');
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title="Login">
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <FormInput
              name="email"
              control={control}
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              label="Email"
              inputProps={{ type: 'email' }}
              error={Boolean(errors.email)}
              helperText={
                errors.email
                  ? errors.email.type === 'pattern'
                    ? 'Email is not valid'
                    : 'Email is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <FormInput
              name="password"
              control={control}
              rules={{
                required: true,
                minLength: 6,
              }}
              label="Password"
              inputProps={{ type: 'password' }}
              error={Boolean(errors.password)}
              helperText={
                errors.password
                  ? errors.password.type === 'minLength'
                    ? 'Password length is more than 5'
                    : 'Password is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Do not have an account?
            <NextLink
              href={`/register?redirect=${(redirect as string) || '/'}`}
              passHref
            >
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
};

export default LoginScreen;
