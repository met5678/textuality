import React from 'react';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';

import OutTexts from '/imports/api/outTexts';
import { GridColDef } from '@mui/x-data-grid';
import { OutText } from '/imports/schemas/outText';
import usePaginatedTableProps from '../../hooks/use-paginated-table-props';

const columns: GridColDef<OutText>[] = [
  {
    field: 'player_alias',
    headerName: 'Player',
    width: 150,
  },
  {
    field: 'body',
    headerName: 'Text',
    flex: 1,
  },
  {
    field: 'media_url',
    headerName: 'Media',
    valueGetter: (value: OutText['media_url']) => !!value,
    type: 'boolean',
    width: 65,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
  },
  {
    field: 'time',
    headerName: 'Time',
    type: 'dateTime',
    valueFormatter: (value: OutText['time']) =>
      DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_24_WITH_SECONDS),
    width: 95,
  },
];

const OutTextsTable = () => {
  const tableProps = usePaginatedTableProps({
    subscription: 'outTexts.paged',
    collection: OutTexts,
    initialSortField: 'time',
    initialSortOrder: 'desc',
  });

  return <Table columns={columns} {...tableProps} />;
};

export default OutTextsTable;
