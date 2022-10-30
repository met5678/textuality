import React from 'react';

import EventSchema from 'schemas/event';

import AutoForm from 'generic/AutoForm';

const EventForm = props => {
  let { model, onSubmit } = props;

  return <AutoForm schema={EventSchema} onSubmit={onSubmit} model={model} />;
};

export default EventForm;
