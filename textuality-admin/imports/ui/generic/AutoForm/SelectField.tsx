import React from 'react';
import { HTMLFieldProps, connectField } from 'uniforms';
import InputSelect from '../InputSelect';

interface SelectFieldProps extends HTMLFieldProps<string, HTMLDivElement> {
  options: string[];
  label?: string;
  creatable: boolean;
}

const SelectField = ({
  label,
  onChange,
  value = '',
  disabled,
  options,
  creatable = false,
}: SelectFieldProps) => {
  return (
    <InputSelect
      multi={false}
      value={value}
      creatable={creatable}
      options={options}
      onChange={(val: string | null) => onChange(val ?? '')}
      label={label}
      disabled={disabled}
    />
  );
};

export default connectField<SelectFieldProps>(SelectField, { kind: 'leaf' });
