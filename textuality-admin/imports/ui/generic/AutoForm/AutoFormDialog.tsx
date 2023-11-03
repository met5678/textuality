import React from 'react';
import { CustomAutoForm, AutoFormArgs } from './AutoForm';
import { AutoForm, AutoFields, SubmitField, ErrorField } from 'uniforms-mui';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface AutoFormDialogArgs<T> extends AutoFormArgs<T> {
  handleClose: () => unknown;
}

const AutoFormDialog = <T,>(props: AutoFormDialogArgs<T>) => {
  const { handleClose } = props;

  const { schema, model, onSubmit } = props;
  const convertedSchema = new SimpleSchema2Bridge({ schema });

  return (
    <Dialog open={!!props.model} onClose={handleClose}>
      <AutoForm schema={convertedSchema} model={model} onSubmit={onSubmit}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <AutoFields />
        </DialogContent>
        <DialogActions>
          <SubmitField />
        </DialogActions>
      </AutoForm>
    </Dialog>
  );
};

export default AutoFormDialog;
