import React from 'react';
import {
  GridActionsCellItem,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import { UseTableReturnValue } from './Table';
import { isTempRow } from './useTableAddInline';

interface UseTableDuplicateArgs<T extends GridValidRowModel> {
  canDuplicate: boolean;
  onDuplicate: (obj: T) => Promise<any> | void;
  idProp: string;
}

const useTableDuplicate = <T extends GridValidRowModel>({
  canDuplicate,
  onDuplicate,
  idProp,
}: UseTableDuplicateArgs<T>): UseTableReturnValue<T> => {
  if (!canDuplicate) {
    return {};
  }

  const handleDuplicate = async (row: T) => {
    const newRow = await onDuplicate(row);
    console.log('newRow', newRow);
  };

  const rowAction = (rowParams: GridRowParams<T>) => (
    <GridActionsCellItem
      disabled={isTempRow(rowParams.row, idProp)}
      icon={<ControlPointDuplicateIcon />}
      title="Duplicate"
      label="Duplicate"
      onClick={() => handleDuplicate(rowParams.row)}
    />
  );

  return { rowAction };
};

export default useTableDuplicate;
