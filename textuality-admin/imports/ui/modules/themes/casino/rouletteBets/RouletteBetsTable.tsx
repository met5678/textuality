import React from 'react';
import { DateTime } from 'luxon';
import { Meteor } from 'meteor/meteor';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { GridColDef } from '@mui/x-data-grid';

import RouletteBets, {
  RouletteBetWithHelpers,
} from '/imports/api/themes/casino/rouletteBets/rouletteBets';
import Roulettes, {
  RouletteWithHelpers,
} from '/imports/api/themes/casino/roulettes/roulettes';
import Events from '/imports/api/events';
import Table from '/imports/ui/generic/Table/Table';
import usePaginatedTableProps from '/imports/ui/hooks/use-paginated-table-props';

const formatTime = (value?: Date) =>
  value
    ? DateTime.fromJSDate(value).toLocaleString(DateTime.DATETIME_SHORT)
    : '--';

const getColumns = (
  roulettes: RouletteWithHelpers[],
): GridColDef<RouletteBetWithHelpers>[] => [
  {
    field: 'player',
    headerName: 'Player',
    width: 130,
    valueGetter: (value: RouletteBetWithHelpers['player']) => value.alias,
  },
  {
    field: 'roulette_id',
    headerName: 'Roulette',
    width: 150,
    valueGetter: (value: RouletteBetWithHelpers['roulette_id']) => {
      const roulette = roulettes.find((item) => item._id === value);
      return roulette ? formatTime(roulette.spin_starts_at) : value;
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
  },
  {
    field: 'step',
    headerName: 'Step',
    width: 100,
  },
  {
    field: 'bet_slot',
    headerName: 'Bet',
    width: 90,
  },
  {
    field: 'wager',
    headerName: 'Wager',
    type: 'number',
    width: 90,
  },
  {
    field: 'win_payout',
    headerName: 'Payout',
    type: 'number',
    width: 90,
  },
  {
    field: 'time',
    headerName: 'Started At',
    width: 150,
    valueFormatter: (value: RouletteBetWithHelpers['time']) =>
      formatTime(value),
  },
  {
    field: 'placed_at',
    headerName: 'Placed At',
    width: 150,
    valueFormatter: (value: RouletteBetWithHelpers['placed_at']) =>
      formatTime(value),
  },
];

const RouletteBetsTable = () => {
  const tableProps = usePaginatedTableProps({
    subscription: 'rouletteBets.paged',
    collection: RouletteBets,
    initialSortField: 'time',
    initialSortOrder: 'desc',
  });

  useSubscribe('roulettes.all');
  const roulettes = useFind(() =>
    Roulettes.find({ event: Events.currentId() }),
  );

  return (
    <Table
      columns={getColumns(roulettes)}
      {...tableProps}
      canDelete={true}
      onDelete={async (
        item: RouletteBetWithHelpers | RouletteBetWithHelpers[],
      ) => {
        const ids = Array.isArray(item)
          ? item.map((bet) => bet._id)
          : [item._id];
        await Meteor.callAsync('rouletteBets.delete', ids);
      }}
    />
  );
};

export default RouletteBetsTable;
