import React from 'react';

import commaNumber from 'comma-number';
import { COLOR_DERBY_OFF_WHITE } from '../DerbyStyleVars';
import { FONT_FAMILY_EUROSTILE } from '../DerbyStyleVars';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';
import { Horse, HorseId } from '/imports/schemas/derby/horse';
import { RaceBetType } from '/imports/schemas/derby/raceBet';
import { raceBetAskHorse } from '/imports/api/themes/derby/raceBets/methods/raceBet.askHorse';

export const FinalePlayerBet = ({
  wager,
  payout,
  type,
  allHorses,
  betHorseIds,
}: {
  wager: number;
  payout?: number;
  type: RaceBetType;
  allHorses: HorseWithHelpers[];
  betHorseIds: HorseId[];
}) => {
  return (
    <div
      className="race-winner-bet"
      style={{
        fontFamily: FONT_FAMILY_EUROSTILE,
        fontSize: '4vh',
        color: COLOR_DERBY_OFF_WHITE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2vh',
      }}
    >
      <div className="race-winner-bet-wager">{commaNumber(wager)} DD</div>
      <div className="race-winner-bet-horses" style={{}}>
        {betHorseIds.map((horseId) => {
          const horse = allHorses.find((horse) => horse._id === horseId);
          return type === 'win'
            ? horse?.formattedName()
            : horse?.emojiColorSquare;
        })}
      </div>
      {payout && payout > 0 && (
        <div className="race-winner-bet-payout" style={{ fontSize: '5vh' }}>
          {commaNumber(payout)} DD
        </div>
      )}
    </div>
  );
};
