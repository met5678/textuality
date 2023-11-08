import React from 'react';

import RouletteWheel from './RouletteWheel';

import { Roulette } from '/imports/schemas/roulette';
import './Roulette.css';
import RouletteGrid from './RouletteGrid';

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
    <div className="roulette">
      <h2>Roulette!</h2>
      <div className="rouletteTable">
        <div className="bettingArea">
          <div className="instructions">
            <p>Text # to place your bet</p>
            <p>Cost: {cost}</p>
          </div>
          <RouletteGrid />
        </div>

        <RouletteWheel />
      </div>
    </div>
  );
};

export default Roulette;
