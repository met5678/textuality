import React from 'react';
import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import {
  TELLER_AVAILABLE_STATUSES,
  TELLER_CLOSED_STATUSES,
  TellerStatus as TellerStatusType,
} from '/imports/schemas/derby/teller-status/teller-status';
import { LedCell } from '../modules/LedLights/LedCell';
import { LedCellRow } from '../modules/LedLights/LedCellRow';

export const TellerStatus = ({ teller }: { teller: TellerWithHelpers }) => {
  const status = teller.status as TellerStatusType;
  const isAvailable = TELLER_AVAILABLE_STATUSES.includes(status);
  const isClosed = TELLER_CLOSED_STATUSES.includes(status);
  console.log('status:', status, 'isAvailable:', isAvailable);

  const timesUp = status === 'timeout';

  return (
    <div className="teller-state">
      <div style={{ display: 'flex', gap: '1rem' }}>
        <span>Open: {isAvailable ? 'Yes' : 'No'}</span>

        <div style={{ display: 'flex' }}>
          <LedCell char={'@'} lit={isAvailable} />
          <LedCellRow value={teller.text_code ?? ''} cellCount={7} />
        </div>
      </div>
      <br />
      {isAvailable
        ? `Min Wager: ${teller.min_wager}`
        : isClosed
        ? `Bets Open: 60`
        : `Time Left: ${timesUp ? 0 : teller.time_left}`}
    </div>
  );
};
