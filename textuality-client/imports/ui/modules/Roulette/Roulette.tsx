import React from 'react';
import { Roulette } from '/imports/schemas/roulette';

interface RouletteProps {
  roulette: Partial<Roulette>;
}

const Roulette = ({ roulette }: RouletteProps) => {
  const {
    event,
    cost,
    bets_start_at,
    spin_starts_at,
    spin_ends_at,
    result,
    status,
  } = roulette;

  return (
    <>
      <h2>Roulette!</h2>
      <dl>
        <dt>Cost</dt>
        <dd>{cost}</dd>

        <dt>Status</dt>
        <dd>{status}</dd>
      </dl>
    </>
  );
};

export default Roulette;
