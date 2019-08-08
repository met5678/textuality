import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PlayerSchema from 'schemas/player';

import {
  AutoForm,
  AutoField,
  ErrorsField,
  LongTextField,
  SubmitField
} from 'generic/AutoForm';
import EventField from 'modules/events/EventField';

const PlayerForm = ({ model, onSubmit }) => {
  return (
    <AutoForm schema={PlayerSchema} onSubmit={onSubmit} model={model}>
      <EventField />
      <AutoField name="phoneNumber" disabled={true} />
      <AutoField name="alias" disabled={true} />
      <AutoField name="status" />
      <ErrorsField />
      <SubmitField />
    </AutoForm>
  );
};

export default PlayerForm;
