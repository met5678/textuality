import React from 'react';
import { Meteor } from 'meteor/meteor';

import { RaceSchema, Race } from '/imports/schemas/derby/race';

import { ErrorsField } from 'uniforms-mui';
import EventField from '../../../events/EventField';
import AutoFormDialog from '/imports/ui/generic/AutoForm/AutoFormDialog';
import SelectField from '/imports/ui/generic/AutoForm/SelectField';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import Horses from '../../../../../api/themes/derby/horses';
import UniformsAutoField from '/imports/ui/generic/AutoForm/AutoField';

interface RaceFormProps {
  model: Partial<Race> | null;
  onClose: () => void;
}

const RaceFormDialog = ({ model, onClose }: RaceFormProps) => {
  const isLoadingHorses = useSubscribe('derby.horses.all');
  const horses = useFind(() => Horses.find(), []);

  const onSubmit = (race: Partial<Race>) => {
    if (race._id) {
      Meteor.call('derby.races.update', race);
    } else {
      Meteor.call('derby.races.new', race);
    }
    onClose();
  };

  if (isLoadingHorses()) {
    return null;
  }

  return (
    <AutoFormDialog
      schema={RaceSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
    >
      <EventField />
      <UniformsAutoField name="scheduled" label="Scheduled" />
      <UniformsAutoField name="time_bets_start_at" label="Bets Start Time" />
      <UniformsAutoField name="time_race_starts_at" label="Race Start Time" />
      <UniformsAutoField name="furlong_length" label="Furlong Length" />
      <SelectField
        name="weather"
        label="Weather"
        creatable={false}
        options={RaceSchema.getAllowedValuesForKey('weather') as string[]}
      />
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default RaceFormDialog;
