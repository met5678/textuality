import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { HTMLFieldProps, connectField } from 'uniforms';
import {
  SlotMachineEmojis,
  SlotMachineOdds,
} from '/imports/schemas/slotMachine';
import InputSlider from '/imports/ui/generic/InputSlider/InputSlider';
import { SlotMachineResultFieldRaw as SlotMachineResultField } from './SlotMachineResultField';

type SlotMachineOddsInputProps = HTMLFieldProps<
  SlotMachineOdds[],
  HTMLInputElement
>;

const SlotMachineOddsSingleField = ({
  value,
  onChange,
}: {
  value: SlotMachineOdds;
  onChange: (newValue: SlotMachineOdds) => void;
}) => {
  return (
    <Box display="flex" flexDirection="row" gap={2} alignItems="center">
      <SlotMachineResultField
        value={value.result}
        onChange={(val) => onChange({ ...value, result: val })}
      />
      <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
        <InputSlider
          value={value.payout_multiplier}
          label="Payout"
          min={-1}
          max={20}
          step={1}
          onChange={(val) => onChange({ ...value, payout_multiplier: val })}
        />
        <InputSlider
          value={Math.round(value.odds * 100)}
          label="Odds"
          min={0}
          max={100}
          step={1}
          onChange={(val) => onChange({ ...value, odds: val / 100 })}
        />
      </Box>
    </Box>
  );
};

const SlotMachineOddsField = ({
  label,
  onChange,
  value,
}: SlotMachineOddsInputProps) => {
  if (!value) value = [];

  const expectedReturn =
    Math.round(
      value.reduce((acc, cur) => {
        return acc + cur.odds * cur.payout_multiplier;
      }, 0) * 100,
    ) / 100;

  return (
    <Paper variant="outlined">
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="body2">{label}</Typography>
        {value?.map((odds, index) => (
          <Box display="flex" flexDirection="row" gap={2} alignItems="center">
            <Box flexGrow={1}>
              <SlotMachineOddsSingleField
                key={index}
                value={odds}
                onChange={(val) => {
                  const newValue = [...value];
                  newValue[index] = val;
                  onChange(newValue);
                }}
              />
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
        ))}
        <Button
          fullWidth
          variant="contained"
          onClick={() =>
            onChange([
              ...value,
              {
                result: [
                  SlotMachineEmojis[0],
                  SlotMachineEmojis[0],
                  SlotMachineEmojis[0],
                ],
                payout_multiplier: 1,
                odds: 0,
              },
            ])
          }
        >
          Add
        </Button>
        <Typography variant="caption">
          Expected return: <strong>{expectedReturn}</strong>
        </Typography>
      </Box>
    </Paper>
  );
};

export default connectField(SlotMachineOddsField);
