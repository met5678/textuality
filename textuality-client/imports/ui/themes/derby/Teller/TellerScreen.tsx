import React, { useState } from 'react';
import './Teller.css';
import { Event } from '/imports/schemas/event';
import { useTellerScreenData } from './useTellerScreenData';
import { TellerVideo } from './TellerVideo/TellerVideo';
import { TellerStatus } from './TellerStatus';
import { TellerBetStatus } from './TellerBetStatus';
import { TellerSounds } from './TellerSounds';

import {
  TELLER_AVAILABLE_STATUSES,
  TELLER_BUSY_STATUSES,
  TELLER_CLOSED_STATUSES,
  TELLER_FORTUNE_STATUSES,
  TELLER_FORTUNE_AVAILABLE_STATUSES,
  TellerStatus as TellerStatusType,
} from '/imports/schemas/derby/teller-status/teller-status';

const TellerScreen = ({ event, url }: { event: Event; url: string }) => {
  const { loading, teller, raceBet, player, race, timeLeft } =
    useTellerScreenData({
      eventId: event._id,
      url,
    });
  const [topHeight, setTopHeight] = useState(0);
  const [bottomHeight, setBottomHeight] = useState(0);

  if (loading) return 'Loading';

  const status = teller.status as TellerStatusType;

  /* Teller status helpers */
  const isAvailable =
    TELLER_AVAILABLE_STATUSES.includes(status) ||
    TELLER_FORTUNE_AVAILABLE_STATUSES.includes(status);

  const tellerStates: Record<string, boolean> = {
    isAvailable,
    isBusy: TELLER_BUSY_STATUSES.includes(status),
    isClosed:
      !isAvailable &&
      status !== 'fortune-engaged' &&
      TELLER_CLOSED_STATUSES.includes(status),
    isImpatient: status === 'betting-impatient',
    isFortuneTeller: TELLER_FORTUNE_STATUSES.includes(status),
    isOpeningOrClosing: [
      'opening',
      'fortune-opening',
      'closing',
      'fortune-closing',
    ].includes(status),
    isTooLate: status === 'timeout',
  };

  /* Url paths aren't working in the css file for this component, so need to use paths in here 
  Note: paths work fine in ToteBoard.css so not sure why this is happening */
  return (
    <>
      <div
        className="teller-screen"
        style={{ background: `url(/derby/textures/wood-dark.png) #463C36` }}
      >
        <div className="teller-state-container">
          <TellerStatus
            teller={teller}
            timeLeft={timeLeft}
            tellerStates={tellerStates}
            race={race}
            onResize={setTopHeight}
          />
          <TellerVideo
            teller={teller}
            player={player}
            raceBet={raceBet}
            topHeight={topHeight}
            bottomHeight={bottomHeight}
          />
          <TellerBetStatus
            teller={teller}
            raceBet={raceBet}
            tellerStates={tellerStates}
            onResize={setBottomHeight}
          />
          <TellerSounds teller={teller} raceBet={raceBet} />
        </div>
      </div>
    </>
  );
};

export default TellerScreen;
