import React, { useState } from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { UseTableReturnValue } from './Table';
import { Button } from '@mui/material';
import {
  GridValidRowModel,
  GridRowModesModel,
  GridEditMode,
  GridRowsProp,
  GridRowModes,
  GridColDef,
} from '@mui/x-data-grid';

interface UseTableAddInlineArgs<T extends GridValidRowModel> {
  canAddInline: boolean;
  onGetStub?: () => T;
  setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
  setEditMode: React.Dispatch<React.SetStateAction<GridEditMode>>;
  rows: GridRowsProp<T>;
  setRows: React.Dispatch<React.SetStateAction<GridRowsProp<T>>>;
  idProp: string;
  columns: GridColDef<T>[];
}

const useTableAddInline = <T extends GridValidRowModel>({
  canAddInline,
  onGetStub,
  setRowModesModel,
  setEditMode,
  rows,
  setRows,
  columns,
  idProp,
}: UseTableAddInlineArgs<T>): UseTableReturnValue<T> => {
  const [isAdding, setIsAdding] = useState(false);

  if (!canAddInline) return {};

  const handleAdd = () => {
    const newId = `temp-${rows.length + 1}`;
    setIsAdding(true);
    setEditMode('row');
    const newRow = { ...(onGetStub?.() ?? {}), [idProp]: newId } as T;
    setRows((oldRows) => [...oldRows, newRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: columns[0].field },
    }));
  };

  const handleRowEditStop = (row: T) => {
    if (isAdding) {
      setIsAdding(false);
      setEditMode('cell');
      setRows((oldRows) => oldRows.filter((r) => r[idProp] !== row[idProp]));
    }
  };

  return {
    toolbarAction: (
      <Button
        key="add"
        startIcon={<AddTwoToneIcon />}
        onClick={handleAdd}
        disabled={isAdding}
      >
        Add
      </Button>
    ),
    handleRowEditStop,
  };
};

export default useTableAddInline;
