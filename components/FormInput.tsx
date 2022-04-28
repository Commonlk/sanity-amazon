import { InputBaseComponentProps, TextField } from '@mui/material';
import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  control: any;
  error: boolean;
  rules?: UseControllerProps;
  inputProps: InputBaseComponentProps;
  helperText: React.ReactNode;
}

const FormInput = ({
  control,
  error,
  label,
  name,
  rules,
  inputProps,
  helperText,
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      rules={rules}
      render={({ field }) => (
        <TextField
          variant='outlined'
          fullWidth
          id={name}
          label={label}
          inputProps={inputProps}
          error={error}
          helperText={helperText}
          {...field}
        />
      )}
    />
  );
};

export default FormInput;
