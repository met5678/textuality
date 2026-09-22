import { useTracker } from 'meteor/react-meteor-data';
import Events from '/imports/api/events';
import { EventId } from '/imports/schemas/event';

export const useEventId = (): EventId | undefined => {
  const eventId = useTracker(() => Events.currentId());
  return eventId;
};
