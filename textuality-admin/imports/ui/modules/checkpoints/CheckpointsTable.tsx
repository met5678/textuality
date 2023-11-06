import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Checkpoints from '/imports/api/checkpoints';
import CheckpointSchema, { Checkpoint } from '/imports/schemas/checkpoint';
import { GridColDef } from '@mui/x-data-grid';
import Table from '../../generic/Table/Table';
import CheckpointForm from './CheckpointForm';
import { Chip } from '@mui/material';

const columns: GridColDef<Checkpoint>[] = [
  {
    field: 'hashtag',
    headerName: 'Hashtag',
    valueFormatter: (cell) => `#${cell.value}`,
    width: 120,
  },
  {
    field: 'groups',
    headerName: 'Groups',
    renderCell: (params) => (
      <>
        {params.value.map((value: string) => (
          <Chip size="small" label={value} />
        ))}
      </>
    ),
    width: 150,
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 150,
  },
  {
    field: 'money_award',
    type: 'number',
    headerName: 'Award',
    width: 80,
  },
  {
    field: 'playerText',
    headerName: 'Player Text',
    flex: 1,
  },
];

const CheckpointsTable = () => {
  const isLoading = useSubscribe('checkpoints.all');
  const checkpoints = useFind(() => Checkpoints.find());
  const [editCheckpoint, setEditCheckpoint] =
    useState<Partial<Checkpoint> | null>(null);

  return (
    <>
      <Table
        columns={columns}
        data={checkpoints}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(checkpoint) => Meteor.call('checkpoints.delete', checkpoint)}
        canAdd={true}
        onAdd={() => setEditCheckpoint(CheckpointSchema.clean({}))}
        canEdit={true}
        onEdit={setEditCheckpoint}
      />
      <CheckpointForm
        model={editCheckpoint}
        onClose={() => setEditCheckpoint(null)}
      />
    </>
  );
};

export default CheckpointsTable;
