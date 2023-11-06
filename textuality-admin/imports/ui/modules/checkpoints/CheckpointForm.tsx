import React from 'react';
import { Meteor } from 'meteor/meteor';

import CheckpointSchema, { Checkpoint } from '/imports/schemas/checkpoint';

import TagsField from '../../generic/AutoForm/TagsField';
import AutoFormDialog from '../../generic/AutoForm/AutoFormDialog';
import AutoField from '../../generic/AutoForm/AutoField';
import TextMessageField from '../../generic/AutoForm/TextMessageField';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Checkpoints from '/imports/api/checkpoints';
import EventField from '../events/EventField';
import { ErrorsField, SelectField } from '../../generic/AutoForm';
import TextField from '../../generic/AutoForm/TextField';
import { Stack } from '@mui/material';
import NumberField from '../../generic/AutoForm/NumberField';

const CheckpointForm = ({
  model,
  onClose,
}: {
  model: Partial<Checkpoint> | null;
  onClose: () => void;
}) => {
  const isLoading = useSubscribe('checkpoints.all');
  const allCheckpoints = useFind(() => Checkpoints.find(), []);

  const existingLocations = [
    ...new Set(allCheckpoints.map((checkpoint) => checkpoint.location)),
  ];
  const existingGroups = [
    ...new Set(allCheckpoints.map((checkpoint) => checkpoint.groups).flat()),
  ];

  const onSubmit = (result: Checkpoint) => {
    if (!result._id) {
      Meteor.call('checkpoints.new', result);
    } else {
      Meteor.call('checkpoints.update', result);
    }
    onClose();
  };

  return (
    <AutoFormDialog<Checkpoint>
      schema={CheckpointSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
    >
      <Stack spacing={2}>
        <EventField />
        <TextField name="hashtag" />
        <SelectField
          name="location"
          options={existingLocations}
          creatable={true}
        />
        <TagsField name="groups" options={existingGroups} />
        <NumberField name="money_award" />
        <TextMessageField name="playerText" />
        <ErrorsField />
      </Stack>{' '}
    </AutoFormDialog>
  );
};

export default CheckpointForm;
