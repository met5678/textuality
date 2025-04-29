import React from 'react';
import { useState, useEffect, useRef } from 'react';

import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import {
  TELLER_AVAILABLE_STATUSES,
  TELLER_CLOSED_STATUSES,
  TellerStatus as TellerStatusType,
} from '/imports/schemas/derby/teller-status/teller-status';
import { LedCell } from '../modules/LedLights/LedCell';
import { LedCellRow } from '../modules/LedLights/LedCellRow';
import { LedRound } from '../modules/LedLights/LedRound';

export const TellerStatus = ({ teller }: { teller: TellerWithHelpers }) => {
  const [scale, setScale] = useState(1);
  const statusRef = useRef<HTMLDivElement>(null);
  const baseWidth = 344;
  const baseHeight = 128;

  console.log(`${(1 - scale) * baseHeight}px`);

  useEffect(() => {
    if (statusRef.current) {
      const { width } = statusRef.current.getBoundingClientRect();
      setScale(width / baseWidth);
    }
  }, []);

  const status = teller.status as TellerStatusType;
  const isAvailable = TELLER_AVAILABLE_STATUSES.includes(status);
  const isClosed = TELLER_CLOSED_STATUSES.includes(status);
  const timesUp = status === 'timeout';

  let infoLabel = '';
  let infoValue = 0;

  if (isAvailable) {
    infoLabel = 'Min Wager';
    infoValue = teller.min_wager;
  } else if (isClosed || status === 'opening') {
    infoLabel = 'Bets Open';
    infoValue = 60; /* JTG TO DO : time until bets open*/
  } else {
    infoLabel = 'Time Left';
    infoValue = timesUp ? 0 : teller.time_left ?? 0;
  }

  return (
    <div className="teller-status-wrapper" ref={statusRef}>
      <div
        className="teller-status"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <LedRound color={isAvailable ? 'green' : 'red'} />
          <div style={{ display: 'flex' }}>
            <LedCell className="at-sign" char={'@'} lit={isAvailable} />
            <LedCellRow
              value={teller.text_code ?? ''}
              lit={isAvailable}
              cellCount={5}
            />
          </div>
        </div>
        <div className="teller-status-info">
          <div className="teller-status-info-label">{infoLabel}</div>
          <LedCellRow value={infoValue} cellCount={3} />
        </div>
      </div>
    </div>
  );
};
