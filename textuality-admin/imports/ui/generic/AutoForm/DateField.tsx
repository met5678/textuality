import TextField, { TextFieldProps } from '@mui/material/TextField';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import React from 'react';
import { FieldProps, connectField, filterDOMProps } from 'uniforms';
import { DateTime } from 'luxon';

export type DateFieldProps = FieldProps<Date | null, TextFieldProps>;

function Date({
  disabled,
  error,
  errorMessage,
  helperText,
  InputLabelProps,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  readOnly,
  showInlineError,
  value,
  type = 'datetime-local',
}: DateFieldProps) {
  const handleChange = (newValue: DateTime | null) => {
    if (newValue) onChange(newValue.toJSDate());
    else onChange(null);
  };

  return (
    <DateTimePicker
      disabled={disabled}
      label={label}
      onChange={handleChange}
      value={value ? DateTime.fromJSDate(value) : null}
    />
  );
}

export default connectField<DateFieldProps>(Date, { kind: 'leaf' });
