import React from 'react';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import usePaginatedTableProps from '/imports/ui/hooks/use-paginated-table-props';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Players, { PlayerWithHelpers } from '/imports/api/players/players';
import Events from '/imports/api/events';
import Horses, {
  HorseWithHelpers,
} from '/imports/api/themes/derby/horses/horses';
import { Meteor } from 'meteor/meteor';
import Powerups, {
  PowerupWithHelpers,
} from '/imports/api/themes/derby/powerups/powerups';

const getColumns = (
  players: PlayerWithHelpers[],
  horses: HorseWithHelpers[],
): GridColDef<PowerupWithHelpers>[] => {
  return [
    {
      field: 'horse',
      headerName: 'Horse',
      width: 100,
      valueGetter: (value: PowerupWithHelpers['horse']) =>
        horses.find((horse) => horse._id === value)?.name,
    },
    {
      field: 'player',
      headerName: 'Player',
      width: 100,
      valueGetter: (value: PowerupWithHelpers['player']) =>
        players.find((player) => player._id === value)?.alias,
    },
    {
      field: 'stat',
      headerName: 'Stat',
      width: 120,
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 100,
    },
    {
      field: 'givenAt',
      headerName: 'Given At',
      width: 100,
    },
    {
      field: 'level_at_award_time',
      headerName: 'Lvl at Time',
      width: 100,
    },
    {
      field: 'given_at',
      headerName: 'Given At',
      width: 100,
      valueFormatter: (value: PowerupWithHelpers['given_at']) =>
        DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
  ];
};

const PowerupsTable = () => {
  const tableProps = usePaginatedTableProps({
    subscription: 'derby.powerups.paged',
    collection: Powerups,
    initialSortField: 'started_at',
    initialSortOrder: 'desc',
  });

  useSubscribe('derby.horses.basic');
  useSubscribe('players.basic');
  const players = useFind(() => Players.find({ event: Events.currentId() }));
  const horses = useFind(() => Horses.find({ event: Events.currentId() }));

  return (
    <Table
      columns={getColumns(players, horses)}
      {...tableProps}
      canDelete={true}
      onDelete={async (item: PowerupWithHelpers | PowerupWithHelpers[]) => {
        const ids = Array.isArray(item) ? item.map((i) => i._id) : [item._id];
        return await Meteor.callAsync('derby.powerups.delete', ids);
      }}
    />
  );
};

export default PowerupsTable;
