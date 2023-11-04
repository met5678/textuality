import React, { ReactElement, ReactNode } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import useTableDelete from './useTableDelete';
import useTableEdit from './useTableEdit';

interface TableArgs<T extends GridValidRowModel> {
  data: GridRowsProp<T>;
  columns: GridColDef<T>[];
  canDelete?: boolean;
  onDelete?: (obj: T | T[]) => Promise<any> | void;
  canEdit?: boolean;
  onEdit?: (obj: T) => Promise<any> | void;
  dynamicHeight?: boolean;
}

type TableRowAction = ((rowParams: GridRowParams<any>) => ReactElement) | null;

const applyRowActions = (
  rowActions: TableRowAction[],
  columns: GridColDef[],
): GridColDef[] => {
  return [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => rowActions.map((rowAction) => rowAction!(params)),
    },
  ];
};

const Table = <T extends GridValidRowModel>({
  data,
  columns,
  canDelete = false,
  onDelete,
  canEdit = false,
  onEdit,
  dynamicHeight = false,
}: TableArgs<T>) => {
  const rowActions: ((params: GridRowParams<any>) => ReactElement)[] = [];
  const dialogs: ReactNode[] = [];

  {
    const { dialog, rowAction } = useTableDelete<T>({
      canDelete,
      onDelete: onDelete!,
    });
    rowAction && rowActions.push(rowAction);
    dialog && dialogs.push(dialog);
  }

  {
    const { dialog, rowAction } = useTableEdit<T>({
      canEdit,
      onEdit: onEdit!,
    });
    rowAction && rowActions.push(rowAction);
    dialog && dialogs.push(dialog);
  }

  const useColumns = rowActions.length
    ? applyRowActions(rowActions, columns)
    : columns;

  return (
    <Paper>
      <DataGrid<T>
        rows={data}
        columns={useColumns}
        autoHeight={true}
        getRowId={(row) => row._id}
        rowSelection={false}
        checkboxSelection={false}
        density="compact"
        getRowHeight={dynamicHeight ? () => 'auto' : undefined}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
        }}
      />
      {dialogs}
    </Paper>
  );
};

export default Table;
export { TableRowAction };
