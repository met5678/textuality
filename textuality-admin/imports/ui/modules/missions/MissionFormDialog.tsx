import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';

import { MissionSchema, Mission } from '/imports/schemas/mission';

import { ErrorsField } from 'uniforms-mui';
import AutoFormDialog from '/imports/ui/generic/AutoForm/AutoFormDialog';
import TextField from '/imports/ui/generic/AutoForm/TextField';
import NumberField from '/imports/ui/generic/AutoForm/NumberField';
import EventField from '../events/EventField';

interface MissionFormProps {
  model: Partial<Mission> | null;
  onClose: () => void;
}

const MissionFormDialog = ({ model, onClose }: MissionFormProps) => {
  const onSubmit = (mission: Partial<Mission>) => {
    if (mission._id) {
      Meteor.call('missions.update', mission);
    } else {
      Meteor.call('missions.new', mission);
    }
    onClose();
  };

  const [liveModel, setLiveModel] = useState(model);
  useEffect(() => setLiveModel(model), [model]);

  return (
    <AutoFormDialog
      schema={MissionSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
      onChangeModel={setLiveModel}
    >
      <EventField />
      <TextField name="name" />
      <NumberField name="number" />
      <NumberField name="minutes" />
      <ErrorsField />
    </AutoFormDialog>
  );
};

export default MissionFormDialog;
