import React from 'react';
import { Meteor } from 'meteor/meteor';

import { HorseSchema, Horse } from '/imports/schemas/derby/horse';

import { ErrorsField } from 'uniforms-mui';
import EventField from '../../../events/EventField';
import AutoFormDialog from '/imports/ui/generic/AutoForm/AutoFormDialog';
import TextField from '/imports/ui/generic/AutoForm/TextField';
import NumberField from '/imports/ui/generic/AutoForm/NumberField';

interface HorseFormProps {
  model: Partial<Horse> | null;
  onClose: () => void;
}

const HorseFormDialog = ({ model, onClose }: HorseFormProps) => {
  const onSubmit = (horse: Partial<Horse>) => {
    if (horse._id) {
      Meteor.call('horses.update', horse);
    } else {
      Meteor.call('horses.new', horse);
    }
    onClose();
  };

  return (
    <AutoFormDialog
      schema={HorseSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
    >
      <EventField />
      <TextField name="name" />
      <TextField name="short_name" label="Short Name" />
      <TextField name="color" />
      <NumberField name="stats.speed" label="Speed" />
      <NumberField name="stats.endurance" label="Endurance" />
      <NumberField name="stats.luck" label="Luck" />
      <NumberField name="stats.traction" label="Traction" />
      <NumberField name="stats.distractibility" label="Distractibility" />
      <NumberField name="stats.boots" label="Boots" />
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default HorseFormDialog; 