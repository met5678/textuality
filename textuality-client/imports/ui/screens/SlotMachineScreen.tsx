import React from 'react';
import { Event } from '/imports/schemas/event';
import { useSubscribe, useFind, useTracker } from 'meteor/react-meteor-data';
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
  // const slotMachines = useFind(
  //   () => SlotMachines.find({}, { limit: 1, sort: { code: 1 } }),
  //   [],
  // );
  const slotMachines = useTracker(() =>
    SlotMachines.find({ code: slotMachineCode }).fetch(),
  );
  const slotMachine = slotMachines[0];
  console.log({ slotMachineCode, slotMachine });

  if (isLoading() || !slotMachine) return 'Loading';

  return (
    <>
      <SlotMachine slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachineScreen;
