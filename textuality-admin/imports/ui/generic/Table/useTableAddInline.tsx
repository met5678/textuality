import React from 'react';
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
  GridRowEditStopParams,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { v4 } from 'uuid';

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

export const NEW_ROW_ID_PREFIX = 'temp-';

export const isTempRow = <T extends GridValidRowModel>(
  row: T,
  idProp: string,
) =>
  typeof row[idProp] === 'string' && row[idProp].startsWith(NEW_ROW_ID_PREFIX);

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
  if (!canAddInline) return {};

  const handleAdd = () => {
    const newId = `${NEW_ROW_ID_PREFIX}-${v4()}`;
    setEditMode('row');
    const newRow = { ...(onGetStub?.() ?? {}), [idProp]: newId } as T;
    setRows((oldRows) => [...oldRows, newRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: columns[0].field },
    }));
  };

  const handleRowEditStop = (params: GridRowEditStopParams<T>) => {
    if (
      params.reason === GridRowEditStopReasons.escapeKeyDown ||
      params.reason === GridRowEditStopReasons.rowFocusOut
    ) {
      setRows((oldRows) =>
        oldRows.filter((r) => r[idProp] !== params.row[idProp]),
      );
      setEditMode('cell');
    }
  };

  const hasNewRow = rows.some(
    (r) =>
      typeof r[idProp] === 'string' && r[idProp].startsWith(NEW_ROW_ID_PREFIX),
  );

  return {
    toolbarAction: (
      <Button
        key="add"
        startIcon={<AddTwoToneIcon />}
        onClick={handleAdd}
        disabled={hasNewRow}
      >
        Add
      </Button>
    ),
    handleRowEditStop,
  };
};

export default useTableAddInline;
