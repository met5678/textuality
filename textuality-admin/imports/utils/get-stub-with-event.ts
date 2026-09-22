import SimpleSchema from 'simpl-schema';
import { EventId } from '../schemas/event';
import Events from '../api/events';

export const getStubWithEvent = <T extends { event: EventId }>(
  schema: SimpleSchema,
) => {
  const stub = schema.clean({}) as unknown as T;
  stub.event = Events.currentId()!;
  return stub;
};
