import React from 'react';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';
import { GridColDef } from '@mui/x-data-grid';
import Fortunes, {
  FortuneWithHelpers,
} from '/imports/api/themes/derby/fortunes/fortunes';
import usePaginatedTableProps from '/imports/ui/hooks/use-paginated-table-props';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Players, { PlayerWithHelpers } from '/imports/api/players/players';
import Tellers, {
  TellerWithHelpers,
} from '/imports/api/themes/derby/tellers/tellers';
import Events from '/imports/api/events';
import { Meteor } from 'meteor/meteor';

const getColumns = (
  tellers: TellerWithHelpers[],
  players: PlayerWithHelpers[],
): GridColDef<FortuneWithHelpers>[] => {
  return [
    {
      field: 'player',
      headerName: 'Player',
      width: 100,
      valueGetter: (value: FortuneWithHelpers['player']) =>
        players.find((player) => player._id === value)?.alias,
    },
    {
      field: 'teller',
      headerName: 'Teller',
      width: 100,
      valueGetter: (value: FortuneWithHelpers['teller']) =>
        tellers.find((teller) => teller._id === value)?.url,
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
      field: 'fortune',
      headerName: 'Fortune',
      width: 200,
    },
    {
      field: 'started_at',
      headerName: 'Started At',
      width: 120,
      valueFormatter: (value: FortuneWithHelpers['started_at']) =>
        DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
  ];
};

const FortunesTable = () => {
  const tableProps = usePaginatedTableProps({
    subscription: 'derby.fortunes.paged',
    collection: Fortunes,
    initialSortField: 'started_at',
    initialSortOrder: 'desc',
  });

  useSubscribe('derby.tellers.basic');
  useSubscribe('players.basic');
  const tellers = useFind(() => Tellers.find({ event: Events.currentId() }));
  const players = useFind(() => Players.find({ event: Events.currentId() }));

  return (
    <Table
      columns={getColumns(tellers, players)}
      {...tableProps}
      canDelete={true}
      onDelete={async (item: FortuneWithHelpers | FortuneWithHelpers[]) => {
        const ids = Array.isArray(item) ? item.map((i) => i._id) : [item._id];
        return await Meteor.callAsync('derby.fortunes.delete', ids);
      }}
    />
  );
};

export default FortunesTable;
