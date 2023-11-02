import React from 'react';
import { DateTime } from 'luxon';

const DateDisplay = ({ date }: { date: Date }) => {
  const d = DateTime.fromJSDate(date);

  return <>{d.toLocaleString(DateTime.TIME_WITH_SECONDS)}</>;
};

export default DateDisplay;
