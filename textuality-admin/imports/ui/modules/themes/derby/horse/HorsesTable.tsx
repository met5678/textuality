import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import { HorseSchema, Horse } from '/imports/schemas/derby/horse';
import Horses from '/imports/api/themes/derby/horse';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import HorseFormDialog from './HorseFormDialog';

const columns: GridColDef<HorseWithHelpers>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
  },
  {
    field: 'short_name',
    headerName: 'Short Name',
    width: 90,
  },
  {
    field: 'color',
    headerName: 'Color',
    width: 90,
  },
  {
    field: 'stats.speed',
    headerName: 'Speed',
    type: 'number',
    width: 70,
  },
  {
    field: 'stats.endurance',
    headerName: 'Endurance',
    type: 'number',
    width: 70,
  },
  {
    field: 'stats.luck',
    headerName: 'Luck',
    type: 'number',
    width: 70,
  },
  {
    field: 'stats.traction',
    headerName: 'Traction',
    type: 'number',
    width: 70,
  },
  {
    field: 'stats.distractibility',
    headerName: 'Distractibility',
    type: 'number',
    width: 70,
  },
  {
    field: 'stats.boots',
    headerName: 'Boots',
    type: 'number',
    width: 70,
  },
  {
    field: 'totalStats',
    headerName: 'Total Stats',
    valueGetter: (params) => params.row.getTotalStats(),
    type: 'number',
    width: 70,
  },
];

const HorsesTable = () => {
  const isLoading = useSubscribe('horses.all');
  const horses = useFind(
    () => Horses.find({}, { sort: { name: 1 } }),
    [],
  );
  const [editHorse, setEditHorse] = useState<Partial<Horse> | null>(null);

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
          Meteor.call('horses.delete', ids);
        }}
        canAdd={true}
        onAdd={() => setEditHorse(HorseSchema.clean({}))}
        canEdit={true}
        onEdit={setEditHorse}
      />
      <HorseFormDialog
        model={editHorse}
        onClose={() => setEditHorse(null)}
      />
    </>
  );
};

export default HorsesTable; 