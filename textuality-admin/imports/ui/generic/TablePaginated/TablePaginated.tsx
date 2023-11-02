import React, { useState } from 'react';
import { useTable, usePagination, useRowSelect } from 'react-table';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { useTableDelete, useTableDuplicate } from './Table2.hooks';

import TablePagination from './TablePagination';
import TableSearch from './TableSearch';

const Table2 = ({
  columns,
  data,
  setQuery,
  loading,
  total,
  count = 20,
  title,

  canDelete,
  onDelete = () => {},
  canDuplicate,
  onDuplicate = () => {},

  onRowClick,

  customActions = [],
}) => {
  if (!total) total = data.length;
  const tableData = React.useMemo(() => data, [data]);
  const pageCount = Math.ceil(total / count);

  let cellActions = [
    ...useTableDelete({ canDelete, onDelete }).cellActions,
    ...useTableDuplicate({ canDuplicate, onDuplicate }).cellActions,
  ];

  const tableColumns = React.useMemo(() => {
    const useColumns = [...columns];
    if (cellActions.length) {
      useColumns.push({
        id: '_actions',
        overrideWidth: 65 * cellActions.length,
        Cell: ({ row }) => {
          return cellActions.map((action) => {
            const { Component, label } = action;
            return <Component key={label} item={row.original} />;
          });
        },
      });
    }
    return useColumns;
  }, [cellActions.length]);

  const tableInstance = useTable(
    {
      columns: tableColumns,
      data: tableData,
      getRowId: (row) => row._id,

      initialState: { pageSize: count },
      manualPagination: true,
      pageCount,

      autoResetSelectedRows: false,
    },
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,

    gotoPage,
    setPageSize,

    getToggleAllPageRowsSelectedProps,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const [search, setSearch] = useState('');
  React.useEffect(() => {
    setQuery({ page: pageIndex, count: pageSize, search });
  }, [setQuery, pageIndex, pageSize, search]);

  return (
    <>
      <TableSearch
        title={title}
        setSearch={setSearch}
        search={search}
        customActions={customActions}
      />
      <TableContainer>
        <Table {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                sx={(theme) => ({
                  backgroundColor: theme.palette.common.black,
                  color: theme.palette.common.white,
                })}
              >
                <TableCell padding="checkbox">
                  <Checkbox {...getToggleAllPageRowsSelectedProps()} />
                </TableCell>

                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps()}
                    style={{
                      width: column.overrideWidth
                        ? `${column.overrideWidth}px`
                        : 'auto',
                    }}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              row;
              return (
                <TableRow {...row.getRowProps()} hover={false}>
                  <TableCell padding="checkbox">
                    <Checkbox {...row.getToggleRowSelectedProps()} />
                  </TableCell>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        gotoPage={gotoPage}
        setPageSize={setPageSize}
        total={total}
        pageSize={pageSize}
        pageIndex={pageIndex}
        loading={loading}
      />
    </>
  );
};

export default Table2;
