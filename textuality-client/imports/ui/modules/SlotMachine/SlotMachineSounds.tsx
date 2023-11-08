import React, { useEffect, useState } from 'react';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';

const SlotMachineSounds = ({
  slotMachine,
}: {
  slotMachine: SlotMachineWithHelpers;
}) => {
  const { status } = slotMachine;
  const [spinOption, setSpinOption] = useState(1);
  useEffect(() => {
    setSpinOption(Math.round(Math.random()) + 1);
  }, [status]);

  if (status === 'spinning')
    return (
      <audio
        src={`/casino/sounds/slots-spinning-${spinOption}.ogg`}
        autoPlay
        loop
      />
    );
  if (status === 'win-normal')
    return <audio src="/casino/sounds/slots-win.ogg" autoPlay />;
  if (status === 'lose')
    return <audio src="/casino/sounds/slots-lose.ogg" autoPlay />;
  return null;
};

export default SlotMachineSounds;
