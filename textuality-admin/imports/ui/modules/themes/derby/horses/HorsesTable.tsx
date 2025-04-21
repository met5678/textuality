import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef, GridColTypeDef } from '@mui/x-data-grid';
import { HorseSchema, HorseStats } from '/imports/schemas/derby/horse';
import Horses from '../../../../../api/themes/derby/horses';
import { HorseWithHelpers } from '../../../../../api/themes/derby/horses/horses';
import { useEventId } from '/imports/ui/hooks/use-event-id';
import { useTableCollectionProps } from '/imports/utils/get-table-collection-props';

const statsColumn: GridColTypeDef<HorseWithHelpers> = {
  type: 'number',
  editable: true,
  width: 70,
  valueGetter: (_value, row, params) =>
    row.stats[params.field as keyof HorseStats] ?? 0,
  renderCell: (params) => {
    return <div>{params.row.stats[params.field]} + 0</div>;
  },

  valueSetter: (value, row, params) => {
    return {
      ...row,
      stats: { ...row.stats, [params.field]: value },
    };
  },
};

const columns: GridColDef<HorseWithHelpers>[] = [
  {
    field: 'number',
    headerName: '#',
    type: 'number',
    width: 65,
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
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
    ...statsColumn,
  },
  {
    field: 'endurance',
    headerName: 'End',
    ...statsColumn,
  },
  {
    field: 'luck',
    headerName: 'Luck',
    ...statsColumn,
  },
  {
    field: 'competitiveness',
    headerName: 'Comp',
    ...statsColumn,
  },
  {
    field: 'water_resistance',
    headerName: 'Water',
    ...statsColumn,
  },
  {
    field: 'wind_resistance',
    headerName: 'Wind',
    ...statsColumn,
  },
  {
    field: 'electric_resistance',
    headerName: 'Elec',
    ...statsColumn,
  },
];

const HorsesTable = () => {
  const isLoading = useSubscribe('derby.horses.all');
  const eventId = useEventId();
  const horses = useFind(
    () => Horses.find({ event: eventId }, { sort: { name: 1 } }),
    [eventId],
  );

  const tableEditProps = useTableCollectionProps(
    HorseSchema,
    Horses,
    'derby.horses',
  );

  return (
    <>
      <Table<HorseWithHelpers>
        columns={columns}
        data={horses}
        isLoading={isLoading()}
        {...tableEditProps}
        initialSortField="number"
        initialSortOrder="asc"
      />
    </>
  );
};

export default HorsesTable;
