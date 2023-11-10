import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';

import { ErrorsField, ListField, RadioField } from 'uniforms-mui';
import EventField from '../../../events/EventField';
import AutoFormDialog from '/imports/ui/generic/AutoForm/AutoFormDialog';
import TextField from '/imports/ui/generic/AutoForm/TextField';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import QuestSchema, { Quest } from '/imports/schemas/quest';
import SlotMachines from '/imports/api/themes/casino/slotMachines';
import TextMessageField from '/imports/ui/generic/AutoForm/TextMessageField';
import NumberField from '/imports/ui/generic/AutoForm/NumberField';
import SequenceField from '/imports/ui/generic/AutoForm/SequenceField';

interface QuestFormProps {
  model: Partial<Quest> | null;
  onClose: () => void;
}

const QuestFormDialog = ({ model, onClose }: QuestFormProps) => {
  const isLoading = useSubscribe('slotMachines.all');
  const slotMachines = useFind(
    () => SlotMachines.find({}, { sort: { code: 1 } }),
    [],
  );
  const onSubmit = (quest: Partial<Quest>) => {
    if (quest._id) {
      Meteor.call('quests.update', quest);
    } else {
      Meteor.call('quests.new', quest);
    }
    onClose();
  };

  const slotMachineOptions = slotMachines.map((slotMachine) => ({
    label: `${slotMachine.code} - ${slotMachine.name}`,
    value: slotMachine._id,
  }));

  const [liveModel, setLiveModel] = useState(model);
  useEffect(() => setLiveModel(model), [model]);

  return (
    <AutoFormDialog
      schema={QuestSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
      onChangeModel={setLiveModel}
    >
      <EventField />
      <TextField name="name" />
      <RadioField name="type" />
      <TextMessageField name="start_text" />
      <TextField name="start_text_image" />
      {liveModel?.type === 'HACKER_TASK' && (
        <TextField name="task_quest.hashtag" />
      )}
      {liveModel?.type === 'HACKER_SLOT' && (
        <>
          <SequenceField
            name="slot_quest.slot_sequence"
            options={slotMachineOptions}
          />
          <NumberField name="slot_quest.win_amount" />
        </>
      )}
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default QuestFormDialog;
