import React from 'react';
import {
  GridActionsCellItem,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { UseTableReturnValue } from './Table';

interface UseTableEditArgs<T> {
  canEdit: boolean;
  onEdit: (obj: T) => Promise<any> | void;
}

const useTableEdit = <T extends GridValidRowModel>({
  canEdit,
  onEdit,
}: UseTableEditArgs<T>): UseTableReturnValue<T> => {
  if (!canEdit) {
    return {};
  }

  const rowAction = (rowParams: GridRowParams<T>) => (
    <GridActionsCellItem
      icon={<EditTwoToneIcon />}
      onClick={() => onEdit(rowParams.row)}
      label="Edit"
    />
  );

  return { rowAction };
};

export default useTableEdit;
