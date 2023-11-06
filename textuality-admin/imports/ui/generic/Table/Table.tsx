import React, { ReactElement, ReactNode } from 'react';
import {
  DataGrid,
  GridColDef,
  GridDensity,
  GridRowParams,
  GridRowsProp,
  GridToolbarContainer,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import useTableDelete from './useTableDelete';
import useTableEdit from './useTableEdit';
import useTableAdd from './useTableAdd';

interface TableArgs<T extends GridValidRowModel> {
  data: GridRowsProp<T>;
  columns: GridColDef<T>[];
  canDelete?: boolean;
  onDelete?: (obj: T | T[]) => Promise<any> | void;
  canEdit?: boolean;
  onEdit?: (obj: T) => Promise<any> | void;
  canAdd?: boolean;
  onAdd?: () => Promise<any> | void;
  formModal?: ReactElement;
  dynamicHeight?: boolean;
  density?: GridDensity;
  isLoading?: boolean;
}

interface UseTableReturnValue {
  toolbarAction?: ReactNode;
  rowAction?: TableRowAction;
  dialog?: ReactNode;
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

const getCustomToolbar = (toolbarActions: ReactNode[]) => {
  if (toolbarActions.length === 0) return null;

  return <GridToolbarContainer>{toolbarActions}</GridToolbarContainer>;
};

const Table = <T extends GridValidRowModel>({
  data,
  columns,
  canDelete = false,
  onDelete,
  canEdit = false,
  onEdit,
  canAdd = false,
  onAdd,
  dynamicHeight = false,
  density = 'compact',
  isLoading = false,
}: TableArgs<T>) => {
  const rowActions: ((params: GridRowParams<any>) => ReactElement)[] = [];
  const toolbarActions: ReactNode[] = [];
  const dialogs: ReactNode[] = [];

  {
    const { toolbarAction, dialog, rowAction } = useTableAdd<T>({
      canAdd,
      onAdd: onAdd!,
    });
    toolbarAction && toolbarActions.push(toolbarAction);
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

  {
    const { dialog, rowAction } = useTableDelete<T>({
      canDelete,
      onDelete: onDelete!,
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
        density={density}
        loading={isLoading}
        getRowHeight={dynamicHeight ? () => 'auto' : undefined}
        slots={{
          toolbar: () => getCustomToolbar(toolbarActions),
        }}
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
export { TableRowAction, UseTableReturnValue };
