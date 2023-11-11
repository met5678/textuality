import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { RouletteWithHelpers } from '/imports/api/themes/casino/roulettes/roulettes';
import RouletteBets from '/imports/api/themes/casino/rouletteBets';
import { RouletteBet } from '/imports/schemas/rouletteBet';
import RouletteChip from './RouletteChip';
import './RouletteWinnerBoard.css';
import classNames from 'classnames';

const TIME_INTERVAL = 4000;
const NUM_TO_SHOW = 3;

const RouletteWinnerBoard = ({
  roulette,
}: {
  roulette: Partial<RouletteWithHelpers>;
}) => {
  const isLoading = useSubscribe(
    'rouletteBets.winnersForRoulette',
    roulette._id,
  );
  const winningBets = useFind(
    () =>
      RouletteBets.find(
        { roulette_id: roulette._id, win_payout: { $gt: 0 } },
        { sort: { win_payout: -1 } },
      ),
    [roulette._id],
  );

  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (startIdx + NUM_TO_SHOW < winningBets.length) {
        setStartIdx((startIdx) => startIdx + NUM_TO_SHOW);
      } else {
        setStartIdx(0);
      }
    }, TIME_INTERVAL);

    return () => clearTimeout(timeout);
  }, [startIdx, winningBets.length]);

  if (isLoading()) return null;

  const winnersToShow = winningBets.slice(startIdx, startIdx + NUM_TO_SHOW);

  const rouletteWinnerBoardClass = classNames({
    'roulette-winner-board': true,
    'even-idx': startIdx % 2 === 0,
    'odd-idx': startIdx % 2 === 1,
  });

  return (
    <div className={rouletteWinnerBoardClass}>
      {winnersToShow.map((bet) => {
        return (
          <div className="roulette-winner">
            <RouletteChip
              avatar_id={bet.player.avatar_id}
              zoom={0.8}
              width={250}
              height={250}
            />
            <div className="roulette-winner-alias">{bet.player.alias}</div>
            <div className="roulette-winner-amount">+{bet.win_payout} BB</div>
            <div className={`roulette-winner-bet ${bet.bet_slot}`}>
              {bet.bet_slot}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RouletteWinnerBoard;
