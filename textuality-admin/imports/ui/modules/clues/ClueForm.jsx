import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import ClueSchema from 'schemas/clue';

import {
  AutoForm,
  AutoField,
  ErrorsField,
  LongTextField,
  SubmitField,
} from 'generic/AutoForm';
import EventField from 'modules/events/EventField';

const AutoTextForm = ({ model, onSubmit }) => {
  return (
    <AutoForm schema={ClueSchema} onSubmit={onSubmit} model={model}>
      <EventField />
      <AutoField name="type" />
      <AutoField name="name" />
      <AutoField name="shortName" />
      <LongTextField name="playerText" />

      <ErrorsField />
      <SubmitField />
    </AutoForm>
  );
};

export default AutoTextForm;
