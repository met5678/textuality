import React, { useRef } from 'react';
import { useScaleByBaseWidth } from '/imports/ui/hooks/use-scale-by-base-width';
import { useRainbowShiftingColor } from '/imports/ui/hooks/use-rainbow-shifting-color';

import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { LedChar } from '../modules/LedLights/LedChar';
import { LedCharRow } from '../modules/LedLights/LedCharRow';
import { LedRound } from '../modules/LedLights/LedRound';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { useTracker } from 'meteor/react-meteor-data';
import reactiveDate from '/imports/utils/reactive-date';
import { DateTime } from 'luxon';

export const TellerStatus = ({
  teller,
  tellerStates,
  timeLeft,
  race,
  onResize,
  matchHeights,
}: {
  teller: TellerWithHelpers;
  tellerStates: Record<string, boolean>;
  timeLeft: number | undefined;
  race: RaceWithHelpers | undefined;
  onResize?: (height: number) => void;
  matchHeights?: boolean;
}) => {
  const now = useTracker(() => reactiveDate.get());

  const statusRef = useRef<HTMLDivElement>(null);
  const baseWidth = 344;
  const baseHeight = 128;

  const scale = useScaleByBaseWidth(
    statusRef,
    baseWidth,
    onResize,
    matchHeights,
  );

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
  let infoValue = '';

  if (isImpatient) {
    infoLabel = 'Time Left';
    infoValue =
      isTooLate || !timeLeft
        ? '00:00'
        : `00:${String(timeLeft).padStart(2, '0')}`;
  } else if (!isOpeningOrClosing && isClosed) {
    infoLabel = 'Bets Open';
    infoValue =
      race && race.time_bets_start_at
        ? DateTime.fromJSDate(race.time_bets_start_at)
            .diff(DateTime.fromJSDate(now), ['minutes', 'seconds'])
            .toFormat('mm:ss')
        : '00:00';
  } else {
    infoLabel = 'Min Bet';
    infoValue = `${teller.min_wager}`;
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
    <div
      className="teller-status-wrapper"
      ref={statusRef}
      style={{ width: '100%' }}
    >
      <div
        className="teller-status"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: `${-((1 - scale) * baseHeight)}px`,
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
        <div
          className="teller-status-info"
          style={{ marginBottom: 'clamp(8px, 1vh, 24px)' }}
        >
          <div className="teller-status-info-label">{infoLabel}</div>
          <LedCharRow
            value={infoValue}
            charCount={5}
            color={color}
            off={isOpeningOrClosing}
            rainbowModeActive={fortuneTellerFun}
            style={{ transform: `scale(0.7)`, transformOrigin: 'left center' }}
          />
        </div>
      </div>
    </div>
  );
};
