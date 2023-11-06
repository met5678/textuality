import React from 'react';
import { Meteor } from 'meteor/meteor';

import AutoTextSchema, { AutoText } from '/imports/schemas/autoText';

import AutoFormDialog from '../../generic/AutoForm/AutoFormDialog';
import { AutoField, LongTextField } from 'uniforms-mui';
import EventField from '../events/EventField';
import { Box, Typography } from '@mui/material';
import TextMessageField from '../../generic/AutoForm/TextMessageField';

interface AutoTextFormProps {
  model: Partial<AutoText> | null;
  onClose: () => void;
}

const AutoTextFormDialog = ({ model, onClose }: AutoTextFormProps) => {
  const onSubmit = (autoText: Partial<AutoText>) => {
    if (autoText._id) {
      Meteor.call('autoTexts.update', autoText);
    } else {
      Meteor.call('autoTexts.new', autoText);
    }
    onClose();
  };

  return (
    <AutoFormDialog
      schema={AutoTextSchema}
      onSubmit={onSubmit}
      model={model}
      handleClose={onClose}
    >
      <EventField />
      <AutoField name="trigger" />
      <AutoField name="image_url" />
      <AutoField name="give_money" />
      <Box>
        <Typography variant="body2">
          <ul>
            <li>
              <strong>[alias]</strong> Player's alias
            </li>
            <li>
              <strong>[money]</strong> Player's money after this trigger
            </li>
            <li>
              <strong>[money_award]</strong> Player's money awarded with this
              trigger
            </li>
          </ul>
        </Typography>
      </Box>
      <TextMessageField name="playerText" />
    </AutoFormDialog>
  );
};

export default AutoTextFormDialog;
