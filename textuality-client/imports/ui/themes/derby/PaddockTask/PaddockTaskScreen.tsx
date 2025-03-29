import React from 'react';
import { Event } from '/imports/schemas/event';

const PaddockTaskScreen = ({ event, url }: { event: Event; url: string }) => {
  return <div>Paddock Task {url}</div>;
};

export default PaddockTaskScreen;
