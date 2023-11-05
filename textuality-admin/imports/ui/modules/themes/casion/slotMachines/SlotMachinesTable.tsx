import React, { useMemo, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import Players from '/imports/api/players';
import { GridColDef } from '@mui/x-data-grid';
import { SlotMachine } from '/imports/schemas/slotMachine';
import LoadingBar from '/imports/ui/generic/LoadingBar';
import SlotMachines from '/imports/api/themes/casino/slotMachines';
import SlotMachineFormDialog from './SlotMachineFormDialog';
import { Button } from '@mui/material';

const tableColumns: GridColDef<SlotMachine>[] = [
  {
    field: 'code',
    headerName: 'Code',
    width: 60,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 60,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 90,
  },
];

const SlotMachinesTable = () => {
  const [autoTextToEdit, setAutoTextToEdit] =
    useState<Partial<SlotMachine> | null>(null);

  const isLoading = useSubscribe('slotMachines.all');
  const slotMachines = useFind(() => SlotMachines.find(), []);
  const columns = useMemo(() => tableColumns, []);

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Button onClick={() => setAutoTextToEdit({})}>New Slot</Button>
      <Table<SlotMachine>
        columns={columns}
        data={slotMachines}
        canDelete={true}
        density="standard"
        onDelete={(player) => Meteor.call('slotMachines.delete', player)}
      />
      <SlotMachineFormDialog
        model={autoTextToEdit}
        onClose={() => setAutoTextToEdit(null)}
      />
    </>
  );
};

export default SlotMachinesTable;
