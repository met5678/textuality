import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { SlotMachineSchema, SlotMachine } from '/imports/schemas/slotMachine';
import SlotMachines from '/imports/api/themes/casino/slotMachines';
import SlotMachineFormDialog from './SlotMachineFormDialog';
import { Button } from '@mui/material';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';

const columns: GridColDef<SlotMachineWithHelpers>[] = [
  {
    field: 'code',
    headerName: 'URL',
    width: 90,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
  },
  {
    field: 'short',
    headerName: 'Short',
    width: 90,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    width: 70,
  },
  {
    field: 'odds',
    headerName: 'Return',
    valueGetter: (params) => params.row.getExpectedReturn(),
    type: 'number',
    width: 60,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 90,
  },
  {
    field: 'player',
    headerName: 'Player',
    valueFormatter: (params) => params.value?.alias,
    width: 120,
  },
  {
    field: 'result',
    headerName: 'Result',
    width: 100,
    valueFormatter: (params) => {
      return params.value?.join(' - ');
    },
  },
  {
    field: 'win_amount',
    headerName: 'Payout',
    width: 60,
  },
  {
    field: 'stats.spin_count',
    headerName: 'Spins',
    valueGetter: (params) => params.row.stats.spin_count,
    width: 60,
  },
  {
    field: 'stats.profit',
    headerName: 'Profit',
    valueGetter: (params) => params.row.stats.profit,
    width: 60,
  },
];

const SlotMachinesTable = () => {
  const isLoading = useSubscribe('slotMachines.all');
  const slotMachines = useFind(
    () => SlotMachines.find({}, { sort: { code: 1 } }),
    [],
  );
  const [editSlotMachine, setEditSlotMachine] =
    useState<Partial<SlotMachine> | null>(null);

  return (
    <>
      <Table<SlotMachineWithHelpers>
        columns={columns}
        data={slotMachines}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(slotMachine) => {
          Meteor.call(
            'slotMachines.delete',
            slotMachine.map((r) => r._id),
          );
        }}
        canAdd={true}
        onAdd={() => setEditSlotMachine(SlotMachineSchema.clean({}))}
        canEdit={true}
        onEdit={setEditSlotMachine}
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.call('slotMachines.copyOddsToAll', params.row.odds)
              }
              label="Copy odds to all"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() =>
                Meteor.call('slotMachines.resetMachine', params.row._id)
              }
              label="Reset Machine"
            />
          ),
        ]}
      />
      <SlotMachineFormDialog
        model={editSlotMachine}
        onClose={() => setEditSlotMachine(null)}
      />
    </>
  );
};

export default SlotMachinesTable;
