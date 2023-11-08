import React from 'react';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import SlotMachineSounds from './SlotMachineSounds';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';

interface SlotMachineProps {
  slotMachine: SlotMachineWithHelpers;
}

const SlotMachine = ({ slotMachine }: SlotMachineProps) => {
  const { name, cost, status, result, win_amount, player, stats } = slotMachine;

  return (
    <>
      <h2>Slot Machine!</h2>
      <dl>
        <dt>Name</dt>
        <dd>{name}</dd>

        <dt>Cost</dt>
        <dd>{cost}</dd>

        <dt>Status</dt>
        <dd>{status}</dd>

        <dt>Result</dt>
        <dd>{result?.join(' - ')}</dd>

        <dt>Win Amount</dt>
        <dd>{win_amount}</dd>

        <dt>Player</dt>
        <dd>{player?.alias}</dd>
        <dd>{player?.avatar_id}</dd>
        <dd>{player?.money}</dd>
        {player?.avatar_id && (
          <img
            src={getImageUrl(player?.avatar_id, {
              width: 100,
              height: 100,
              zoom: 1.2,
            })}
            alt="avatar"
          />
        )}

        <dt>Stats</dt>
        <dd>{stats.spin_count}</dd>
        <dd>{stats.profit}</dd>
      </dl>
      <SlotMachineSounds slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachine;
