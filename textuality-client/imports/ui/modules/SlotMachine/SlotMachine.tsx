import React from 'react';
import { SlotMachine as SlotMachineType } from '/imports/schemas/slotMachine';

interface SlotMachineProps {
  slotMachine: SlotMachineType;
}

const SlotMachine = ({ slotMachine }: SlotMachineProps) => {
  const {
    name,
    cost,
    status,
    result,
    win_amount,
    player,
    player_queue,
    stats,
  } = slotMachine;

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

        <dt>Player Queue</dt>
        <dd>{player_queue.length}</dd>
      </dl>
    </>
  );
};

export default SlotMachine;
