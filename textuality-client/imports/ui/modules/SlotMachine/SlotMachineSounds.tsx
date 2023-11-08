import React from 'react';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';

const SlotMachineSounds = ({
  slotMachine,
}: {
  slotMachine: SlotMachineWithHelpers;
}) => {
  const { status } = slotMachine;

  if (status === 'spinning')
    return <audio src="/casino/sounds/slots-spinning-loop.ogg" autoPlay loop />;
  if (status === 'win-normal')
    return <audio src="/casino/sounds/slots-win.ogg" autoPlay />;
  if (status === 'lose')
    return <audio src="/casino/sounds/slots-lose.ogg" autoPlay />;
  return null;
};

export default SlotMachineSounds;
