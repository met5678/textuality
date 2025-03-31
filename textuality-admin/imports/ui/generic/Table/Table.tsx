import React, { ReactElement, ReactNode } from 'react';
import {
  DataGrid,
  GridColDef,
  GridDensity,
  GridRowParams,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarExport,
  GridValidRowModel,
  GridPaginationModel,
  GridToolbarProps,
  GridSlotProps,
  useGridApiContext,
  GridApi,
} from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import useTableDelete from './useTableDelete';
import useTableEdit from './useTableEdit';
import useTableAdd from './useTableAdd';

/**
 * A flexible table component built on top of MUI's DataGrid with built-in CRUD operations
 * @template T - The type of data being displayed in the table
 */
interface TableArgs<T extends GridValidRowModel> {
  /** The data to display in the table */
  data: GridRowsProp<T>;
  /** Column definitions for the table */
  columns: GridColDef<T>[];
  /** Whether delete functionality is enabled */
  canDelete?: boolean;
  /** Callback function for delete operations */
  onDelete?: (obj: T | T[]) => Promise<void> | void;
  /** Whether edit functionality is enabled */
  canEdit?: boolean;
  /** Callback function for edit operations */
  onEdit?: (obj: T) => Promise<void> | void;
  /** Callback function for cell-level edits */
  onEditCell?: (row: T, origRow: T) => Promise<T> | T;
  /** Whether add functionality is enabled */
  canAdd?: boolean;
  /** Callback function for add operations */
  onAdd?: () => Promise<void> | void;
  /** Custom form modal component */
  formModal?: ReactElement;
  /** Whether to use dynamic row heights */
  dynamicHeight?: boolean;
  /** Table density setting */
  density?: GridDensity;
  /** Custom row action components */
  customRowActions?: ((params: GridRowParams<T>) => ReactElement)[];
  /** Loading state */
  isLoading?: boolean;
  /** Current pagination model */
  paginationModel?: GridPaginationModel;
  /** Callback for pagination changes */
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  /** Total number of rows (for server-side pagination) */
  rowCount?: number;
  /** Pagination mode */
  paginationMode?: 'client' | 'server';
  /** Callback for error handling */
  onError?: (error: Error) => void;
}

interface UseTableReturnValue<T extends GridValidRowModel> {
  toolbarAction?: ReactNode;
  rowAction?: TableRowAction<T>;
  dialog?: ReactNode;
}

type TableRowAction<T extends GridValidRowModel> =
  | ((rowParams: GridRowParams<T>) => ReactElement)
  | null;

const applyRowActions = <T extends GridValidRowModel>(
  rowActions: TableRowAction<T>[],
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
  const apiRef = useGridApiContext() as React.MutableRefObject<GridApi>;

  return (
    <GridToolbarContainer>
      {toolbarActions}
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const Table = <T extends GridValidRowModel>({
  data,
  columns,
  canDelete = false,
  onDelete,
  canEdit = false,
  onEdit,
  onEditCell,
  canAdd = false,
  onAdd,
  dynamicHeight = false,
  density = 'compact',
  customRowActions = [],
  isLoading = false,
  paginationModel,
  onPaginationModelChange,
  rowCount,
  paginationMode = 'client',
  onError,
}: TableArgs<T>) => {
  const rowActions: ((params: GridRowParams<T>) => ReactElement)[] = [
    ...customRowActions,
  ];
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

  const useColumns = React.useMemo(
    () => (rowActions.length ? applyRowActions(rowActions, columns) : columns),
    [rowActions, columns],
  );

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DataGrid<T>
        rows={data}
        columns={useColumns}
        getRowId={(row) => row._id}
        rowSelection={false}
        checkboxSelection={false}
        density={density}
        loading={isLoading}
        getRowHeight={dynamicHeight ? () => 'auto' : undefined}
        processRowUpdate={onEditCell}
        onProcessRowUpdateError={(error) => onError?.(error)}
        slots={{
          toolbar: () => getCustomToolbar(toolbarActions),
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={rowCount}
        paginationMode={paginationMode}
        aria-label="Data table"
      />
      {dialogs}
    </Paper>
  );
};

export default Table;
export { TableRowAction, UseTableReturnValue };
