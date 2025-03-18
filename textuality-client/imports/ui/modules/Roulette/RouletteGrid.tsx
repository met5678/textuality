import React from 'react';
import './RouletteGrid.css';

import RouletteChip from './RouletteChip';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import RouletteBets from '/imports/api/themes/casino/rouletteBets';
import { RouletteStatus } from '/imports/schemas/roulette';
import useTimedQueue from '../../hooks/use-timed-queue';
import { RouletteBet, RouletteBetSlot } from '/imports/schemas/rouletteBet';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import commaNumber from 'comma-number';
import classNames from 'classnames';

interface RouletteGridProps {
  status: RouletteStatus;
  betsOpen: boolean;
  rouletteId: string;
  skin: string;
}

const COLOR_OPTIONS_NORMAL = ['#121639', '#fea70a'];
const COLOR_OPTIONS_SPACE = ['#ff01ff', '#ff9404', '#abd301', '#0000fe'];

const getColorForBet = (bet: RouletteBet, colors: string[]) =>
  colors[String(bet?._id!).charCodeAt(0) % colors.length];

const RouletteGrid = ({
  rouletteId,
  status,
  betsOpen,
  skin,
}: RouletteGridProps) => {
  const isLoading = useSubscribe('rouletteBets.forRoulette', rouletteId);
  const bets = useFind(
    () =>
      RouletteBets.find({ roulette_id: rouletteId }, { sort: { time: -1 } }),
    [rouletteId],
  );

  const colorOptions =
    skin === 'space' ? COLOR_OPTIONS_SPACE : COLOR_OPTIONS_NORMAL;
  const getBet = (bet: RouletteBetSlot) => bets.find((b) => b.bet_slot === bet);

  const queueBet = useTimedQueue<RouletteBet>(bets, 5000);
  const getNumbers = (start: number) => {
    return Array.from({ length: 12 }, (_, index) => index * 3 + start);
  };
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  const isRed = (num: number) => redNumbers.includes(num);
  const isGreen = (bet: string) => ['even', 'odd'].includes(bet);

  const renderCell = (number: number) => {
    const betObj = getBet(number as RouletteBetSlot);

    return (
      <td
        key={number}
        className={`${isRed(number) ? 'red' : 'black'} ${
          number === 0 ? 'zero' : ''
        }`}
        id={String(number)}
      >
        {betObj && (
          <RouletteChip
            avatar_id={betObj?.player.avatar_id}
            color={getColorForBet(betObj, colorOptions)}
          />
        )}
        {number}
      </td>
    );
  };

  const renderSpecialCell = (bet: string) => {
    const betObj = getBet(bet as RouletteBetSlot);

    return (
      <td
        colSpan={3}
        className={`${bet} ${isGreen(bet) ? 'green' : ''}`}
        id={bet}
      >
        {betObj && (
          <RouletteChip
            avatar_id={betObj?.player.avatar_id}
            color={getColorForBet(betObj, colorOptions)}
          />
        )}
        {bet}
      </td>
    );
  };

  return (
    <div className="rouletteGrid">
      <table>
        <tr className="nums">
          <td className="green zero" />
          {getNumbers(3).map((number) => renderCell(number))}
        </tr>
        <tr className="nums">
          {renderCell(0)}
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
          <RouletteChip
            avatar_id={queueBet?.player.avatar_id}
            color={getColorForBet(queueBet, colorOptions)}
          />{' '}
          {queueBet?.player.alias} put {commaNumber(queueBet.wager)}{' '}
          {skin === 'space' ? 'VC' : 'BB'} on {queueBet.bet_slot}!
        </p>
      )}
    </div>
  );
};

export default RouletteGrid;
