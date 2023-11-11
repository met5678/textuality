import React, { ReactNode } from 'react';
import { DateTime } from 'luxon';
import { RouletteWithHelpers } from '/imports/api/themes/casino/roulettes/roulettes';
import './RouletteWheelDisplay.css';
import Countdown from 'react-countdown';

interface WheelDisplay {
  luxonDate?: DateTime;
  title: ReactNode;
}
const getWheelDisplay = (
  roulette: Partial<RouletteWithHelpers>,
): WheelDisplay | null => {
  if (roulette.status === 'inactive') {
    return {
      luxonDate: DateTime.fromJSDate(roulette.bets_start_at!),
      title: 'Bets Open:',
    };
  }
  if (roulette.status === 'pre-spin' && roulette.spin_starts_at) {
    return {
      luxonDate: DateTime.fromJSDate(roulette.spin_starts_at).plus({
        seconds: roulette.spin_seconds! - roulette.bets_cutoff_seconds!,
      }),
      title: 'Bets Close:',
    };
  }
  if (roulette.status === 'spinning' && roulette.spin_starts_at) {
    if (roulette.bets_open) {
      return {
        luxonDate: DateTime.fromJSDate(roulette.spin_starts_at).plus({
          seconds: roulette.spin_seconds! - roulette.bets_cutoff_seconds!,
        }),
        title: 'Bets Close:',
      };
    } else {
      return {
        title: 'No More Bets',
      };
    }
  }
  return null;
};

const RouletteWheelDisplay = ({
  roulette,
}: {
  roulette: Partial<RouletteWithHelpers>;
}) => {
  const wheelDisplay = getWheelDisplay(roulette);

  if (wheelDisplay == null) return null;

  return (
    <div className="wheel-display">
      {wheelDisplay.title && (
        <div
          className={`wheel-title ${
            !!wheelDisplay.luxonDate ? 'with-countdown' : ''
          }`}
        >
          {wheelDisplay.title}
        </div>
      )}
      {wheelDisplay.luxonDate && (
        <Countdown
          date={wheelDisplay.luxonDate.toJSDate()}
          key={wheelDisplay.luxonDate.toMillis()}
          renderer={({ minutes, seconds }) => {
            const zeroPaddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
            return (
              <div className="wheel-countdown">
                {minutes}:{zeroPaddedSeconds}
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default RouletteWheelDisplay;
