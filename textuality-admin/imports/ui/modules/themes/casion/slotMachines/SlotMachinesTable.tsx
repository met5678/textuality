import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import { SlotMachineSchema, SlotMachine } from '/imports/schemas/slotMachine';
import SlotMachines from '/imports/api/themes/casino/slotMachines';
import SlotMachineFormDialog from './SlotMachineFormDialog';
import { Button } from '@mui/material';

const columns: GridColDef<SlotMachine>[] = [
  {
    field: 'code',
    headerName: 'Code',
    width: 90,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    width: 70,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
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
      <Table<SlotMachine>
        columns={columns}
        data={slotMachines}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(player) => Meteor.call('slotMachines.delete', player)}
        canAdd={true}
        onAdd={() => setEditSlotMachine(SlotMachineSchema.clean({}))}
        canEdit={true}
        onEdit={setEditSlotMachine}
      />
      <SlotMachineFormDialog
        model={editSlotMachine}
        onClose={() => setEditSlotMachine(null)}
      />
    </>
  );
};

export default SlotMachinesTable;
