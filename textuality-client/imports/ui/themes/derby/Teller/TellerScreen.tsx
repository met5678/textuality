import React from 'react';
import { Event } from '/imports/schemas/event';

const TellerScreen = ({ event, url }: { event: Event; url: string }) => {
  return <div>Teller {url}</div>;
};

export default TellerScreen;
