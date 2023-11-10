import React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { HTMLFieldProps, connectField } from 'uniforms';
import InputSelect from '../InputSelect';
import { SelectField } from 'uniforms-mui';

type SequenceFieldOption = {
  label: string;
  value: string;
};

type SequenceFieldInputProps = HTMLFieldProps<string[], HTMLInputElement> & {
  options: SequenceFieldOption[];
};

const SequenceField = ({
  label,
  options,
  onChange,
  value,
}: SequenceFieldInputProps) => {
  if (!Array.isArray(value)) value = [];

  return (
    <Paper variant="outlined">
      <Box display="flex" flexDirection="column" gap={1} p={1}>
        <Typography variant="body2">{label}</Typography>

        {value?.map((val, index) => {
          return (
            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
              <Box flexGrow={1}>
                <Select
                  value={val}
                  label={label}
                  onChange={(itemValue) => {
                    const newValue = [...value];
                    newValue[index] = itemValue.target.value as string;
                    onChange(newValue);
                  }}
                  size="small"
                  fullWidth={true}
                >
                  {options.map((option) => (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box flexShrink={0}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const newValue = [...value];
                    newValue.splice(index, 1);
                    onChange(newValue);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          );
        })}
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            onChange([...value, options[0].value]);
          }}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
};

export default connectField(SequenceField);
