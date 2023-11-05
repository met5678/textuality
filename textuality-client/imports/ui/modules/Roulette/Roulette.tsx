import React from 'react';
import { Roulette } from '/imports/schemas/roulette';

interface RouletteProps {
  roulette: Roulette;
}

const Roulette = ({ roulette }: RouletteProps) => {
  const { event } = Roulette;

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

        <dt>Stats</dt>
        <dd>{stats.profit}</dd>
        <dd>{stats.spin_count}</dd>
      </dl>
    </>
  );
};

export default Roulette;
