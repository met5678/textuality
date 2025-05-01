import React from 'react';
import './Teller.css';
import { Event } from '/imports/schemas/event';
import { useTellerScreenData } from './useTellerScreenData';
import { TellerVideo } from './TellerVideo/TellerVideo';
import { TellerStatus } from './TellerStatus';
import { TellerBetStatus } from './TellerBetStatus';
import { TellerSounds } from './TellerSounds';
const TellerScreen = ({ event, url }: { event: Event; url: string }) => {
  const { loading, teller, raceBet } = useTellerScreenData({
    eventId: event._id,
    url,
  });

  if (loading) return 'Loading';

  /* Url paths aren't working in the css file for this component, so need to use paths in here 
  Note: paths work fine in ToteBoard.css so not sure why this is happening */
  return (
    <>
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
