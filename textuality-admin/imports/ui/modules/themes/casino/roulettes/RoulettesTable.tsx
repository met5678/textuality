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
import RouletteBets from '/imports/api/themes/casino/rouletteBets';
import { RouletteBetWithHelpers } from '/imports/api/themes/casino/rouletteBets/rouletteBets';

const getColumns = (
  rouletteBets: RouletteBetWithHelpers[],
): GridColDef<RouletteWithHelpers>[] => {
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
          ? DateTime.fromJSDate(params.value).toLocaleString(
              DateTime.TIME_SIMPLE,
            )
          : '--',
      width: 100,
    },
    {
      field: 'spin_starts_at',
      headerName: 'Spin Starts',
      type: 'dateTime',
      valueFormatter: (params) =>
        params.value
          ? DateTime.fromJSDate(params.value).toLocaleString(
              DateTime.TIME_SIMPLE,
            )
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
      field: 'linked_mission',
      headerName: 'Mission',
      valueGetter: (params) =>
        params.row.linked_mission && params.row.linked_mission !== 'none',
      type: 'boolean',
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
    {
      field: 'num_bets',
      headerName: 'Num Bets',
      type: 'number',
      valueGetter: (params) =>
        rouletteBets.filter((bet) => bet.roulette_id === params.row._id).length,
    },
  ];
  return columns;
};

const RoulettesTable = () => {
  const isLoading = useSubscribe('roulettes.all');
  const isLoadingBets = useSubscribe('rouletteBets.all');
  const roulettes = useFind(
    () => Roulettes.find({}, { sort: { bets_start_at: 1 } }),
    [],
  );
  const rouletteBets = useFind(() => RouletteBets.find({}), []);
  const [editRoulette, setEditRoulette] =
    useState<Partial<RouletteWithHelpers> | null>(null);

  return (
    <>
      <Table<RouletteWithHelpers>
        columns={getColumns(rouletteBets)}
        data={roulettes}
        isLoading={isLoading() || isLoadingBets()}
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
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.call('rouletteBets.doPayouts', params.row._id)
              }
              label="Process Bets"
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
