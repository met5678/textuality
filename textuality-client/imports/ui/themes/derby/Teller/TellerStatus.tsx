import React, { useRef } from 'react';
import { useScaleByBaseWidth } from '/imports/ui/hooks/use-scale-by-base-width';
import { useRainbowShiftingColor } from '/imports/ui/hooks/use-rainbow-shifting-color';

import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
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

  let infoLabel = '';
  let infoValue = 0;

  if (isImpatient) {
    infoLabel = 'Time Left';
    infoValue = isTooLate ? 0 : timeLeft ?? 0;
  } else if (!isOpeningOrClosing && isClosed) {
    infoLabel = 'Bets Open';
    infoValue = 60; /* ROO TO DO : time until bets open*/
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

  const color = isFortuneTeller ? 'pink' : 'yellow';
  const fortuneTellerFun = isFortuneTeller && isBusy;
  const rainbowColor = useRainbowShiftingColor(fortuneTellerFun);

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
            color={
              fortuneTellerFun ? rainbowColor : isAvailable ? 'green' : 'red'
            }
            blink={fortuneTellerFun || isImpatient}
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
              rainbowModeActive={fortuneTellerFun}
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
