import React, { ReactNode } from 'react';

import RouletteInstr from './RouletteInstr';
import RouletteWheel from './RouletteWheel';

import { Roulette, RouletteStatus } from '/imports/schemas/roulette';
import './Roulette.css';
import RouletteGrid from './RouletteGrid';
import Countdown from 'react-countdown';
import { DateTime } from 'luxon';
import RouletteSounds from './RouletteSounds';
import { RouletteWithHelpers } from '/imports/api/themes/casino/roulettes/roulettes';
import CasinoLeaderboard from '../CasinoLeaderboard/CasinoLeaderboard';
import RouletteWheelDisplay from './RouletteWheelDisplay';

interface RouletteProps {
  roulette: Partial<RouletteWithHelpers>;
}

const Roulette = ({ roulette }: RouletteProps) => {
  const {
    event,
    minimum_bet,
    bets_start_at,
    spin_starts_at,
    bets_open,
    bets_cutoff_seconds,
    spin_seconds,

    result,
    status,
  } = roulette;

  let betsEndTime = null;
  if (bets_open && spin_starts_at) {
    betsEndTime = DateTime.fromJSDate(spin_starts_at)
      .plus({ seconds: spin_seconds })
      .minus({ seconds: bets_cutoff_seconds })
      .toJSDate();
  }

  return (
    <div className={`roulette ${status}`}>
      <h2>
        R<span>o</span>u<span>l</span>e<span>t</span>t<span>e</span>
      </h2>
      <div className="rouletteTable">
        <div className="bettingArea">
          <div className="instructions">
            <RouletteInstr />
            <p>Minimum: {minimum_bet} BB</p>
          </div>
          <RouletteGrid />
        </div>

        <div className="leaderboardArea">
          <CasinoLeaderboard />
        </div>

        <RouletteWheel
          result={result}
          status={status!}
          spin_seconds={spin_seconds!}
          innerWheelText={<RouletteWheelDisplay roulette={roulette} />}
        />
      </div>
      <RouletteSounds roulette={roulette} />
    </div>
  );
};

export default Roulette;
