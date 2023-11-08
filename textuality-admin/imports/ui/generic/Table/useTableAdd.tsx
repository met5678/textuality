import React from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { UseTableReturnValue } from './Table';
import { Button } from '@mui/material';
import { GridValidRowModel } from '@mui/x-data-grid';

interface UseTableAddArgs {
  canAdd: boolean;
  onAdd: () => Promise<any> | void;
}

const useTableAdd = <T extends GridValidRowModel>({
  canAdd,
  onAdd,
}: UseTableAddArgs): UseTableReturnValue<T> => {
  if (!canAdd) return {};
  return {
    toolbarAction: (
      <Button key="add" startIcon={<AddTwoToneIcon />} onClick={onAdd}>
        Add
      </Button>
    ),
  };
};

export default useTableAdd;
