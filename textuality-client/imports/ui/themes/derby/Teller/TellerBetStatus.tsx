import React, { useRef } from 'react';
import { useScaleByBaseWidth } from '/imports/ui/hooks/use-scale-by-base-width';

import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';

import { LedRound } from '../modules/LedLights/LedRound';
import {
  TELLER_CLOSED_STATUSES,
  TellerStatus as TellerStatusType,
} from '/imports/schemas/derby/teller-status/teller-status';

const ledSize = 68;

export const TellerBetStatus = ({
  teller,
  raceBet,
}: {
  teller: TellerWithHelpers;
  raceBet: RaceBetWithHelpers;
}) => {
  const statusRef = useRef<HTMLDivElement>(null);
  const baseWidth = 384;
  const baseHeight = 60;
  const scale = useScaleByBaseWidth(statusRef, baseWidth);

  const status = teller.status as TellerStatusType;
  const isClosed = TELLER_CLOSED_STATUSES.includes(status);

  const step = raceBet?.step;
  const betInProgress = !!step;

  const stepOrder = ['bet-type', 'horse1', 'horse2', 'horse3', 'wager', 'done'];

  // Determine which step is currently active
  const stepIndex = stepOrder.indexOf(step || '');
  const currentStep = stepOrder[stepIndex] || '';

  // LED step configuration
  const leds = [
    {
      icon: 'url(/derby/images/icons/stub.svg)',
      pulse: currentStep === 'bet-type',
      complete: stepIndex >= 1, // horse1+
    },
    {
      icon: 'url(/derby/images/icons/horse.svg)',
      pulse: ['horse1', 'horse2', 'horse3'].includes(currentStep),
      complete: stepIndex >= 4, // wager+
    },
    {
      icon: 'url(/derby/images/icons/money.svg)',
      pulse: currentStep === 'wager',
      complete: currentStep === 'done',
    },
  ];

  return (
    <div
      className="teller-bet-status-wrapper"
      style={{ width: '100%' }}
      ref={statusRef}
    >
      <div
        className="teller-bet-status"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center top',
          position: 'relative',
          top: `${((1 - scale) * baseHeight) / 2}px`,
          left: `-${((1 - scale) * baseWidth) / 2}px`,
          width: `${baseWidth}px`,
        }}
      >
        <div className="teller-bet-status-leds">
          {leds.map(({ icon, pulse, complete }, i) => (
            <LedRound
              key={i}
              off={isClosed || (betInProgress && !complete)}
              pulse={pulse}
              size={ledSize}
              icon={icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
