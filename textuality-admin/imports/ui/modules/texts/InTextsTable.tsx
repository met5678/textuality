import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';

import InTexts from '/imports/api/inTexts';
import { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
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
    valueGetter: (cell) => !!cell.value,
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
    valueFormatter: (cell) =>
      DateTime.fromJSDate(cell.value).toLocaleString(
        DateTime.TIME_24_WITH_SECONDS,
      ),
    width: 95,
  },
];

const InTextsTable = () => {
  const isLoading = useSubscribe('inTexts.all');
  const inTexts = useFind(() => InTexts.find({}, { sort: { time: -1 } }), []);

  return <Table isLoading={isLoading()} columns={columns} data={inTexts} />;
};

export default InTextsTable;
