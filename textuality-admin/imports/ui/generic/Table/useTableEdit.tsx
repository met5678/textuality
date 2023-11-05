import React, { ReactNode } from 'react';
import {
  GridActionsCellItem,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { TableRowAction } from './Table';

interface UseTableEditArgs<T> {
  canEdit: boolean;
  onEdit: (obj: T) => Promise<any> | void;
}

interface UseTableReturnValue {
  rowAction: TableRowAction | null;
  dialog: ReactNode;
}

const useTableEdit = <T extends GridValidRowModel>({
  canEdit,
  onEdit,
}: UseTableEditArgs<T>): UseTableReturnValue => {
  // const [itemToEdit, setItemToEdit] = useState<T | null>(null);
  // const dialogOpen = !!itemToEdit;

  if (!canEdit) {
    return {
      rowAction: null,
      dialog: null,
    };
  }

  const rowAction = (rowParams: GridRowParams<T>) => (
    <GridActionsCellItem
      icon={<EditTwoToneIcon />}
      onClick={() => onEdit(rowParams.row)}
      label="Edit"
    />
  );

  const dialog = null;

  // const dialog = (
  //   <AlertDialog
  //     open={dialogOpen}
  //     title="Edit?"
  //     text="Edit items?"
  //     onConfirm={() => onDelete(itemsToDelete)}
  //     onCancel={() => setItemsToDelete([])}
  //     key="delete"
  //   />
  // );

  return { rowAction, dialog };
};

export default useTableEdit;
