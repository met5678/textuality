import React from 'react';
import './Teller.css';
import { Event } from '/imports/schemas/event';
import { useTellerScreenData } from './useTellerScreenData';
import { TellerVideo } from './TellerVideo/TellerVideo';
import { TellerStatus } from './TellerStatus';
import { TellerBetStatus } from './TellerBetStatus';
const TellerScreen = ({ event, url }: { event: Event; url: string }) => {
  const { isLoading, teller, raceBet, player } = useTellerScreenData({
    eventId: event._id,
    url,
  });

  if (isLoading()) return 'Loading';

  console.log({ teller, raceBet, player });

  return (
    <div className="teller-screen">
      <div className="teller-state-container">
        <TellerStatus teller={teller} />
        <TellerVideo teller={teller} />
        <TellerBetStatus teller={teller} raceBet={raceBet} />
      </div>
    </div>
  );
};

export default TellerScreen;
