import React from 'react';

import RouletteInstr from './RouletteInstr';
import RouletteWheel from './RouletteWheel';

import { Roulette } from '/imports/schemas/roulette';
import './Roulette.css';
import RouletteGrid from './RouletteGrid';
import { DateTime } from 'luxon';
import RouletteSounds from './RouletteSounds';
import { RouletteWithHelpers } from '/imports/api/themes/casino/roulettes/roulettes';
import CasinoLeaderboard from '../CasinoLeaderboard/CasinoLeaderboard';
import RouletteWheelDisplay from './RouletteWheelDisplay';
import { useConfetti } from '../../hooks/use-confetti';
import RouletteWinnerBoard from './RouletteWinnerBoard';

interface RouletteProps {
  roulette: Partial<RouletteWithHelpers>;
  skin: string;
}

const Roulette = ({ roulette, skin }: RouletteProps) => {
  const {
    event,
    number_payout_multiplier,
    special_payout_multiplier,
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
    <div className={`roulette ${status} ${skin}`}>
      <div className="rouletteTable">
        <div className="bettingArea">
          <h2>{displayTitle}</h2>
          <div className="instructions">
            <p>Send !bet to place your bet</p>
            <p className="note">
              Number Payout: {number_payout_multiplier}x <br />
              Red/Black/Odd/Even Payout: {special_payout_multiplier}x
            </p>
          </div>
          <RouletteGrid rouletteId={roulette._id} skin={skin} />
        </div>

        <div className="leaderboardArea">
          <CasinoLeaderboard skin={skin} />
        </div>

        {status === 'winners-board' && (
          <div className="winnerBoard">
            <RouletteWinnerBoard roulette={roulette} skin={skin} />
          </div>
        )}

        <RouletteWheel
          result={result}
          status={status!}
          spin_seconds={spin_seconds!}
          skin={skin}
          innerWheelText={
            <RouletteWheelDisplay roulette={roulette} skin={skin} />
          }
        />
      </div>
      <RouletteSounds roulette={roulette} />
    </div>
  );
};

export default Roulette;
