import React from 'react';
import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';

export const TellerBetStatus = ({
  teller,
  raceBet,
}: {
  teller: TellerWithHelpers;
  raceBet: RaceBetWithHelpers;
}) => {
  const STEP_1 = ['bet-type'];
  const STEP_2 = ['horse1', 'horse2', 'horse3'];
  const STEP_3 = ['wager'];
  const STEP_4 = ['complete'];

  return <div className="teller-bet-status">Bet Type | Horse | Wager</div>;
};
