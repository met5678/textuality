import React from 'react';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';

import RoundSchema from 'schemas/round';

import LoadingBar from 'generic/LoadingBar';

import Clues from 'api/clues';

import {
  AutoForm,
  AutoField,
  ErrorsField,
  LongTextField,
  SubmitField,
} from 'generic/AutoForm';
import EventField from 'modules/events/EventField';

const AutoTextForm = ({ model, onSubmit }) => {
  const isLoading = useSubscribe('clues.basic');

  if (isLoading()) return <LoadingBar />;

  return (
    <AutoForm schema={RoundSchema} onSubmit={onSubmit} model={model}>
      <EventField />
      <AutoField name="number" />
      <AutoField name="name" />
      <AutoField name="solution" />

      <ErrorsField />
      <SubmitField />
    </AutoForm>
  );
};

export default AutoTextForm;
