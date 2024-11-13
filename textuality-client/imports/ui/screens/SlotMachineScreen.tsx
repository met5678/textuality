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
  const slotMachines = useTracker(() =>
    SlotMachines.find({ code: slotMachineCode }).fetch(),
  );
  const slotMachine = slotMachines[0];

  if (isLoading() || !slotMachine) return 'Loading';

  // ROO HELP - error with skin as undefined, guessing before full load?
  return (
    <div
      style={{
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        position: 'absolute',
      }}
    >
      <SlotMachine slotMachine={slotMachine} skin={event.skin} />
    </div>
  );
};

export default SlotMachineScreen;
