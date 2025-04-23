import React from 'react';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';

import InTexts from '/imports/api/inTexts';
import { GridColDef } from '@mui/x-data-grid';
import { InTextWithHelpers } from '/imports/api/inTexts/inTexts';
import usePaginatedTableProps from '../../hooks/use-paginated-table-props';

const columns: GridColDef<InTextWithHelpers>[] = [
  {
    field: 'alias',
    headerName: 'Player',
    width: 150,
  },
  {
    field: 'body',
    headerName: 'Text',
    flex: 1,
  },
  {
    field: 'media',
    headerName: 'Media',
    valueGetter: (value: InTextWithHelpers['media']) => !!value,
    type: 'boolean',
    width: 65,
  },
  {
    field: 'purpose',
    headerName: 'Purpose',
    width: 100,
  },
  {
    field: 'time',
    headerName: 'Time',
    type: 'dateTime',
    valueFormatter: (value: InTextWithHelpers['time']) =>
      DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_24_WITH_SECONDS),
    width: 95,
  },
];

const InTextsTable = () => {
  const tableProps = usePaginatedTableProps({
    subscription: 'inTexts.paged',
    collection: InTexts,
  });

  return <Table columns={columns} {...tableProps} />;
};

export default InTextsTable;
