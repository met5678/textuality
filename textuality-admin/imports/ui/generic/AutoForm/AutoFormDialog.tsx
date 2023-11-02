import React from 'react';
import { CustomAutoForm, AutoFormArgs } from './AutoForm';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

interface AutoFormDialogArgs<T> extends AutoFormArgs<T> {
  handleClose: () => unknown;
}

const AutoFormDialog = <T,>(props: AutoFormDialogArgs<T>) => {
  const open = true;
  const { handleClose } = props;

  return (
    <Dialog open={!!props.model} onClose={handleClose}>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <CustomAutoForm {...props} />
      </DialogContent>
    </Dialog>
  );
};

export default AutoFormDialog;
