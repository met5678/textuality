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
import { useConfetti } from '../../hooks/use-confetti';

interface RouletteProps {
  roulette: Partial<RouletteWithHelpers>;
}

const Roulette = ({ roulette }: RouletteProps) => {
  const {
    event,
    number_payout_multiplier,
    special_payout_multiplier,
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

  const title = 'Roulette';
  const displayTitle = title.split('').map((letter, index) => (
    <span key={index} className={index % 2 === 0 ? 'evenLetter' : 'oddLetter'}>
      {letter}
    </span>
  ));

  useConfetti(status === 'end-spin');

  return (
    <div className={`roulette ${status}`}>
      <h2>{displayTitle}</h2>
      <div className="rouletteTable">
        <div className="bettingArea">
          <div className="instructions">
            <RouletteInstr />
            <p>Number Payout: {number_payout_multiplier}x</p>
            <p>Red/Black/Odd/Even Payout: {special_payout_multiplier}x</p>
          </div>
          <RouletteGrid
            status={status}
            betsOpen={bets_open}
            rouletteId={roulette._id}
          />
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
