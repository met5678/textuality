import React from 'react';
import { TextField } from '@mui/material';
import { HTMLFieldProps, connectField } from 'uniforms';

type TextInputProps = HTMLFieldProps<string, HTMLAnchorElement>;

const TextInput = ({
  label,
  onChange,
  required,
  value,
  disabled,
}: TextInputProps) => {
  return (
    <TextField
      label={label}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      size="small"
      helperText={(value?.length ?? '0') + ' '}
      fullWidth
    />
  );
};

export default connectField(TextInput);
