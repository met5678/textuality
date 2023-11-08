import React from 'react';
import { AutoFormArgs } from './AutoForm';
import { AutoForm, AutoFields, SubmitField } from 'uniforms-mui';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';

interface AutoFormDialogArgs<T> extends AutoFormArgs<T> {
  onChangeModel?: (model: T) => void;
  onValidate?: (model: T, error: any) => void;
  handleClose: () => unknown;
  children?: React.ReactNode;
}

const AutoFormDialog = <T,>(props: AutoFormDialogArgs<T>) => {
  const { children, handleClose, onValidate } = props;

  const { schema, model, onSubmit, onChangeModel } = props;
  const convertedSchema = new SimpleSchema2Bridge({ schema });

  return (
    <Dialog open={!!props.model} fullWidth={true} onClose={handleClose}>
      <AutoForm
        schema={convertedSchema}
        model={model}
        onSubmit={onSubmit}
        onChangeModel={onChangeModel}
        onValidate={onValidate ?? undefined}
      >
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          {<Stack spacing={2}>{children}</Stack> ?? <AutoFields />}
        </DialogContent>
        <DialogActions>
          <SubmitField />
        </DialogActions>
      </AutoForm>
    </Dialog>
  );
};

export default AutoFormDialog;
