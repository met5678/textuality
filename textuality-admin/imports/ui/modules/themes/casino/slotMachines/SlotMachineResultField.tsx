import React from 'react';
import { Box } from '@mui/material';
import { connectField } from 'uniforms';
import InputSelect from '/imports/ui/generic/InputSelect';
import {
  SlotMachineEmoji,
  SlotMachineEmojis,
  SlotMachineResult,
} from '/imports/schemas/slotMachine';

const SlotMachineResultField = ({
  value,
  onChange,
}: {
  value: SlotMachineResult;
  onChange: (newValue: SlotMachineResult) => void;
}) => {
  const setSlot = (slot: number, emoji: SlotMachineEmoji) => {
    const newValue: SlotMachineResult = [...value];
    newValue[slot] = emoji;
    onChange(newValue);
  };

  return (
    <Box>
      <InputSelect
        notFullWidth
        options={SlotMachineEmojis}
        value={value[0]}
        multi={false}
        disableClearable={true}
        onChange={(val: SlotMachineEmoji) => setSlot(0, val)}
      />
      <InputSelect
        notFullWidth
        options={SlotMachineEmojis}
        value={value[1]}
        multi={false}
        disableClearable={true}
        onChange={(val: SlotMachineEmoji) => setSlot(1, val)}
      />
      <InputSelect
        notFullWidth
        options={SlotMachineEmojis}
        value={value[2]}
        multi={false}
        disableClearable={true}
        onChange={(val: SlotMachineEmoji) => setSlot(2, val)}
      />
    </Box>
  );
};

export default connectField(SlotMachineResultField);
export { SlotMachineResultField as SlotMachineResultFieldRaw };
