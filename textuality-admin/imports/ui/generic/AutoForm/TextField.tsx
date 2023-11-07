import React from 'react';
import { TextField } from '@mui/material';
import { HTMLFieldProps, connectField } from 'uniforms';

type TextInputProps = HTMLFieldProps<string, HTMLAnchorElement> & {
  showCounter?: boolean;
};

const TextInput = ({
  label,
  onChange,
  required,
  value,
  disabled,
  showCounter,
}: TextInputProps) => {
  const helperText = showCounter ? (value?.length ?? '0') + ' ' : undefined;

  return (
    <TextField
      label={label}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      size="small"
      helperText={helperText}
      fullWidth
    />
  );
};

export default connectField(TextInput);
