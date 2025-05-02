import React, { useRef } from 'react';
import { useScaleByBaseWidth } from '/imports/ui/hooks/use-scale-by-base-width';

import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { TellerStatus as TellerStatusType } from '/imports/schemas/derby/teller-status/teller-status';
import { LedChar } from '../modules/LedLights/LedChar';
import { LedCharRow } from '../modules/LedLights/LedCharRow';
import { LedRound } from '../modules/LedLights/LedRound';

export const TellerStatus = ({
  teller,
  tellerStates,
  timeLeft,
}: {
  teller: TellerWithHelpers;
  tellerStates: Record<string, boolean>;
  timeLeft: number | undefined;
}) => {
  const statusRef = useRef<HTMLDivElement>(null);
  const baseWidth = 344;
  const baseHeight = 128;
  const scale = useScaleByBaseWidth(statusRef, baseWidth);

  const {
    isAvailable,
    isImpatient,
    isBusy,
    isClosed,
    isOpeningOrClosing,
    isFortuneTeller,
    isTooLate,
  } = tellerStates;

  const color = isFortuneTeller ? 'pink' : 'yellow';

  let infoLabel = '';
  let infoValue = 0;

  if (isImpatient) {
    infoLabel = 'Time Left';
    infoValue = isTooLate ? 0 : timeLeft ?? 0;
  } else if (!isOpeningOrClosing && isClosed) {
    infoLabel = 'Bets Open';
    infoValue = 60; /* JTG TO DO : time until bets open*/
  } else {
    infoLabel = 'Min Wager';
    infoValue = teller.min_wager;
  }

  let mainText = '';
  if (isAvailable) {
    mainText = teller.text_code;
  } else if (isBusy) {
    mainText = 'Busy';
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
            blink={isImpatient}
            off={isClosed || isOpeningOrClosing}
          />
          <div style={{ display: 'flex' }}>
            <LedChar
              className="at-sign"
              char={'@'}
              off={!isAvailable}
              color={color}
            />
            <LedCharRow
              value={mainText}
              off={isClosed || isOpeningOrClosing}
              charCount={5}
              color={color}
            />
          </div>
        </div>
        <div className="teller-status-info">
          <div className="teller-status-info-label">{infoLabel}</div>
          <LedCharRow
            value={infoValue}
            charCount={3}
            color={color}
            off={isBusy || isOpeningOrClosing}
          />
        </div>
      </div>
    </div>
  );
};
