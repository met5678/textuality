import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import AutoTextSchema from 'schemas/autoText';

import {
  AutoForm,
  AutoField,
  ErrorsField,
  LongTextField,
  SubmitField
} from 'generic/AutoForm';
import EventField from 'modules/events/EventField';

const AutoTextForm = ({ model, onSubmit }) => {
  return (
    <AutoForm schema={AutoTextSchema} onSubmit={onSubmit} model={model}>
      <EventField />
      <AutoField name="trigger" />
      <AutoField name="triggerNum" />
      <LongTextField name="playerText" />
      <LongTextField name="screenText" />

      <ErrorsField />
      <SubmitField />
    </AutoForm>
  );
};

export default AutoTextForm;
