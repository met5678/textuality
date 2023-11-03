import React, { useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import Players from '/imports/api/players';
import LoadingBar from '../../generic/LoadingBar';
import { GridColDef } from '@mui/x-data-grid';

const tableColumns: GridColDef[] = [
  {
    field: 'phoneNumber',
    headerName: 'Phone #',
    width: 120,
  },
  {
    field: 'alias',
    headerName: 'Alias',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 90,
  },
  {
    field: 'money',
    headerName: 'Money',
    type: 'number',
    width: 60,
  },
  {
    field: 'checkpoints',
    headerName: 'Hashtags',
    type: 'number',
    valueGetter: (cell) => cell.value.length,
    width: 80,
  },
  {
    field: 'joined',
    headerName: 'Joined',
    type: 'dateTime',
    width: 95,
  },
  {
    field: 'recent',
    headerName: 'Recent',
    type: 'dateTime',
    width: 95,
  },
];

const PlayersTable = () => {
  const isLoading = useSubscribe('players.all');
  const players = useFind(() => Players.find(), []);
  const columns = useMemo(() => tableColumns, []);

  if (isLoading()) return <LoadingBar />;

  return (
    <Table
      columns={columns}
      data={players}
      canDelete={true}
      onDelete={(player) => Meteor.call('players.delete', player)}
    />
  );
};

export default PlayersTable;
