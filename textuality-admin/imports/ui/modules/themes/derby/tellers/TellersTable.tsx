import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import Tellers, {
  TellerWithHelpers,
} from '/imports/api/themes/derby/tellers/tellers';
import { TELLER_ACTORS, TellerSchema } from '/imports/schemas/derby/teller';
import RaceBets from '/imports/api/themes/derby/raceBets';
import { useTableCollectionProps } from '/imports/utils/get-table-collection-props';
import { TELLER_STATUS } from '/imports/schemas/derby/teller-status/teller-status';
import { Meteor } from 'meteor/meteor';
import Players, { PlayerWithHelpers } from '/imports/api/players/players';
import Events from '/imports/api/events';
import Fortunes from '/imports/api/themes/derby/fortunes';
import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';
import { TableToggle } from '/imports/ui/generic/TableToggle/TableToggle';

const getColumns = (
  players: PlayerWithHelpers[],
  raceBets: RaceBetWithHelpers[],
): GridColDef<TellerWithHelpers>[] => [
  {
    field: 'url',
    headerName: 'Url',
    width: 120,
    editable: true,
  },
  {
    field: 'actor',
    headerName: 'Actor',
    width: 70,
    type: 'singleSelect',
    valueOptions: [...TELLER_ACTORS],
    editable: true,
  },
  {
    field: 'min_wager',
    headerName: 'Min Wager',
    width: 90,
    editable: true,
    type: 'number',
  },
  {
    field: 'text_code',
    headerName: 'Text Code',
    width: 90,
    editable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    editable: true,
    type: 'singleSelect',
    valueOptions: Array.from(TELLER_STATUS),
  },
  {
    field: 'time_left',
    headerName: 'Time Left',
    width: 90,
    type: 'number',
    editable: true,
  },
  {
    field: 'current_player',
    headerName: 'Player',
    width: 90,
    valueGetter: (value: TellerWithHelpers['current_player']) => {
      const player = players.find((p) => p._id === value);
      return player?.alias;
    },
  },
  {
    field: 'current_bet',
    headerName: 'Current',
    width: 90,
    valueFormatter: (value: TellerWithHelpers['current_bet']) => {
      const bet = raceBets.find((b) => b._id === value);
      return bet?.step;
    },
  },
  {
    field: 'unscheduled',
    headerName: 'Unscheduled',
    width: 90,
    type: 'boolean',
    editable: true,
    renderCell: (params) => <TableToggle {...params} />,
  },
];

const TellersTable = () => {
  const isLoading = useSubscribe('derby.tellers.all');
  const tellers = useFind(() => Tellers.find({}, { sort: { url: 1 } }), []);

  const tableEditProps = useTableCollectionProps(
    TellerSchema,
    Tellers,
    'derby.tellers',
  );

  useSubscribe('players.basic');
  useSubscribe('derby.raceBets.pending');
  const players = useFind(() => Players.find({ event: Events.currentId() }));
  const raceBets = useFind(() => RaceBets.find({ event: Events.currentId() }));

  return (
    <>
      <Table<TellerWithHelpers>
        columns={getColumns(players, raceBets)}
        data={tellers}
        isLoading={isLoading()}
        {...tableEditProps}
        initialSortField="url"
        initialSortOrder="asc"
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.open', params.row._id)
              }
              label="Open Teller"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.startBet', params.row._id)
              }
              label="Start Bet"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.updateBet', params.row._id)
              }
              label="Update Bet"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.completeBet', params.row._id)
              }
              label="Complete Bet"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.cancelBet', params.row._id)
              }
              label="Cancel Bet"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.close', params.row._id)
              }
              label="Close Teller"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.sitdown', params.row._id)
              }
              label="Sit Down Teller"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.tellers.standup', params.row._id)
              }
              label="Stand Up Teller"
            />
          ),
        ]}
      />
    </>
  );
};

export default TellersTable;
