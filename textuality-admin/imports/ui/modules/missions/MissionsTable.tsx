import React, { useState } from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';

import Missions from '/imports/api/missions';
import MissionSchema, { Mission } from '/imports/schemas/mission';
import { Meteor } from 'meteor/meteor';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import Table from '../../generic/Table/Table';
import MissionFormDialog from './MissionFormDialog';
import { useTableCollectionProps } from '/imports/utils/get-table-collection-props';

const columns: GridColDef<Mission>[] = [
  {
    field: 'number',
    headerName: 'Num',
    width: 70,
    type: 'number',
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    editable: true,
  },
  {
    field: 'minutes',
    headerName: 'Mins',
    width: 70,
    type: 'number',
    editable: true,
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
    valueFormatter: (value: Mission['timeStart']) =>
      value
        ? DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_SIMPLE)
        : '--',
    width: 150,
    editable: true,
  },
  {
    field: 'timeEnd',
    headerName: 'Ends',
    valueFormatter: (value: Mission['timeEnd']) =>
      value
        ? DateTime.fromJSDate(value).toLocaleString(DateTime.TIME_SIMPLE)
        : '--',
    width: 150,
    editable: true,
  },
];

const MissionsTable = () => {
  const isLoading = useSubscribe('missions.all');
  const missions = useFind(() => Missions.find({}), []);
  const [editMission, setEditMission] = useState<Partial<Mission> | null>(null);

  const tableEditProps = useTableCollectionProps(
    MissionSchema,
    Missions,
    'missions',
    setEditMission,
  );

  return (
    <>
      <Table<Mission>
        columns={columns}
        data={missions}
        isLoading={isLoading()}
        {...tableEditProps}
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
