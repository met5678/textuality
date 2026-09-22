import React, { useState } from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Checkpoints from '/imports/api/checkpoints';
import CheckpointSchema, { Checkpoint } from '/imports/schemas/checkpoint';
import { GridColDef } from '@mui/x-data-grid';
import Table from '../../generic/Table/Table';
import CheckpointForm from './CheckpointForm';
import { Box, Chip } from '@mui/material';
import InputSelect from '../../generic/InputSelect';
import { useTableCollectionProps } from '/imports/utils/get-table-collection-props';

const getColumns = (existingLocations: string[], existingGroups: string[]) => {
  const columns: GridColDef<Checkpoint>[] = [
    {
      field: 'hashtag',
      headerName: 'Hashtag',
      editable: true,
      valueFormatter: (value: Checkpoint['hashtag']) => `#${value}`,
      width: 150,
    },
    {
      field: 'groups',
      headerName: 'Groups',
      editable: true,
      renderCell: (params) => (
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
          {params.value?.map((value: string) => (
            <Chip key={value} size="small" label={value} />
          ))}
        </Box>
      ),
      renderEditCell: (params) => {
        return (
          <InputSelect
            value={params.value}
            onChange={(val) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: val,
              })
            }
            multi={true}
            options={existingGroups}
            creatable={true}
          />
        );
      },
      width: 200,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 200,
      editable: true,
      renderEditCell: (params) => {
        return (
          <InputSelect
            value={params.value}
            onChange={(val) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: val,
              })
            }
            multi={false}
            options={existingLocations}
            creatable={true}
          />
        );
      },
    },
    {
      field: 'money_award',
      type: 'number',
      headerName: 'Award',
      width: 80,
      editable: true,
    },
    {
      field: 'player_text',
      headerName: 'Player Text',
      editable: true,
      flex: 1,
    },
    {
      field: 'suppress_autotext',
      headerName: 'Hide',
      editable: true,
      type: 'boolean',
      width: 50,
    },
  ];

  return columns;
};

const CheckpointsTable = () => {
  const isLoading = useSubscribe('checkpoints.all');
  const checkpoints = useFind(() => Checkpoints.find());
  const [editCheckpoint, setEditCheckpoint] =
    useState<Partial<Checkpoint> | null>(null);

  const existingLocations = [
    ...new Set(
      checkpoints.map((checkpoint: Checkpoint) => checkpoint.location),
    ),
  ];

  const existingGroups = [
    ...new Set(
      checkpoints.map((checkpoint: Checkpoint) => checkpoint.groups).flat(),
    ),
  ];

  const columns = getColumns(existingLocations, existingGroups);

  const tableEditProps = useTableCollectionProps<Checkpoint>(
    CheckpointSchema,
    Checkpoints,
    'checkpoints',
    setEditCheckpoint,
  );

  return (
    <>
      <Table
        columns={columns}
        data={checkpoints}
        isLoading={isLoading()}
        {...tableEditProps}
        canAdd={false}
      />
      <CheckpointForm
        model={editCheckpoint}
        onClose={() => setEditCheckpoint(null)}
      />
    </>
  );
};

export default CheckpointsTable;
