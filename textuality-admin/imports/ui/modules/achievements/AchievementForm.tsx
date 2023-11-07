import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';

import { Achievement, AchievementSchema } from '/imports/schemas/achievement';
import AutoFormDialog from '../../generic/AutoForm/AutoFormDialog';
import TextField from '../../generic/AutoForm/TextField';
import { AutoField, ErrorsField, SubmitField } from '../../generic/AutoForm';
import TextMessageField from '../../generic/AutoForm/TextMessageField';
import NumberField from '../../generic/AutoForm/NumberField';
import EventField from '../events/EventField';
import { RadioField } from 'uniforms-mui';
import achievementsConfig from '/imports/api/achievements/config/achievements-config';

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
  const [liveModel, setLiveModel] = useState(model);
  useEffect(() => setLiveModel(model), [model]);

  const achievementConfig = liveModel
    ? achievementsConfig[liveModel.trigger ?? '']
    : null;

  return (
    <AutoFormDialog<Achievement>
      schema={AchievementSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
      onChangeModel={setLiveModel}
    >
      <EventField />
      <TextField name="name" />
      <AutoField name="trigger" />
      {achievementConfig && achievementConfig.useString && (
        <TextField
          name="trigger_detail_string"
          label={achievementConfig.stringField}
        />
      )}
      {achievementConfig && achievementConfig.useNumber && (
        <NumberField
          name="trigger_detail_number"
          label={achievementConfig.numberField}
        />
      )}
      <NumberField name="money_award" />
      <RadioField name="quest_award_type" />
      <TextMessageField name="player_text" />
      <TextField name="player_text_image" />
      <AutoField name="hide_from_screen" />

      <ErrorsField />
    </AutoFormDialog>
  );
};

export default AutoTextForm;
