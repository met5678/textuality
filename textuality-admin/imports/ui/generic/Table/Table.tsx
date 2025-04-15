import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
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
  GridRowModesModel,
  DataGridProps,
  GridEditMode,
  MuiEvent,
  MuiBaseEvent,
  GridRowEditStopParams,
} from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import useTableDelete from './useTableDelete';
import useTableEdit from './useTableEdit';
import useTableAdd from './useTableAdd';
import useTableAddInline, { NEW_ROW_ID_PREFIX } from './useTableAddInline';
import { useTableErrorSnackbar } from './TableErrorSnackbar';

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
  /** Whether inline add functionality is enabled */
  canAddInline?: boolean;
  /** Callback function for getting a stub for the add operation */
  onGetStub?: () => T;
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
  /** The property name of the ID field */
  idProp?: string;
  /** Initial sort field */
  initialSortField?: string;
  /** Initial sort order */
  initialSortOrder?: 'asc' | 'desc';
  /** Callback for validating rows */
  onValidate?: (row: T) => void;
  /** Whether to use dynamic row heights */
  dynamicHeight?: boolean;
}

interface UseTableReturnValue<T extends GridValidRowModel> {
  toolbarAction?: ReactNode;
  rowAction?: TableRowAction<T>;
  dialog?: ReactNode;
  editMode?: DataGridProps['editMode'];
  handleRowEditStop?: (
    params: GridRowEditStopParams<T>,
    event: MuiEvent<MuiBaseEvent>,
  ) => void;
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
  idProp = '_id',
  canDelete = false,
  onDelete,
  canEdit = false,
  onEdit,
  onEditCell,
  canAdd = false,
  onAdd,
  canAddInline = false,
  onGetStub,
  density = 'compact',
  customRowActions = [],
  isLoading = false,
  paginationModel,
  onPaginationModelChange,
  rowCount,
  paginationMode = 'client',
  initialSortField,
  initialSortOrder = 'asc',
  onValidate,
  dynamicHeight = false,
}: TableArgs<T>) => {
  const [rows, setRows] = useState<GridRowsProp<T>>(data);
  useEffect(() => {
    setRows(data);
  }, [data]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [editMode, setEditMode] = useState<GridEditMode>('cell');
  const rowActions: ((params: GridRowParams<T>) => ReactElement)[] = [
    ...customRowActions,
  ];
  const toolbarActions: ReactNode[] = [];
  const dialogs: ReactNode[] = [];
  const handleRowEditStopCallbacks: ((
    params: GridRowEditStopParams<T>,
    event: MuiEvent<MuiBaseEvent>,
  ) => void)[] = [];
  const { openSnackbar, renderSnackbar } = useTableErrorSnackbar();
  {
    const { dialog, toolbarAction } = useTableAdd<T>({
      canAdd,
      onAdd: onAdd!,
    });
    toolbarAction && toolbarActions.push(toolbarAction);
    dialog && dialogs.push(dialog);
  }

  {
    const { toolbarAction, dialog, rowAction, handleRowEditStop } =
      useTableAddInline<T>({
        canAddInline,
        onGetStub,
        setRowModesModel,
        setEditMode,
        rows,
        setRows,
        idProp,
        columns,
      });
    toolbarAction && toolbarActions.push(toolbarAction);
    rowAction && rowActions.push(rowAction);
    dialog && dialogs.push(dialog);
    handleRowEditStop && handleRowEditStopCallbacks.push(handleRowEditStop);
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
      setRows,
      idProp,
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
        rows={rows}
        columns={useColumns}
        getRowId={(row) => row[idProp]}
        rowSelection={false}
        checkboxSelection={false}
        density={density}
        loading={isLoading}
        getRowHeight={dynamicHeight ? () => 'auto' : undefined}
        onRowEditStop={(params, event) => {
          handleRowEditStopCallbacks.forEach((callback) =>
            callback(params, event),
          );
        }}
        processRowUpdate={(newRow, oldRow) => {
          if (!onEditCell) return newRow;
          const id = newRow[idProp];
          const rowWithoutId = { ...newRow };
          delete rowWithoutId[idProp];
          onValidate?.(rowWithoutId);
          if (
            id &&
            typeof id === 'string' &&
            id.startsWith(NEW_ROW_ID_PREFIX)
          ) {
            return onEditCell?.(rowWithoutId, oldRow);
          }
          return onEditCell?.(newRow, oldRow);
        }}
        onProcessRowUpdateError={(error) => {
          openSnackbar(error.message);
        }}
        slots={{
          toolbar: () => getCustomToolbar(toolbarActions),
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={rowCount}
        paginationMode={paginationMode}
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        editMode={editMode}
        initialState={
          initialSortField
            ? {
                sorting: {
                  sortModel: [
                    { field: initialSortField, sort: initialSortOrder },
                  ],
                },
              }
            : undefined
        }
        aria-label="Data table"
      />
      {dialogs}
      {renderSnackbar()}
    </Paper>
  );
};

export default Table;
export { TableRowAction, UseTableReturnValue };
