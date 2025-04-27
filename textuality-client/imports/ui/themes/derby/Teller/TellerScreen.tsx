import React from 'react';
import { Event } from '/imports/schemas/event';
import { useTellerScreenData } from './useTellerScreenData';
import { TellerVideo } from './TellerVideo/TellerVideo';

const TellerScreen = ({ event, url }: { event: Event; url: string }) => {
  const { isLoading, teller, raceBet, player } = useTellerScreenData({
    eventId: event._id,
    url,
  });

  if (isLoading()) return 'Loading';

  console.log({ teller, raceBet, player });

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <TellerVideo teller={teller} />
      Teller {teller.text_code}, Status: {teller.status}, Time Left:{' '}
    </div>
  );
};

export default TellerScreen;
