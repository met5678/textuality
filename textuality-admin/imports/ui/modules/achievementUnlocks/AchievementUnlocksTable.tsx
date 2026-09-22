import React from 'react';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import usePaginatedTableProps from '/imports/ui/hooks/use-paginated-table-props';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Players, { PlayerWithHelpers } from '/imports/api/players/players';
import Events from '/imports/api/events';
import { Meteor } from 'meteor/meteor';
import AchievementUnlocks, {
  AchievementUnlockWithHelpers,
} from '/imports/api/achievementUnlocks';
import Achievements from '/imports/api/achievements';
import { AchievementWithHelpers } from '/imports/api/achievements/achievements';

const getColumns = (
  players: PlayerWithHelpers[],
  achievements: AchievementWithHelpers[], // Changed to 'any[]' to avoid the error
): GridColDef<AchievementUnlockWithHelpers>[] => {
  return [
    {
      field: 'player',
      headerName: 'Player',
      width: 120,
      valueGetter: (value: AchievementUnlockWithHelpers['player']) =>
        players.find((player) => player._id === value)?.alias,
    },
    {
      field: 'achievement',
      headerName: 'Achievement',
      width: 200,
      valueGetter: (value: AchievementUnlockWithHelpers['achievement']) =>
        achievements.find((achievement) => achievement._id === value)?.name,
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 100,
      valueGetter: (value: AchievementUnlockWithHelpers['time']) =>
        DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
  ];
};

const AchievementUnlocksTable = () => {
  const tableProps = usePaginatedTableProps({
    subscription: 'achievementUnlocks.paged',
    collection: AchievementUnlocks,
    initialSortField: 'started_at',
    initialSortOrder: 'desc',
  });

  useSubscribe('players.basic');
  useSubscribe('achievements.basic');
  const players = useFind(() => Players.find({ event: Events.currentId() }));
  const achievements = useFind(() =>
    Achievements.find({ event: Events.currentId() }),
  );

  return (
    <Table
      columns={getColumns(players, achievements)}
      {...tableProps}
      canDelete={true}
      onDelete={async (
        item: AchievementUnlockWithHelpers | AchievementUnlockWithHelpers[],
      ) => {
        const ids = Array.isArray(item) ? item.map((i) => i._id) : [item._id];
        return await Meteor.callAsync('derby.achievementUnlocks.delete', ids);
      }}
    />
  );
};

export default AchievementUnlocksTable;
