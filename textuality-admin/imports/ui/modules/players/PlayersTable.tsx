import React, { useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import Players from '/imports/api/players';
import LoadingBar from '../../generic/LoadingBar';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Player } from '/imports/schemas/player';
import { PlayerWithHelpers } from '/imports/api/players/players';

const tableColumns: GridColDef<PlayerWithHelpers>[] = [
  {
    field: 'phoneNumber',
    headerName: 'Phone #',
    width: 120,
  },
  {
    field: 'avatar',
    headerName: 'Avatar',
    renderCell: (params) => {
      if (!params.value) return null;
      return <img src={params.row.getAvatarUrl(35, 1.2)} />;
    },
    width: 60,
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
      density="standard"
      onDelete={(player) => Meteor.call('players.delete', player)}
      customRowActions={[
        (params) => (
          <GridActionsCellItem
            showInMenu={true}
            label="Give Money"
            onClick={() =>
              Meteor.call('players.giveMoney', {
                playerId: params.row._id,
                money: 100,
              })
            }
          />
        ),
      ]}
    />
  );
};

export default PlayersTable;
