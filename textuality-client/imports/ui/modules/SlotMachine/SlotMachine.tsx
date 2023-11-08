import React from 'react';
import { SlotMachine as SlotMachineType } from '/imports/schemas/slotMachine';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

interface SlotMachineProps {
  slotMachine: SlotMachineType;
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
    </>
  );
};

export default SlotMachine;
