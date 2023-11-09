import React from 'react';

import RouletteInstr from './RouletteInstr';
import RouletteWheel from './RouletteWheel';

import { Roulette } from '/imports/schemas/roulette';
import './Roulette.css';
import RouletteGrid from './RouletteGrid';
import Countdown from 'react-countdown';
import { DateTime } from 'luxon';

interface RouletteProps {
  roulette: Partial<Roulette>;
}

const Roulette = ({ roulette }: RouletteProps) => {
  const {
    event,
    minimum_bet,
    bets_start_at,
    spin_starts_at,
    bets_open,
    spin_started_at,
    spin_seconds,

    result,
    status,
  } = roulette;

  let spinEndTime = null;
  if (status === 'spinning' && spin_started_at) {
    spinEndTime = DateTime.fromJSDate(spin_started_at)
      .plus({ seconds: spin_seconds })
      .toJSDate();
  }

  console.log(roulette);

  return (
    <div className="roulette">
      <h2>
        R<span>o</span>u<span>l</span>e<span>t</span>t<span>e</span>
      </h2>
      <div className="rouletteTable">
        <div className="bettingArea">
          <div className="instructions">
            <RouletteInstr />
            <p>Minimum: {minimum_bet} BB</p>

            {/* <p>Text # to place your bet</p>
            <p>Cost: {minimum_bet}</p>
            <p>
              Status: {status}, Bets Open: {bets_open ? 'yes' : 'no'}
            </p>
            {spinEndTime && (
              <p>
                Spin Ends:{' '}
                <Countdown
                  date={spinEndTime}
                  renderer={({ minutes, seconds, completed }) => {
                    if (completed) {
                      return <span>Spin Ended</span>;
                    } else {
                      const zeroPaddedSeconds =
                        seconds < 10 ? `0${seconds}` : seconds;
                      return (
                        <span>
                          {minutes}:{zeroPaddedSeconds}
                        </span>
                      );
                    }
                  }}
                />
              </p>
            )} */}
          </div>
          <RouletteGrid />
        </div>

        <RouletteWheel />
      </div>
    </div>
  );
};

export default Roulette;
