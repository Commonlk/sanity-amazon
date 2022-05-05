import React, { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useForm, FieldValues } from 'react-hook-form';
import { Button, Link, List, ListItem, Typography } from '@mui/material';

import Form from '../components/Form';
import Layout from '../components/Layout';
import { ActionType, Store } from '../utils/store';
import { getError } from '../utils/error';
import FormInput from '../components/FormInput';

const RegisterScreen = () => {
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

  const submitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }: FieldValues) => {
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });

      dispatch({ type: ActionType.USER_LOGIN, payload: data });

      Cookies.set('userInfo', JSON.stringify(data), { sameSite: 'strict' });
      router.push((redirect as string) || '/');
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title="Register">
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <FormInput
              name="name"
              control={control}
              rules={{
                required: true,
                minLength: 2,
              }}
              label="Name"
              inputProps={{ type: 'name' }}
              error={Boolean(errors.name)}
              helperText={
                errors.name
                  ? errors.name.type === 'minLength'
                    ? 'Name length is more than 1'
                    : 'Name is required'
                  : ''
              }
            />
          </ListItem>
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
            <FormInput
              name="confirmPassword"
              control={control}
              rules={{
                required: true,
                minLength: 6,
              }}
              label="Confirm Password"
              inputProps={{ type: 'password' }}
              error={Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword
                  ? errors.confirmPassword.type === 'minLength'
                    ? 'Confirm Password length is more than 5'
                    : 'Confirm Password is required'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account?{' '}
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
};

export default RegisterScreen;
