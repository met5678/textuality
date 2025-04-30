import React from 'react';
import './Teller.css';
import { Event } from '/imports/schemas/event';
import { useTellerScreenData } from './useTellerScreenData';
import { TellerVideo } from './TellerVideo/TellerVideo';
import { TellerStatus } from './TellerStatus';
import { TellerBetStatus } from './TellerBetStatus';
import { TellerSounds } from './TellerSounds';
const TellerScreen = ({ event, url }: { event: Event; url: string }) => {
  const { isLoading, teller, raceBet, player } = useTellerScreenData({
    eventId: event._id,
    url,
  });

  if (isLoading()) return 'Loading';

  /* Url paths aren't working in the css file for this component, so need to use paths in here 
  Note: paths work fine in ToteBoard.css so not sure why this is happening */
  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'digital-7';
            src: url('/derby/digital-7_mono.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div
        className="teller-screen"
        style={{ background: `url(/derby/textures/wood-dark.png) #463C36` }}
      >
        <div className="teller-state-container">
          <TellerStatus teller={teller} />
          <TellerVideo teller={teller} />
          <TellerBetStatus teller={teller} raceBet={raceBet} />
          <TellerSounds teller={teller} raceBet={raceBet} />
        </div>
      </div>
    </>
  );
};

export default TellerScreen;
