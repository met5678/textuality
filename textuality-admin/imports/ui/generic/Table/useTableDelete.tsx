import React, { useState } from 'react';
import AlertDialog from '../AlertDialog/AlertDialog';
import {
  GridActionsCellItem,
  GridRowParams,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { UseTableReturnValue } from './Table';
import { NEW_ROW_ID_PREFIX } from './useTableAddInline';

interface UseTableDeleteArgs<T extends GridValidRowModel> {
  canDelete: boolean;
  onDelete: (obj: T | T[]) => Promise<any> | void;
  setRows: React.Dispatch<React.SetStateAction<GridRowsProp<T>>>;
  idProp: string;
}

const useTableDelete = <T extends GridValidRowModel>({
  canDelete,
  onDelete,
  setRows,
  idProp,
}: UseTableDeleteArgs<T>): UseTableReturnValue<T> => {
  const [itemsToDelete, setItemsToDelete] = useState<T[]>([]);
  const dialogOpen = itemsToDelete.length > 0;

  if (!canDelete) {
    return {};
  }

  const rowAction = (rowParams: GridRowParams<T>) => (
    <GridActionsCellItem
      icon={<DeleteForeverTwoToneIcon />}
      onClick={(event) => {
        if (
          typeof rowParams.id === 'string' &&
          rowParams.id.startsWith(NEW_ROW_ID_PREFIX)
        ) {
          setRows((oldRows) =>
            oldRows.filter((r) => r[idProp] !== rowParams.id),
          );
        } else {
          if (event.metaKey) {
            onDelete(rowParams.row);
          } else {
            setItemsToDelete([rowParams.row]);
          }
        }
      }}
      label="Delete"
      title="Delete"
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
