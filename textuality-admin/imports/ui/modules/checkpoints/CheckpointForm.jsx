import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import CheckpointSchema from 'schemas/checkpoint';

import {
  AutoForm,
  AutoField,
  ErrorsField,
  LongTextField,
  SubmitField
} from 'generic/AutoForm';
import EventField from 'modules/events/EventField';

const CheckpointForm = ({ model, onSubmit }) => {
  return (
    <AutoForm schema={CheckpointSchema} onSubmit={onSubmit} model={model}>
      <EventField />
      <AutoField name="number" />
      <AutoField name="hashtag" />
      <AutoField name="group" />
      <AutoField name="location" />

      <ErrorsField />
      <SubmitField />
    </AutoForm>
  );
};

export default CheckpointForm;
