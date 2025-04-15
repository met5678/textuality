import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Checkpoints from '/imports/api/checkpoints';
import CheckpointSchema, { Checkpoint } from '/imports/schemas/checkpoint';
import { GridColDef } from '@mui/x-data-grid';
import Table from '../../generic/Table/Table';
import CheckpointForm from './CheckpointForm';
import { Box, Chip, Stack } from '@mui/material';
import InputSelect from '../../generic/InputSelect';
import Events from '/imports/api/events';
import { getStubWithEvent } from '/imports/utils/get-stub-with-event';

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
  return (
    <>
      <Table
        columns={columns}
        data={checkpoints}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(checkpoint) => {
          if (Array.isArray(checkpoint)) {
            Meteor.call(
              'checkpoints.delete',
              checkpoint.map((c) => c._id),
            );
          } else {
            Meteor.call('checkpoints.delete', checkpoint._id);
          }
        }}
        canAddInline={true}
        onGetStub={() => getStubWithEvent<Checkpoint>(CheckpointSchema)}
        onValidate={(checkpoint) => CheckpointSchema.validate(checkpoint)}
        canEdit={true}
        onEdit={setEditCheckpoint}
        onEditCell={async (checkpoint) => {
          checkpoint.event = Events.currentId()!;
          const newCheckpoint = await Meteor.callAsync(
            'checkpoints.upsert',
            checkpoint,
          );
          console.log('new checkpoint', newCheckpoint);
          return newCheckpoint;
        }}
      />
      <CheckpointForm
        model={editCheckpoint}
        onClose={() => setEditCheckpoint(null)}
      />
    </>
  );
};

export default CheckpointsTable;
