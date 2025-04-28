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
  const onSubmit = async (horse: Partial<Horse>) => {
    await Meteor.callAsync('derby.horses.upsert', horse);
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
      <NumberField name="number" label="Number" />
      <TextField name="short_name" label="Short Name" />
      <TextField name="color" />
      <NumberField name="stats.speed" label="Speed" />
      <NumberField name="stats.endurance" label="Endurance" />
      <NumberField name="stats.water_resistance" label="Water Resistance" />
      <NumberField name="stats.wind_resistance" label="Wind Resistance" />
      <NumberField
        name="stats.electric_resistance"
        label="Electric Resistance"
      />
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default HorseFormDialog;
