import React from 'react';

import EventSchema, {
  DEFAULT_EVENT_TIME_ZONE,
  Event,
} from '/imports/schemas/event';

import { AutoFields } from 'uniforms-mui';
import AutoFormDialog from '../../generic/AutoForm/AutoFormDialog';
import SelectField from '../../generic/AutoForm/SelectField';
import { getTimeZoneOptions } from '/imports/utils/time-zones';
import { Meteor } from 'meteor/meteor';

const TIME_ZONE_OPTIONS = getTimeZoneOptions();

const EventForm = ({
  model,
  onClose,
}: {
  model: Event | null;
  onClose: () => void;
}) => {
  const onSubmit = (result: Event) => {
    if (!result._id) {
      Meteor.call('events.new', result);
    } else {
      Meteor.call('events.update', result);
    }
    onClose();
  };

  return (
    <AutoFormDialog
      schema={EventSchema}
      onSubmit={onSubmit}
      model={
        model
          ? {
              timeZone: DEFAULT_EVENT_TIME_ZONE,
              ...model,
            }
          : null
      }
      handleClose={onClose}
    >
      <AutoFields omitFields={['timeZone']} />
      <SelectField
        name="timeZone"
        label="Time Zone"
        creatable={false}
        options={TIME_ZONE_OPTIONS}
      />
    </AutoFormDialog>
  );
};

export default EventForm;
