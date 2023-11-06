import React from 'react';
import { HTMLFieldProps, connectField } from 'uniforms';
import InputSelect from '../InputSelect';

interface TagsFieldProps extends HTMLFieldProps<string[], HTMLDivElement> {
  options: string[];
  label?: string;
}

const TagsField = ({
  label,
  onChange,
  required,
  value = [],
  disabled,
  options,
}: TagsFieldProps) => {
  return (
    <InputSelect
      multi={true}
      value={value}
      creatable={true}
      options={options}
      onChange={onChange}
      label={label}
      disabled={disabled}
    />
  );
};

export default connectField(TagsField);
