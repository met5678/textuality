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
import { DateTime } from 'luxon';

const columns: GridColDef<RouletteWithHelpers>[] = [
  {
    field: 'minimum_bet',
    headerName: 'Min Bet',
    width: 80,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 90,
  },
  {
    field: 'bets_start_at',
    headerName: 'Bets Start',
    type: 'dateTime',
    width: 120,
  },
  {
    field: 'spin_starts_at',
    headerName: 'Spin Starts',
    type: 'dateTime',
    width: 120,
  },
  {
    field: 'spin_seconds',
    headerName: 'Spin Time',
    valueFormatter: (params) => params.value + 's',
    width: 120,
  },
  {
    field: 'bets_cutoff_seconds',
    headerName: 'Bets Cutoff',
    valueFormatter: (params) => params.value + 's',
    width: 120,
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
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => Meteor.call('roulettes.startSpin', params.row._id)}
              label="Start Spin"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => Meteor.call('roulettes.openBets', params.row._id)}
              label="Open Bets"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.call('roulettes.resetRoulette', params.row._id)
              }
              label="Reset"
            />
          ),
        ]}
      />
      <RouletteFormDialog
        model={editRoulette}
        onClose={() => setEditRoulette(null)}
      />
    </>
  );
};

export default RoulettesTable;
