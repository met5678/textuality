import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { SelectField } from 'generic/AutoForm';

import Events from 'api/events';

const EventField = props => {
  const { event } = props;

  return (
    <SelectField
      name="event"
      value={event._id}
      options={[{ value: event._id, label: event.name }]}
      disabled={true}
      {...props}
    />
  );
};

export default withTracker(props => {
  const event = Events.current();

  return {
    event,
    ...props
  };
})(EventField);
