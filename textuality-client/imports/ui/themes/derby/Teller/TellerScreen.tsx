import React from 'react';
import { Event } from '/imports/schemas/event';
import { useTellerScreenData } from './useTellerScreenData';

const TellerScreen = ({ event, url }: { event: Event; url: string }) => {
  const { isLoading, teller, raceBet, player } = useTellerScreenData({
    eventId: event._id,
    url,
  });

  if (isLoading()) return 'Loading';

  console.log({ teller, raceBet, player });

  return (
    <div>
      Teller {teller.text_code}, Status: {teller.status}, Time Left:{' '}
      {teller.time_left}
    </div>
  );
};

export default TellerScreen;
