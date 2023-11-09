import React from 'react';

import RouletteInstr from './RouletteInstr';
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
      <h2>
        R<span>o</span>u<span>l</span>e<span>t</span>t<span>e</span>
      </h2>
      <div className="rouletteTable">
        <div className="bettingArea">
          <div className="instructions">
            <RouletteInstr />
            <p>Minimum: {cost} BB</p>
          </div>
          <RouletteGrid />
        </div>

        <RouletteWheel />
      </div>
    </div>
  );
};

export default Roulette;
