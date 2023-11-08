import React from 'react';
import { Meteor } from 'meteor/meteor';

import { SlotMachineSchema, SlotMachine } from '/imports/schemas/slotMachine';

import {
  AutoField,
  AutoFields,
  ErrorsField,
  LongTextField,
} from 'uniforms-mui';
import { Box, Typography } from '@mui/material';
import EventField from '../../../events/EventField';
import AutoFormDialog from '/imports/ui/generic/AutoForm/AutoFormDialog';
import TextField from '/imports/ui/generic/AutoForm/TextField';
import NumberField from '/imports/ui/generic/AutoForm/NumberField';
import SlotMachineOddsField from './SlotMachineOddsField';

interface SlotMachineFormProps {
  model: Partial<SlotMachine> | null;
  onClose: () => void;
}

const SlotMachineFormDialog = ({ model, onClose }: SlotMachineFormProps) => {
  const onSubmit = (slotMachine: Partial<SlotMachine>) => {
    if (slotMachine._id) {
      Meteor.call('slotMachines.update', slotMachine);
    } else {
      Meteor.call('slotMachines.new', slotMachine);
    }
    onClose();
  };

  return (
    <AutoFormDialog
      schema={SlotMachineSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
    >
      <EventField />
      <TextField name="code" />
      <TextField name="name" />
      <NumberField name="cost" />
      <SlotMachineOddsField name="odds" />
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default SlotMachineFormDialog;
