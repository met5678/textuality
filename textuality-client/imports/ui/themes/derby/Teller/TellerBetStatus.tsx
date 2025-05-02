import React, { useEffect, useRef, useState } from 'react';
import { useScaleByBaseWidth } from '/imports/ui/hooks/use-scale-by-base-width';

import './Teller.css';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';

import { LedRound } from '../modules/LedLights/LedRound';

const ledSize = 68;

export const TellerBetStatus = ({
  teller,
  raceBet,
  tellerStates,
}: {
  teller: TellerWithHelpers;
  raceBet: RaceBetWithHelpers;
  tellerStates: Record<string, boolean>;
}) => {
  const statusRef = useRef<HTMLDivElement>(null);
  const baseWidth = 384;
  const baseHeight = 60;
  const scale = useScaleByBaseWidth(statusRef, baseWidth);

  const {
    isAvailable,
    isBusy,
    isClosed,
    isOpeningOrClosing,
    isFortuneTeller,
    isTooLate,
  } = tellerStates;

  const step = raceBet?.step;
  const betInProgress = !!step;

  const stepOrder = ['bet-type', 'horse1', 'horse2', 'horse3', 'wager', 'done'];

  // Determine which step is currently active
  const stepIndex = stepOrder.indexOf(step || '');
  const currentStep = stepOrder[stepIndex] || '';
  const betPlaced = currentStep === 'done';

  // LED step configuration
  const leds = [
    {
      icon: 'url(/derby/images/icons/stub.svg)',
      complete: stepIndex >= 1, // horse1+
      current: currentStep === 'bet-type',
    },
    {
      icon: 'url(/derby/images/icons/horse.svg)',
      complete: stepIndex >= 4, // wager+
      current: ['horse1', 'horse2', 'horse3'].includes(currentStep),
    },
    {
      icon: 'url(/derby/images/icons/money.svg)',
      complete: betPlaced,
      current: currentStep === 'wager',
    },
  ];

  const fortuneTellerFun = isFortuneTeller && isBusy;
  const rainbow = ['red', 'yellow', 'green', 'blue', 'pink'];
  const [rainbowOffset, setRainbowOffset] = useState(0);
  useEffect(() => {
    if (fortuneTellerFun) {
      const interval = setInterval(() => {
        setRainbowOffset((prev) => (prev + 1) % rainbow.length);
      }, 200); // faster loop!

      return () => clearInterval(interval);
    }
  }, [isFortuneTeller, isBusy]);

  const blink = betPlaced || isTooLate || fortuneTellerFun;

  console.log('teller', teller);

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
          {leds.map(({ icon, complete, current }, i) => {
            const animationDelay =
              betPlaced || fortuneTellerFun
                ? i * 0.1
                : isAvailable
                ? i * 0.3
                : 0;

            const ledColor = fortuneTellerFun
              ? rainbow[(i + rainbowOffset) % rainbow.length]
              : isFortuneTeller
              ? 'pink'
              : 'yellow';
            const pulse = isAvailable || (current && !isTooLate);
            return (
              <LedRound
                key={i}
                icon={icon}
                size={ledSize}
                color={ledColor as 'red' | 'green' | 'yellow' | 'blue' | 'pink'}
                off={
                  isClosed || isOpeningOrClosing || (betInProgress && !complete)
                }
                blink={blink}
                pulse={pulse}
                animationDelay={animationDelay}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
