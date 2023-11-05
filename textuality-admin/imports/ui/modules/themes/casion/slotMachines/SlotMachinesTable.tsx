import React, { useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import Players from '/imports/api/players';
import { GridColDef } from '@mui/x-data-grid';
import { SlotMachine } from '/imports/schemas/slotMachine';
import LoadingBar from '/imports/ui/generic/LoadingBar';
import SlotMachines from '/imports/api/themes/casino/slotMachines';

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
  }
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
  const isLoading = useSubscribe('slotMachines.all');
  const slotMachines = useFind(() => SlotMachines.find(), []);
  const columns = useMemo(() => tableColumns, []);

  if (isLoading()) return <LoadingBar />;

  return (
    <Table<SlotMachine>
      columns={columns}
      data={slotMachines}
      canDelete={true}
      density="standard"
      onDelete={(player) => Meteor.call('slotMachines.delete', player)}
    />
  );
};

export default SlotMachinesTable;
