import React from 'react';
import './RouletteGrid.css';

import RouletteChip from './RouletteChip';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import RouletteBets from '/imports/api/themes/casino/rouletteBets';
import { RouletteStatus } from '/imports/schemas/roulette';
import useTimedQueue from '../../hooks/use-timed-queue';
import { RouletteBet, RouletteBetSlot } from '/imports/schemas/rouletteBet';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

interface RouletteGridProps {
  status: RouletteStatus;
  betsOpen: boolean;
  rouletteId: string;
}

const RouletteGrid = ({ rouletteId, status, betsOpen }: RouletteGridProps) => {
  const isLoading = useSubscribe('rouletteBets.forRoulette', rouletteId);
  const bets = useFind(
    () =>
      RouletteBets.find({ roulette_id: rouletteId }, { sort: { time: -1 } }),
    [rouletteId],
  );

  const getBet = (bet: RouletteBetSlot) => bets.find((b) => b.bet_slot === bet);
  const hasBet = (bet: RouletteBetSlot) => !!getBet(bet);

  const queueBet = useTimedQueue<RouletteBet>(bets, 5000);

  const getNumbers = (start: number) => {
    return Array.from({ length: 12 }, (_, index) => index * 3 + start);
  };
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  const isRed = (num: number) => redNumbers.includes(num);
  const isGreen = (bet: string) => ['even', 'odd'].includes(bet);

  const renderCell = (number: number, isGreen: boolean = false) => (
    <td
      key={number}
      className={`${isGreen ? 'green ' : ''}${isRed(number) ? 'red' : 'black'}`}
      id={String(number)}
    >
      {hasBet(number) && (
        <RouletteChip
          avatar_id={getBet(number)?.player.avatar_id}
          zoom={1.25}
        />
      )}
      {number}
    </td>
  );

  const renderSpecialCell = (bet: string) => (
    <td
      colSpan={3}
      className={`${bet} ${isGreen(bet) ? 'green' : ''}`}
      id={bet}
    >
      {hasBet(bet as RouletteBetSlot) && (
        <RouletteChip
          avatar_id={getBet(bet as RouletteBetSlot)?.player.avatar_id}
        />
      )}
      {bet}
    </td>
  );

  return (
    <div className="rouletteGrid">
      <table>
        <tr className="nums">
          <td className="green zero" />
          {getNumbers(3).map((number) => renderCell(number))}
        </tr>
        <tr className="nums">
          <td className="green zero" id="0">
            {hasBet(0) && (
              <RouletteChip avatar_id={getBet(0)?.player.avatar_id} />
            )}
            0
          </td>
          {getNumbers(2).map((number) => renderCell(number))}
        </tr>
        <tr className="nums">
          <td className="green zero" />
          {getNumbers(1).map((number) => renderCell(number))}
        </tr>
        <tr>
          <td className="empty"></td>
          {renderSpecialCell('even')}
          {renderSpecialCell('red')}
          {renderSpecialCell('black')}
          {renderSpecialCell('odd')}
        </tr>
      </table>
      {queueBet && (
        <p className="betFeeds">
          <RouletteChip avatar_id={queueBet?.player.avatar_id} />{' '}
          {queueBet?.player.alias} put {queueBet.wager} BB on{' '}
          {queueBet.bet_slot}!
        </p>
      )}
    </div>
  );
};

export default RouletteGrid;
