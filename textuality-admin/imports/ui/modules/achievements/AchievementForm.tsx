import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Achievement, AchievementSchema } from '/imports/schemas/achievement';
import AutoFormDialog from '../../generic/AutoForm/AutoFormDialog';
import TextField from '../../generic/AutoForm/TextField';
import { AutoField, ErrorsField, SubmitField } from '../../generic/AutoForm';
import TextMessageField from '../../generic/AutoForm/TextMessageField';
import NumberField from '../../generic/AutoForm/NumberField';
import EventField from '../events/EventField';

const AutoTextForm = ({
  model,
  onClose,
}: {
  model: Partial<Achievement> | null;
  onClose: () => void;
}) => {
  const onSubmit = (result: Achievement) => {
    if (!result._id) {
      Meteor.call('achievements.new', result);
    } else {
      Meteor.call('achievements.update', result);
    }
    onClose();
  };

  return (
    <AutoFormDialog<Achievement>
      schema={AchievementSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
    >
      <EventField />
      <TextField name="name" />
      <AutoField name="trigger" />
      <AutoField name="trigger_detail" />
      <NumberField name="money_award" />
      <AutoField name="quest_type" />
      <TextMessageField name="player_text" />
      <AutoField name="hide_from_screen" />

      <ErrorsField />
      <SubmitField />
    </AutoFormDialog>
  );
};

export default AutoTextForm;
