import { Box, Typography, Grid, Slider, Input } from '@mui/material';
import React from 'react';

interface InputSliderProps {
  value: number;
  label: string;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
}

export default function InputSlider({
  value,
  label,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: InputSliderProps) {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  return (
    <Box display="flex" flexDirection="row" gap={2}>
      <Box flexShrink={0}>
        <Typography id="input-slider">{label}</Typography>
      </Box>
      <Box flexGrow={1}>
        <Slider
          value={typeof value === 'number' ? value : min}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          min={min}
          max={max}
          step={step}
        />
      </Box>
      <Box flexBasis={100} flexGrow={0}>
        <Input
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step,
            min,
            max,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
      </Box>
    </Box>
  );
}
