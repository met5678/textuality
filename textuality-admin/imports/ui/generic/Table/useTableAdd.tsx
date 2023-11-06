import React from 'react';
import { GridValidRowModel } from '@mui/x-data-grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { UseTableReturnValue } from './Table';
import { Button } from '@mui/material';

interface UseTableAddArgs {
  canAdd: boolean;
  onAdd: () => Promise<any> | void;
}

const useTableAdd = ({
  canAdd,
  onAdd,
}: UseTableAddArgs): UseTableReturnValue => {
  if (!canAdd) return {};
  return {
    toolbarAction: (
      <Button key="add" startIcon={<EditTwoToneIcon />} onClick={onAdd}>
        Add
      </Button>
    ),
  };
};

export default useTableAdd;
