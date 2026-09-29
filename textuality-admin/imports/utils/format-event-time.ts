import { DateTime } from 'luxon';
import Events from '/imports/api/events';
import { DEFAULT_EVENT_TIME_ZONE } from '/imports/schemas/event';

export const formatEventTime = async (date: Date) => {
  const event = await Events.currentAsync();
  const timeZone = event?.timeZone ?? DEFAULT_EVENT_TIME_ZONE;

  return DateTime.fromJSDate(date, { zone: timeZone }).toLocaleString(
    DateTime.TIME_SIMPLE,
  );
};
