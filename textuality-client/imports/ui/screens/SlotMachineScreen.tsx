import React from 'react';
import { Event } from '/imports/schemas/event';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import SlotMachine from '../modules/SlotMachine/SlotMachine';

interface SlotMachineScreenProps {
  event: Partial<Event>;
  slotMachineCode: string;
}

const SlotMachineScreen = ({
  event,
  slotMachineCode,
}: SlotMachineScreenProps) => {
  useSubscribe('slotMachine.forCode', slotMachineCode);
  const slotMachines = useFind(() =>
    SlotMachines.find({ code: slotMachineCode }),
  );
  const slotMachine = slotMachines[0];

  return (
    <>
      <SlotMachine slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachineScreen;
