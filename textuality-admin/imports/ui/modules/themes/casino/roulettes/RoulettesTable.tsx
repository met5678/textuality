import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import RouletteFormDialog from './RouletteFormDialog';
import Roulettes, {
  RouletteWithHelpers,
} from '/imports/api/themes/casino/roulettes/roulettes';
import RouletteSchema from '/imports/schemas/roulette';

const columns: GridColDef<RouletteWithHelpers>[] = [
  {
    field: 'cost',
    headerName: 'Cost',
    width: 70,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 90,
  },
  {
    field: 'result',
    headerName: 'Result',
    width: 90,
  },
];

const RoulettesTable = () => {
  const isLoading = useSubscribe('roulettes.all');
  const roulettes = useFind(
    () => Roulettes.find({}, { sort: { code: 1 } }),
    [],
  );
  const [editRoulette, setEditRoulette] =
    useState<Partial<RouletteWithHelpers> | null>(null);

  return (
    <>
      <Table<RouletteWithHelpers>
        columns={columns}
        data={roulettes}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(player) => Meteor.call('roulettes.delete', player)}
        canAdd={true}
        onAdd={() => setEditRoulette(RouletteSchema.clean({}))}
        canEdit={true}
        onEdit={setEditRoulette}
        customRowActions={[]}
      />
      <RouletteFormDialog
        model={editRoulette}
        onClose={() => setEditRoulette(null)}
      />
    </>
  );
};

export default RoulettesTable;
