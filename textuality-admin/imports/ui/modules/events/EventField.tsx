import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { SelectField } from 'uniforms-mui';

import Events from '/imports/api/events';

const EventField = () => {
  const event = useTracker(() => Events.current());

  if (!event) return null;

  return (
    <SelectField
      name="event"
      value={event._id}
      options={[{ value: event._id, label: event.name }]}
      disabled={true}
    />
  );
};

export default EventField;
