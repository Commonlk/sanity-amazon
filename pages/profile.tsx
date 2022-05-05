import React, { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Button, List, ListItem, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FieldValues, useForm } from 'react-hook-form';

import Form from '../components/Form';
import FormInput from '../components/FormInput';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { ActionType, Store } from '../utils/store';

const ProfileScreen = () => {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (!userInfo) router.push('/login');

    setValue('name', userInfo?.name);
    setValue('email', userInfo?.email);
  }, [userInfo, setValue, router]);

  const submitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }: FieldValues) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }

    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      dispatch({ type: ActionType.USER_LOGIN, payload: data });
      Cookies.set('userInfo', JSON.stringify(data), { sameSite: 'Strict' });
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (error) {
      console.log(error);

      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title="Profile">
      <Typography component="h1" variant="h1">
        Profile
      </Typography>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <List>
          <ListItem>
            <FormInput
              control={control}
              name="name"
              rules={{
                required: true,
                minLength: 2,
              }}
              inputProps={{ type: 'text' }}
              label="Name"
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
              control={control}
              name="email"
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              inputProps={{ type: 'text' }}
              label="Email"
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
              control={control}
              name="password"
              rules={{
                validate: (value: string) =>
                  value === '' || value.length > 5 || 'Password is more than 5',
              }}
              inputProps={{ type: 'password' }}
              label="Password"
              error={Boolean(errors.password)}
              helperText={
                errors.password ? 'Password length is more than 5' : ''
              }
            />
          </ListItem>
          <ListItem>
            <FormInput
              control={control}
              name="confirmPassword"
              rules={{
                validate: (value: string) =>
                  value === '' || value.length > 5 || 'Password is more than 5',
              }}
              inputProps={{ type: 'password' }}
              label="Confirm Password"
              error={Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword
                  ? 'Confirm Password length is more than 5'
                  : ''
              }
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Update
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ProfileScreen), { ssr: false });
