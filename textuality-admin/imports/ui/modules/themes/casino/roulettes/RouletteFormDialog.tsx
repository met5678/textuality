import React from 'react';
import { Meteor } from 'meteor/meteor';

import { RouletteSchema, Roulette } from '/imports/schemas/roulette';

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

interface RouletteFormProps {
  model: Partial<Roulette> | null;
  onClose: () => void;
}

const RouletteFormDialog = ({ model, onClose }: RouletteFormProps) => {
  const onSubmit = (roulette: Partial<Roulette>) => {
    if (roulette._id) {
      Meteor.call('roulettes.update', roulette);
    } else {
      Meteor.call('roulettes.new', roulette);
    }
    onClose();
  };

  return (
    <AutoFormDialog
      schema={RouletteSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
    >
      <EventField />
      <NumberField name="minimum_bet" />
      <AutoField name="bets_start_at" />
      <AutoField name="spin_starts_at" />
      <NumberField name="spin_seconds" />
      <NumberField name="bets_cutoff_seconds" />
      <NumberField name="result" />
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default RouletteFormDialog;
