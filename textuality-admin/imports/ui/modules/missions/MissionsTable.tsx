import React, { useState } from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';

import Missions from '/imports/api/missions';
import MissionSchema, { Mission } from '/imports/schemas/mission';
import { Meteor } from 'meteor/meteor';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import Table from '../../generic/Table/Table';
import MissionFormDialog from './MissionFormDialog';

const columns: GridColDef<Mission>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'number',
    headerName: 'Num',
    width: 50,
  },
  {
    field: 'minutes',
    headerName: 'Mins',
    width: 50,
  },
  {
    field: 'active',
    headerName: 'Active',
    type: 'boolean',
    width: 60,
  },
  {
    field: 'timeStart',
    headerName: 'Starts',
    valueFormatter: (params) =>
      params.value
        ? DateTime.fromJSDate(params.value).toLocaleString(DateTime.TIME_SIMPLE)
        : '--',
    width: 150,
  },
  {
    field: 'timeEnd',
    headerName: 'Ends',
    valueFormatter: (params) =>
      params.value
        ? DateTime.fromJSDate(params.value).toLocaleString(DateTime.TIME_SIMPLE)
        : '--',
    width: 150,
  },
];

const MissionsTable = () => {
  const isLoading = useSubscribe('missions.all');
  const missions = useFind(() => Missions.find({}), []);
  const [editMission, setEditMission] = useState<Partial<Mission> | null>(null);

  return (
    <>
      <Table<Mission>
        columns={columns}
        data={missions}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(mission) => {
          Meteor.call(
            'missions.delete',
            mission.map((r) => r._id),
          );
        }}
        canAdd={true}
        onAdd={() => setEditMission(MissionSchema.clean({}))}
        canEdit={true}
        onEdit={setEditMission}
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.call('missions.start', { missionId: params.row._id })
              }
              label="Start Mission"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.call('missions.end', { missionId: params.row._id })
              }
              label="End Mission"
            />
          ),
        ]}
      />
      <MissionFormDialog
        model={editMission}
        onClose={() => setEditMission(null)}
      />
    </>
  );
};

export default MissionsTable;
