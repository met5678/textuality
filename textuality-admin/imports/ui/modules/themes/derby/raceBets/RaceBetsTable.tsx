import React from 'react';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import RaceBets, {
  RaceBetWithHelpers,
} from '/imports/api/themes/derby/raceBets/raceBets';
import usePaginatedTableProps from '/imports/ui/hooks/use-paginated-table-props';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Races, { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import Players, { PlayerWithHelpers } from '/imports/api/players/players';
import Tellers, {
  TellerWithHelpers,
} from '/imports/api/themes/derby/tellers/tellers';
import Events from '/imports/api/events';
import Horses, {
  HorseWithHelpers,
} from '/imports/api/themes/derby/horses/horses';

const getColumns = (
  races: RaceWithHelpers[],
  tellers: TellerWithHelpers[],
  players: PlayerWithHelpers[],
  horses: HorseWithHelpers[],
): GridColDef<RaceBetWithHelpers>[] => {
  return [
    {
      field: 'player',
      headerName: 'Player',
      width: 100,
      valueGetter: (value: RaceBetWithHelpers['player']) =>
        players.find((player) => player._id === value)?.alias,
    },
    {
      field: 'teller',
      headerName: 'Teller',
      width: 100,
      valueGetter: (value: RaceBetWithHelpers['teller']) =>
        tellers.find((teller) => teller._id === value)?.url,
    },
    {
      field: 'race',
      headerName: 'Race',
      width: 70,
      valueGetter: (value: RaceBetWithHelpers['race']) => {
        return races.find((race) => race._id === value)?.number;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
    },
    {
      field: 'step',
      headerName: 'Step',
      width: 100,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
    },
    {
      field: 'wager',
      headerName: 'Wager',
      width: 100,
    },
    {
      field: 'horses',
      headerName: 'Horse(s)',
      width: 100,
      valueGetter: (value: RaceBetWithHelpers['horses']) => {
        return value
          ?.map((horse) => horses.find((h) => h._id === horse)?.short_name)
          .join(', ');
      },
    },
    {
      field: 'started_at',
      headerName: 'Started At',
      width: 120,
      valueFormatter: (value: RaceBetWithHelpers['started_at']) =>
        DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
  ];
};

const RaceBetsTable = () => {
  const tableProps = usePaginatedTableProps({
    subscription: 'derby.raceBets.paged',
    collection: RaceBets,
    initialSortField: 'started_at',
    initialSortOrder: 'desc',
  });

  useSubscribe('derby.races.basic');
  useSubscribe('derby.tellers.basic');
  useSubscribe('derby.horses.basic');
  useSubscribe('players.basic');
  const races = useFind(() => Races.find({ event: Events.currentId() }));
  const tellers = useFind(() => Tellers.find({ event: Events.currentId() }));
  const players = useFind(() => Players.find({ event: Events.currentId() }));
  const horses = useFind(() => Horses.find({ event: Events.currentId() }));

  return (
    <Table
      columns={getColumns(races, tellers, players, horses)}
      {...tableProps}
    />
  );
};

export default RaceBetsTable;
