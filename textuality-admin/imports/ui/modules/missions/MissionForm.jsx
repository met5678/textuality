import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import MissionSchema from 'schemas/mission';

import {
  AutoForm,
  AutoField,
  ErrorsField,
  LongTextField,
  SubmitField,
} from 'generic/AutoForm';
import EventField from 'modules/events/EventField';

const MissionForm = ({ model, onSubmit }) => {
  return (
    <AutoForm schema={MissionSchema} onSubmit={onSubmit} model={model}>
      <EventField />
      <AutoField name="name" />
      <AutoField name="number" />
      <AutoField name="minutes" />
      <LongTextField name="missionPreText" />
      <LongTextField name="missionSuccessText" />
      <LongTextField name="missionFailText" />

      <ErrorsField />
      <SubmitField />
    </AutoForm>
  );
};

export default MissionForm;
