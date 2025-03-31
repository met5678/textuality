import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import { Race, RaceSchema } from '/imports/schemas/derby/race';
import Races from '/imports/api/themes/derby/race';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { DateTime } from 'luxon';
import RaceFormDialog from './RaceFormDialog';

const columns: GridColDef<RaceWithHelpers>[] = [
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
  },
  {
    field: 'time_bets_start_at',
    headerName: 'Bets Start',
    width: 180,
    valueGetter: (_value, row) =>
      row.time_bets_start_at
        ? DateTime.fromJSDate(row.time_bets_start_at).toFormat(
            'yyyy-MM-dd HH:mm:ss',
          )
        : '',
  },
  {
    field: 'time_race_starts_at',
    headerName: 'Race Start',
    width: 180,
    valueGetter: (_value, row) =>
      row.time_race_starts_at
        ? DateTime.fromJSDate(row.time_race_starts_at).toFormat(
            'yyyy-MM-dd HH:mm:ss',
          )
        : '',
  },
  {
    field: 'track_condition',
    headerName: 'Track',
    width: 100,
  },
  {
    field: 'horses',
    headerName: 'Horses',
    width: 100,
    valueGetter: (_value, row) => row.horses?.length || 0,
  },
  {
    field: 'scheduled',
    headerName: 'Scheduled',
    width: 100,
    type: 'boolean',
  },
];

const RacesTable = () => {
  const isLoading = useSubscribe('races.all');
  const races = useFind(
    () => Races.find({}, { sort: { time_bets_start_at: 1 } }),
    [],
  );
  const [editRace, setEditRace] = useState<Partial<Race> | null>(null);

  return (
    <>
      <Table
        columns={columns}
        data={races}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(selectedRaces: RaceWithHelpers | RaceWithHelpers[]) => {
          const ids = Array.isArray(selectedRaces)
            ? selectedRaces.map((race) => race._id)
            : [selectedRaces._id];
          Meteor.call('races.delete', ids);
        }}
        canAdd={true}
        onAdd={() => setEditRace(RaceSchema.clean({}))}
        canEdit={true}
        onEdit={setEditRace}
      />
      <RaceFormDialog model={editRace} onClose={() => setEditRace(null)} />
    </>
  );
};

export default RacesTable;
