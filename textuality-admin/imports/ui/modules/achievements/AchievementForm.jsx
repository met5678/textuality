import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import AchievementSchema from 'schemas/achievement';

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
    <AutoForm schema={AchievementSchema} onSubmit={onSubmit} model={model}>
      <EventField />
      <AutoField name="name" />
      <AutoField name="number" />
      <AutoField name="trigger" />
      <AutoField name="triggerDetail" />
      <AutoField name="clueAwardType" />
      <LongTextField name="playerText" />
      <AutoField name="hideFromScreen" />

      <ErrorsField />
      <SubmitField />
    </AutoForm>
  );
};

export default AutoTextForm;
