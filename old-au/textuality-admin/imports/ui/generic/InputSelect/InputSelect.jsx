import React from 'react';
import autobind from 'autobind-decorator';
import Select from 'react-select';

const InputSelect = ({
  value,
  options,
  multi,
  clearable,
  disabled,
  className,
  onChange
}) => {
  options = options.map(opt => {
    if (typeof opt === 'number') return { value: opt, label: String(opt) };
    if (typeof opt === 'string') return { value: opt, label: opt };
    return opt;
  });

  if (multi) {
    value = options.filter(
      opt => Array.isArray(value) && value.includes(opt.value)
    );
  } else {
    value = options.find(opt => opt.value === value);
  }

  return (
    <Select
      className={className}
      value={value}
      options={options}
      onChange={val =>
        multi ? onChange(val.map(obj => obj.value)) : onChange(val.value)
      }
      isMulti={multi}
      isDisabled={disabled}
      isClearable={clearable}
    />
  );
};

export default InputSelect;
