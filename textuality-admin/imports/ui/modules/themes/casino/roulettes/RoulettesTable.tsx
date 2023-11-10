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
    field: 'scheduled',
    headerName: 'Auto',
    type: 'boolean',
    width: 50,
  },
  {
    field: 'bets_start_at',
    headerName: 'Bets Start',
    type: 'dateTime',
    valueFormatter: (params) =>
      params.value
        ? DateTime.fromJSDate(params.value).toLocaleString(DateTime.TIME_SIMPLE)
        : '--',
    width: 100,
  },
  {
    field: 'spin_starts_at',
    headerName: 'Spin Starts',
    type: 'dateTime',
    valueFormatter: (params) =>
      params.value
        ? DateTime.fromJSDate(params.value).toLocaleString(DateTime.TIME_SIMPLE)
        : '--',
    width: 100,
  },
  {
    field: 'spin_seconds',
    headerName: 'Spin Time',
    valueFormatter: (params) => params.value + 's',
    width: 90,
  },
  {
    field: 'bets_cutoff_seconds',
    headerName: 'Bets Cutoff',
    valueFormatter: (params) => params.value + 's',
    width: 90,
  },
  {
    field: 'number_payout_multiplier',
    headerName: 'Payouts',
    renderCell: (params) =>
      `${params.row.number_payout_multiplier}x / ${params.row.special_payout_multiplier}x`,
    width: 90,
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
  {
    field: 'bets_open',
    headerName: 'Bets Open',
    type: 'boolean',
    width: 80,
  },
];

const RoulettesTable = () => {
  const isLoading = useSubscribe('roulettes.all');
  const roulettes = useFind(
    () => Roulettes.find({}, { sort: { bets_start_at: 1 } }),
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
        onDelete={(roulette) => {
          Meteor.call(
            'roulettes.delete',
            roulette.map((r) => r._id),
          );
        }}
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
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.call('roulettes.copyMultiplesToAll', {
                  number_payout_multiplier: params.row.number_payout_multiplier,
                  special_payout_multiplier:
                    params.row.special_payout_multiplier,
                })
              }
              label="Copy Payouts"
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
