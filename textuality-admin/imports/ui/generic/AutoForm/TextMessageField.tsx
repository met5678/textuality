import React from 'react';
import { TextField } from '@mui/material';
import { HTMLFieldProps, connectField } from 'uniforms';

type TextMessageInputProps = HTMLFieldProps<string, HTMLAnchorElement>;

const TextMessageInput = ({
  label,
  onChange,
  required,
  value,
  disabled,
}: TextMessageInputProps) => {
  return (
    <TextField
      label={label}
      required={required}
      multiline
      minRows={3}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      helperText={(value?.length ?? '0') + ' '}
      fullWidth
    />
  );
};

export default connectField(TextMessageInput);
