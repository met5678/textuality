import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Race, RaceSchema, WEATHER_VALUES } from '/imports/schemas/derby/race';
import Races from '/imports/api/themes/derby/race';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { DateTime } from 'luxon';
import RaceFormDialog from './RaceFormDialog';
import { RACE_STATUS_VALUES } from '/imports/schemas/derby/race';
import { TableToggle } from '/imports/ui/generic/TableToggle/TableToggle';
import { Button, Typography, Box } from '@mui/material';
import HorseSelectionDialog from './HorseSelectionDialog';
import Missions from '/imports/api/missions';
import { Mission } from '/imports/schemas/mission';
import RaceTimelineDialog from './RaceTimelineDialog';
import { RacePlaybackControls } from './components/RacePlaybackControls';
import { useTableCollectionProps } from '/imports/utils/get-table-collection-props';

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
  const handleStartRace = async (raceId: string) => {
    try {
      await Meteor.callAsync('derby.races.startRace', raceId);
    } catch (error) {
      console.error('Error starting race:', error);
    }
  };

  const handlePauseRace = async (raceId: string) => {
    try {
      await Meteor.callAsync('derby.races.pauseRace', raceId);
    } catch (error) {
      console.error('Error pausing race:', error);
    }
  };

  const handleResumeRace = async (raceId: string) => {
    try {
      await Meteor.callAsync('derby.races.startRace', raceId, true);
    } catch (error) {
      console.error('Error resuming race:', error);
    }
  };

  const handleStopRace = async (raceId: string) => {
    try {
      await Meteor.callAsync('derby.races.stopRace', raceId);
    } catch (error) {
      console.error('Error stopping race:', error);
    }
  };

  return [
    {
      field: 'number',
      headerName: '#',
      width: 60,
      editable: true,
      type: 'number',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 120,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: RACE_STATUS_VALUES.map((status) => ({
        label: status,
        value: status,
      })),
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
      field: 'time_bets_start_at',
      headerName: 'Bets Open',
      width: 100,
      editable: true,
      type: 'dateTime',
      valueFormatter: (value) => {
        if (!value) return '--';
        return DateTime.fromJSDate(value).toFormat('h:mm a');
      },
    },
    {
      field: 'time_race_starts_at',
      headerName: 'Race Start',
      width: 100,
      editable: true,
      type: 'dateTime',
      valueFormatter: (value) => {
        if (!value) return '--';
        return DateTime.fromJSDate(value).toFormat('h:mm a');
      },
    },
    {
      field: 'weather',
      headerName: 'Weather',
      width: 80,
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
      width: 80,
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
      field: 'playback',
      headerName: 'Playback',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RacePlaybackControls
            raceId={params.row._id}
            timeline={params.row.timeline}
            size="small"
            onStart={() => handleStartRace(params.row._id)}
            onPause={() => handlePauseRace(params.row._id)}
            onResume={() => handleResumeRace(params.row._id)}
            onStop={() => handleStopRace(params.row._id)}
          />
          {params.row.timeline?.current_frame !== undefined && (
            <Typography variant="body2" ml={1}>
              {params.row.timeline.current_frame}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'fortune_teller_available',
      headerName: 'Fortune Teller Available',
      width: 80,
      editable: true,
      type: 'boolean',
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
  const isLoading = useSubscribe('derby.races.all');
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

  const tableEditProps = useTableCollectionProps<Race, RaceWithHelpers>(
    RaceSchema,
    Races,
    'derby.races',
    setEditRace,
  );

  return (
    <>
      <Table
        columns={columns}
        data={races}
        isLoading={isLoading() || isLoadingMissions()}
        {...tableEditProps}
        initialSortField="number"
        initialSortOrder="asc"
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.callAsync('derby.races.doPayouts', params.row._id)
              }
              label="Do Payouts"
            />
          ),
        ]}
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
