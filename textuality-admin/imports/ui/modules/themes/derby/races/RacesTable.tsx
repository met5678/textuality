import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import { Race, RaceSchema, WEATHER_VALUES } from '/imports/schemas/derby/race';
import Races from '/imports/api/themes/derby/race';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { DateTime } from 'luxon';
import RaceFormDialog from './RaceFormDialog';
import { RACE_STATUS_VALUES } from '/imports/schemas/derby/race';
import { TableToggle } from '/imports/ui/generic/TableToggle/TableToggle';
import { Button } from '@mui/material';
import HorseSelectionDialog from './HorseSelectionDialog';
import Missions from '/imports/api/missions';
import { Mission } from '/imports/schemas/mission';
import RaceTimelineDialog from './RaceTimelineDialog';
import { Horse } from '/imports/schemas/derby/horse';
import Horses from '/imports/api/themes/derby/horse';

const getColumns = ({
  onEditTimeline,
  onSelectHorses,
  missions,
  onOpenTimeline,
}: {
  onEditTimeline: (race: RaceWithHelpers) => void;
  onSelectHorses: (race: RaceWithHelpers) => void;
  missions: Pick<Mission, 'name' | '_id'>[];
  onOpenTimeline: (race: RaceWithHelpers) => void;
}): GridColDef<RaceWithHelpers>[] => {
  return [
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: RACE_STATUS_VALUES.map((status) => ({
        label: status,
        value: status,
      })),
    },
    {
      field: 'time_bets_start_at',
      headerName: 'Bets Start',
      width: 120,
      editable: true,
      type: 'dateTime',
      valueFormatter: (value) => {
        if (!value) return '--';
        return DateTime.fromJSDate(value).toFormat('h:mm:ss a');
      },
    },
    {
      field: 'time_race_starts_at',
      headerName: 'Race Start',
      width: 120,
      editable: true,
      type: 'dateTime',
      valueFormatter: (value) => {
        if (!value) return '--';
        return DateTime.fromJSDate(value).toFormat('h:mm:ss a');
      },
    },
    {
      field: 'weather',
      headerName: 'Weather',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: WEATHER_VALUES.map((status) => ({
        label: status,
        value: status,
      })),
    },
    {
      field: 'furlong_length',
      headerName: 'Furlongs',
      width: 100,
      editable: true,
      type: 'number',
    },
    {
      field: 'horses',
      headerName: 'Horses',
      width: 90,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => onSelectHorses(params.row)}
            variant="outlined"
            size="small"
          >
            {params.row.horses?.length || 0}
          </Button>
        );
      },
    },
    {
      field: 'timeline',
      headerName: 'Timeline',
      width: 110,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => onOpenTimeline(params.row)}
        >
          Timeline
        </Button>
      ),
    },
    {
      field: 'scheduled',
      headerName: 'Scheduled',
      width: 100,
      type: 'boolean',
      editable: true,
      renderCell: (params) => <TableToggle {...params} />,
    },
    {
      field: 'linked_mission',
      headerName: 'Mission',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueFormatter: (value) => {
        if (!value) return '--';
        const mission = missions.find((mission) => mission._id === value);
        return mission?.name || '--';
      },
      valueOptions: [
        { label: '-- None --', value: '' },
        ...missions.map((mission) => ({
          label: mission.name,
          value: mission._id,
        })),
      ],
    },
  ];
};

const RacesTable = () => {
  const isLoading = useSubscribe('races.all');
  const races = useFind(
    () => Races.find({}, { sort: { time_bets_start_at: 1 } }),
    [],
  );
  const [editRace, setEditRace] = useState<Partial<Race> | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [isHorseDialogOpen, setIsHorseDialogOpen] = useState(false);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);

  const isLoadingMissions = useSubscribe('missions.all');
  const missions = useFind(
    () => Missions.find({}, { sort: { number: 1 } }),
    [],
  );

  const columns = getColumns({
    onEditTimeline: (race) => setEditRace(race),
    onSelectHorses: (race) => {
      setSelectedRace(race);
      setIsHorseDialogOpen(true);
    },
    missions,
    onOpenTimeline: (race) => {
      setSelectedRace(race);
      setIsTimelineDialogOpen(true);
    },
  });

  return (
    <>
      <Table
        columns={columns}
        data={races}
        isLoading={isLoading() || isLoadingMissions()}
        canDelete={true}
        onDelete={(selectedRaces: RaceWithHelpers | RaceWithHelpers[]) => {
          const ids = Array.isArray(selectedRaces)
            ? selectedRaces.map((race) => race._id)
            : [selectedRaces._id];
          Meteor.call('derby.races.delete', ids);
        }}
        canAdd={true}
        onAdd={() => setEditRace(RaceSchema.clean({}))}
        canEdit={true}
        onEdit={setEditRace}
        onEditCell={(race) => {
          Meteor.call('derby.races.update', race);
          return race;
        }}
      />
      <RaceFormDialog model={editRace} onClose={() => setEditRace(null)} />
      {selectedRace && isHorseDialogOpen && (
        <HorseSelectionDialog
          race={selectedRace}
          onClose={() => {
            setIsHorseDialogOpen(false);
            setSelectedRace(null);
          }}
        />
      )}
      {selectedRace && isTimelineDialogOpen && (
        <RaceTimelineDialog
          raceId={selectedRace._id}
          onClose={() => {
            setIsTimelineDialogOpen(false);
            setSelectedRace(null);
          }}
        />
      )}
    </>
  );
};

export default RacesTable;
