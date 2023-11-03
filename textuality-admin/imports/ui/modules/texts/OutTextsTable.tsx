import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';

import OutTexts from '/imports/api/outTexts';
import { GridColDef } from '@mui/x-data-grid';
import LoadingBar from '../../generic/LoadingBar';

const columns: GridColDef[] = [
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
    valueGetter: (cell) => !!cell.value,
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
    valueFormatter: (cell) =>
      DateTime.fromJSDate(cell.value).toLocaleString(
        DateTime.TIME_24_WITH_SECONDS,
      ),
    width: 95,
  },
];

const InTextsTable = () => {
  const isLoading = useSubscribe('outTexts.all');
  const inTexts = useFind(() => OutTexts.find({}, { sort: { time: -1 } }), []);
  if (isLoading()) return <LoadingBar />;

  return <Table columns={columns} data={inTexts} />;
};

export default InTextsTable;
