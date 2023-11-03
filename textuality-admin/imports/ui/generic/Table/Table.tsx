import React, { ReactElement } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

interface TableArgs {
  data: GridRowsProp;
  columns: GridColDef[];
  canDelete?: boolean;
  onDelete?: (_id: string) => void | Promise<unknown>;
  canEdit?: boolean;
  onEdit?: (obj: any) => void | Promise<unknown>;
}

const Table = ({
  data,
  columns,
  canDelete,
  onDelete,
  canEdit,
  onEdit,
}: TableArgs) => {
  const actions: ((params: GridRowParams<any>) => ReactElement)[] = [];

  if (canEdit) {
    actions.push((params) => (
      <GridActionsCellItem
        icon={<EditTwoToneIcon />}
        onClick={() => onEdit?.(params.row)}
        label="Edit"
      />
    ));
  }

  if (canDelete) {
    actions.push((params) => (
      <GridActionsCellItem
        icon={<DeleteForeverTwoToneIcon />}
        onClick={() => onDelete?.(params.row._id)}
        label="Delete"
      />
    ));
  }

  if (actions.length) {
    columns = [
      ...columns,
      {
        field: 'actions',
        type: 'actions',
        getActions: (params) => actions.map((action) => action(params)),
      },
    ];
  }

  return (
    <Paper>
      <DataGrid
        rows={data}
        columns={columns}
        autoHeight={true}
        getRowId={(row) => row._id}
        rowSelection={false}
        checkboxSelection={false}
        density="compact"
      />
    </Paper>
  );

  // const table = useReactTable({
  //   columns,
  //   data,
  //   getCoreRowModel: getCoreRowModel(),
  // });

  // return (
  //   <TableContainer component={Paper}>
  //     <MuiTable>
  //       <TableHead>
  //         {table.getHeaderGroups().map((headerGroup) => (
  //           <TableRow key={headerGroup.id}>
  //             {headerGroup.headers.map((header) => (
  //               <TableCell key={header.id}>
  //                 {flexRender(
  //                   header.column.columnDef.header,
  //                   header.getContext(),
  //                 )}
  //               </TableCell>
  //             ))}
  //           </TableRow>
  //         ))}
  //       </TableHead>
  //       <TableBody>
  //         {table.getRowModel().rows.map((row) => (
  //           <TableRow key={row.id}>
  //             {row.getVisibleCells().map((cell) => (
  //               <TableCell key={cell.id}>
  //                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //               </TableCell>
  //             ))}
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </MuiTable>
  //   </TableContainer>
  // );
};

export default Table;
