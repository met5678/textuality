import React from 'react';
import { useState, useEffect, useRef } from 'react';

import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import {
  TELLER_AVAILABLE_STATUSES,
  TELLER_CLOSED_STATUSES,
  TellerStatus as TellerStatusType,
} from '/imports/schemas/derby/teller-status/teller-status';
import { LedChar } from '../modules/LedLights/LedChar';
import { LedCharRow } from '../modules/LedLights/LedCharRow';
import { LedRound } from '../modules/LedLights/LedRound';

export const TellerStatus = ({ teller }: { teller: TellerWithHelpers }) => {
  const [scale, setScale] = useState(1);
  const statusRef = useRef<HTMLDivElement>(null);
  const baseWidth = 344;
  const baseHeight = 128;

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
          position: 'relative',
          top: `${((1 - scale) * baseHeight) / 2}px`,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <LedRound
            color={isAvailable ? 'green' : 'red'}
            blink={status === 'betting-impatient'}
          />
          <div style={{ display: 'flex' }}>
            <LedChar className="at-sign" char={'@'} off={!isAvailable} />
            <LedCharRow
              value={teller.text_code ?? ''}
              off={!isAvailable}
              charCount={5}
            />
          </div>
        </div>
        <div className="teller-status-info">
          <div className="teller-status-info-label">{infoLabel}</div>
          <LedCharRow value={infoValue} charCount={3} />
        </div>
      </div>
    </div>
  );
};
