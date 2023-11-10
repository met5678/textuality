import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';

import { RouletteSchema, Roulette } from '/imports/schemas/roulette';

import {
  AutoField,
  AutoFields,
  ErrorsField,
  LongTextField,
  SelectField,
} from 'uniforms-mui';
import { Box, Typography } from '@mui/material';
import EventField from '../../../events/EventField';
import AutoFormDialog from '/imports/ui/generic/AutoForm/AutoFormDialog';
import TextField from '/imports/ui/generic/AutoForm/TextField';
import NumberField from '/imports/ui/generic/AutoForm/NumberField';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { DateField } from '/imports/ui/generic/AutoForm';
import Missions from '/imports/api/missions';

interface RouletteFormProps {
  model: Partial<Roulette> | null;
  onClose: () => void;
}

const RouletteFormDialog = ({ model, onClose }: RouletteFormProps) => {
  const isLoading = useSubscribe('missions.all');
  const missions = useFind(() => Missions.find(), []);
  const onSubmit = (roulette: Partial<Roulette>) => {
    if (roulette._id) {
      Meteor.call('roulettes.update', roulette);
    } else {
      Meteor.call('roulettes.new', roulette);
    }
    onClose();
  };

  const [liveModel, setLiveModel] = useState(model);
  useEffect(() => setLiveModel(model), [model]);

  return (
    <AutoFormDialog
      schema={RouletteSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
      onChangeModel={setLiveModel}
    >
      <EventField />
      <AutoField name="scheduled" />
      {liveModel?.scheduled && (
        <>
          <DateField name="bets_start_at" type="datetime-local" />
          <DateField name="spin_starts_at" type="datetime-local" />
        </>
      )}
      <NumberField name="number_payout_multiplier" />
      <NumberField name="special_payout_multiplier" />

      <SelectField
        name="linked_mission"
        options={[
          {
            label: 'None',
            value: 'none',
          },
          ...missions.map((mission) => ({
            label: mission.name,
            value: mission._id!,
          })),
        ]}
      />
      <NumberField name="spin_seconds" disabled={true} />
      <NumberField name="bets_cutoff_seconds" />
      <NumberField name="result" />
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default RouletteFormDialog;
