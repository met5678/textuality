import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';

import { ErrorsField, RadioField } from 'uniforms-mui';
import EventField from '../../../events/EventField';
import AutoFormDialog from '/imports/ui/generic/AutoForm/AutoFormDialog';
import TextField from '/imports/ui/generic/AutoForm/TextField';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import QuestSchema, { Quest } from '/imports/schemas/quest';
import SlotMachines from '/imports/api/themes/casino/slotMachines';
import TextMessageField from '/imports/ui/generic/AutoForm/TextMessageField';

interface QuestFormProps {
  model: Partial<Quest> | null;
  onClose: () => void;
}

const QuestFormDialog = ({ model, onClose }: QuestFormProps) => {
  const isLoading = useSubscribe('slotMachines.all');
  const slotMachines = useFind(() => SlotMachines.find(), []);
  const onSubmit = (quest: Partial<Quest>) => {
    if (quest._id) {
      Meteor.call('quests.update', quest);
    } else {
      Meteor.call('quests.new', quest);
    }
    onClose();
  };

  const [liveModel, setLiveModel] = useState(model);
  useEffect(() => setLiveModel(model), [model]);

  const modelTransform = (mode: string, model: Partial<Quest>) => {
    console.log('Transform', { mode, model });
    return model;
  };

  return (
    <AutoFormDialog
      schema={QuestSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
      onChangeModel={setLiveModel}
      modelTransform={modelTransform}
    >
      <EventField />
      <TextField name="name" />
      <RadioField name="type" />
      {liveModel?.type === 'HACKER_TASK' && (
        <>
          <TextMessageField name="task_quest.start_text" />
          <TextField name="task_quest.start_text_image" />
          <TextField name="task_quest.hashtag" />
        </>
      )}
      {liveModel?.type === 'HACKER_SLOT' && (
        <></> // <QuestTypeField name="slot_quest" />
      )}
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default QuestFormDialog;
