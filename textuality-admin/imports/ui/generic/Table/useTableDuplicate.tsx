import React, { useState } from 'react';
import AlertDialog from '../AlertDialog/AlertDialog';
import {
  GridActionsCellItem,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import { UseTableReturnValue } from './Table';
import { isTempRow, NEW_ROW_ID_PREFIX } from './useTableAddInline';

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
    return {
      rowAction: null,
      dialog: null,
    };
  }

  const handleDuplicate = async (row: T) => {
    const newRow = await onDuplicate(row);
    console.log('newRow', newRow);
  };

  const rowAction = (rowParams: GridRowParams<T>) => (
    <GridActionsCellItem
      disabled={isTempRow(rowParams.row, idProp)}
      icon={<ControlPointDuplicateIcon />}
      onClick={() => handleDuplicate(rowParams.row)}
      label="Duplicate"
    />
  );

  return { rowAction };
};

export default useTableDuplicate;
