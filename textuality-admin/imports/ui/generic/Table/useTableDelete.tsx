import React, { useState } from 'react';
import AlertDialog from '../AlertDialog/AlertDialog';
import {
  GridActionsCellItem,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { UseTableReturnValue } from './Table';

interface UseTableDeleteArgs<T> {
  canDelete: boolean;
  onDelete: (obj: T | T[]) => Promise<any> | void;
}

const useTableDelete = <T extends GridValidRowModel>({
  canDelete,
  onDelete,
}: UseTableDeleteArgs<T>): UseTableReturnValue<T> => {
  const [itemsToDelete, setItemsToDelete] = useState<T[]>([]);
  const dialogOpen = itemsToDelete.length > 0;

  if (!canDelete) {
    return {
      rowAction: null,
      dialog: null,
    };
  }

  const rowAction = (rowParams: GridRowParams<T>) => (
    <GridActionsCellItem
      icon={<DeleteForeverTwoToneIcon />}
      onClick={() => setItemsToDelete([rowParams.row])}
      label="Delete"
    />
  );

  const dialog = (
    <AlertDialog
      open={dialogOpen}
      title="Delete?"
      text="Delete items?"
      onConfirm={async () => {
        await onDelete(itemsToDelete);
        setItemsToDelete([]);
      }}
      onCancel={() => setItemsToDelete([])}
      key="delete"
    />
  );

  return { rowAction, dialog };
};

export default useTableDelete;
