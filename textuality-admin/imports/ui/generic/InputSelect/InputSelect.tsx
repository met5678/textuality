import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface InputSelectPropsCommon {
  options: string[];
  multi?: boolean;
  creatable?: boolean;
  disabled?: boolean;
  disableClearable?: boolean;
  label?: string;
}

interface InputSelectPropsSingle extends InputSelectPropsCommon {
  multi: false;
  value: string | null;
  onChange: (val: string | null) => void;
}

interface InputSelectPropsMulti extends InputSelectPropsCommon {
  multi: true;
  value: string[];
  onChange: (val: string[]) => void;
}

type InputSelectProps = InputSelectPropsMulti | InputSelectPropsSingle;

const InputSelect = ({
  value,
  options,
  multi,
  creatable,
  disabled,
  disableClearable,
  onChange,
  label,
}: InputSelectProps) => {
  const handleChange = (e: any, newVal: string | string[] | null) => {
    if (newVal === null) {
      if (multi) onChange([]);
      else onChange(null);
      return;
    }

    if (multi && Array.isArray(newVal)) onChange(newVal);
    else if (!multi && typeof newVal === 'string') onChange(newVal);
  };

  return (
    <Autocomplete
      multiple={multi}
      freeSolo={creatable}
      disableClearable={disableClearable}
      value={value}
      options={options}
      disabled={disabled}
      clearOnBlur={multi && creatable}
      selectOnFocus={creatable}
      onChange={handleChange}
      autoSelect={creatable}
      size="small"
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={label} />
      )}
    />
  );
};

export default InputSelect;
