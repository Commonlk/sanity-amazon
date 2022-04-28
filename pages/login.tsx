import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import Form from '../components/Form';
import Layout from '../components/Layout';

const LoginScreen = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }: FieldValues) => {};

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
