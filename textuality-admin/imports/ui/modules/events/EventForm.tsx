import React from 'react';

import EventSchema, { Event } from '/imports/schemas/event';

import { AutoFields } from 'uniforms-mui';
import AutoFormDialog from '../../generic/AutoForm/AutoFormDialog';
import { Meteor } from 'meteor/meteor';

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
      model={model}
      handleClose={onClose}
    >
      <AutoFields />
    </AutoFormDialog>
  );
};

export default EventForm;
