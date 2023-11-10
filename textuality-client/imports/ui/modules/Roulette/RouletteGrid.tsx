import React from 'react';
import './RouletteGrid.css';

import RouletteChip from './RouletteChip';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import RouletteBets from '/imports/api/themes/casino/rouletteBets';
import { RouletteStatus } from '/imports/schemas/roulette';
import useTimedQueue from '../../hooks/use-timed-queue';
import { RouletteBet } from '/imports/schemas/rouletteBet';
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
      RouletteBets.find(
        { roulette_id: rouletteId },
        { sort: { time: -1 }, limit: 6 },
      ),
    [rouletteId],
  );

  const queueBet = useTimedQueue<RouletteBet>(bets, 5000);

  const getNumbers = (start: number) => {
    return Array.from({ length: 12 }, (_, index) => index * 3 + start);
  };
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  const isRed = (num: number) => redNumbers.includes(num);
  const hasBet = false;

  return (
    <div className="rouletteGrid">
      <table>
        <tr className="nums">
          <td className="green zero" />
          {getNumbers(3).map((number, index) => (
            <td
              key={index}
              className={isRed(number) ? 'red' : 'black'}
              id={`${number}`}
            >
              {hasBet ? <RouletteChip /> : number}
            </td>
          ))}
        </tr>
        <tr className="nums">
          <td className="green zero" id="0">
            <span>0</span>
          </td>
          {getNumbers(2).map((number, index) => (
            <td
              key={index}
              className={isRed(number) ? 'red' : 'black'}
              id={`${number}`}
            >
              {number}
            </td>
          ))}
        </tr>
        <tr className="nums">
          <td className="green zero" />
          {getNumbers(1).map((number, index) => (
            <td
              key={index}
              className={isRed(number) ? 'red' : 'black'}
              id={`${number}`}
            >
              {number}
            </td>
          ))}
        </tr>
        <tr>
          <td className="empty"></td>
          <td colSpan={3} className="even" id="even">
            Even
          </td>
          <td colSpan={3} className="red" id="red">
            Red
          </td>
          <td colSpan={3} className="black" id="black">
            Black
          </td>
          <td colSpan={3} className="odd" id="odd">
            Odd
          </td>
        </tr>
      </table>
      {queueBet && (
        <div>
          {queueBet?.player.alias}{' '}
          <img
            src={getImageUrl(queueBet.player.avatar_id, {
              height: 100,
              width: 100,
            })}
          />
          {queueBet.wager}BB, {queueBet.bet_slot}
        </div>
      )}
    </div>
  );
};

export default RouletteGrid;
