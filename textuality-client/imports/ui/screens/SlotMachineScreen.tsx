import React from 'react';
import { Event } from '/imports/schemas/event';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import SlotMachine from '../modules/SlotMachine/SlotMachine';
import SlotMachines from '/imports/api/themes/casino/slotMachines';

interface SlotMachineScreenProps {
  event: Partial<Event>;
  slotMachineCode: string;
}

const SlotMachineScreen = ({
  event,
  slotMachineCode,
}: SlotMachineScreenProps) => {
  const isLoading = useSubscribe('slotMachines.forCode', slotMachineCode);
  const slotMachines = useFind(() => SlotMachines.find());
  const slotMachine = slotMachines[0];
  console.log({ slotMachineCode, slotMachine });

  if (isLoading()) return 'Loading';

  return (
    <>
      <SlotMachine slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachineScreen;
