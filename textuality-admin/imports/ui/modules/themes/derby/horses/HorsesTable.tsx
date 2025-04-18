import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import { HorseSchema, Horse } from '/imports/schemas/derby/horse';
import Horses from '../../../../../api/themes/derby/horses';
import { HorseWithHelpers } from '../../../../../api/themes/derby/horses/horses';
import HorseFormDialog from './HorseFormDialog';
import Events from '/imports/api/events';
import { getStubWithEvent } from '/imports/utils/get-stub-with-event';

const columns: GridColDef<HorseWithHelpers>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
    editable: true,
  },
  {
    field: 'number',
    headerName: 'Number',
    type: 'number',
    width: 65,
    editable: true,
  },
  {
    field: 'short_name',
    headerName: 'Short',
    width: 90,
    editable: true,
  },
  {
    field: 'color',
    headerName: 'Color',
    width: 90,
    editable: true,
    renderCell: (params) => {
      return (
        <div
          style={{
            backgroundColor: params.value,
            width: '100%',
            height: '100%',
          }}
        />
      );
    },
  },
  {
    field: 'speed',
    headerName: 'Spd',
    type: 'number',
    width: 70,
    editable: true,
    valueGetter: (_value, row) => row.stats?.speed ?? 0,
    valueSetter: (value, row) => {
      return {
        ...row,
        stats: {
          ...row.stats,
          speed: value,
        },
      };
    },
  },
  {
    field: 'endurance',
    headerName: 'End',
    type: 'number',
    width: 70,
    editable: true,
    valueGetter: (_value, row) => row.stats?.endurance ?? 0,
    valueSetter: (value, row) => {
      return {
        ...row,
        stats: { ...row.stats, endurance: value },
      };
    },
  },
  {
    field: 'luck',
    headerName: 'Luck',
    type: 'number',
    width: 70,
    editable: true,
    valueGetter: (_value, row) => row.stats?.luck ?? 0,
    valueSetter: (value, row) => {
      return {
        ...row,
        stats: { ...row.stats, luck: value },
      };
    },
  },
  {
    field: 'competitiveness',
    headerName: 'Comp',
    type: 'number',
    width: 70,
    editable: true,
    valueGetter: (_value, row) => row.stats?.competitiveness ?? 0,
    valueSetter: (value, row) => {
      return {
        ...row,
        stats: { ...row.stats, competitiveness: value },
      };
    },
  },
  {
    field: 'water_resistance',
    headerName: 'Water',
    type: 'number',
    width: 70,
    editable: true,
    valueGetter: (_value, row) => row.stats?.water_resistance ?? 0,
    valueSetter: (value, row) => {
      return {
        ...row,
        stats: { ...row.stats, water_resistance: value },
      };
    },
  },
  {
    field: 'wind_resistance',
    headerName: 'Wind',
    type: 'number',
    width: 70,
    editable: true,
    valueGetter: (_value, row) => row.stats?.wind_resistance ?? 0,
    valueSetter: (value, row) => {
      return {
        ...row,
        stats: { ...row.stats, wind_resistance: value },
      };
    },
  },
  {
    field: 'electric_resistance',
    headerName: 'Elec',
    type: 'number',
    width: 70,
    editable: true,
    valueGetter: (_value, row) => row.stats?.electric_resistance ?? 0,
    valueSetter: (value, row) => {
      return {
        ...row,
        stats: { ...row.stats, electric_resistance: value },
      };
    },
  },
];

const HorsesTable = () => {
  const isLoading = useSubscribe('horses.all');
  const horses = useFind(() => Horses.find({}, { sort: { name: 1 } }), []);

  return (
    <>
      <Table<HorseWithHelpers>
        columns={columns}
        data={horses}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(selectedHorses: HorseWithHelpers | HorseWithHelpers[]) => {
          const ids = Array.isArray(selectedHorses)
            ? selectedHorses.map((horse) => horse._id)
            : [selectedHorses._id];
          Meteor.call('derby.horses.delete', ids);
        }}
        canAddInline={true}
        onGetStub={() => getStubWithEvent<HorseWithHelpers>(HorseSchema)}
        onValidate={(horse) => HorseSchema.validate(horse)}
        onEditCell={async (horse) => {
          horse.event = Events.currentId()!;
          const newHorse = await Meteor.callAsync('derby.horses.upsert', horse);
          return newHorse;
        }}
        initialSortField="number"
        initialSortOrder="asc"
      />
    </>
  );
};

export default HorsesTable;
