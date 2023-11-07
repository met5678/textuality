import React from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
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
      <Button key="add" startIcon={<AddTwoToneIcon />} onClick={onAdd}>
        Add
      </Button>
    ),
  };
};

export default useTableAdd;
