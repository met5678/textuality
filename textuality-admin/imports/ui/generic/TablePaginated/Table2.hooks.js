import React from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicateTwoTone';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

const ActionComponent = ({ tooltip, label, onClick, Icon }) => (
  <Tooltip title="Delete" aria-label="delete">
    <IconButton aria-label={label} onClick={onClick} size="small">
      <Icon />
    </IconButton>
  </Tooltip>
);

export function useTableDelete({ canDelete, onDelete }) {
  if (!canDelete) return { cellActions: [] };

  const Component = ({ item }) => (
    <ActionComponent
      onClick={() => {
        onDelete([item._id]);
      }}
      label="delete"
      tooltip="Delete"
      Icon={DeleteForeverTwoToneIcon}
    />
  );

  return {
    cellActions: [
      {
        Component,
        label: 'delete',
      },
    ],
  };
}

export function useTableDuplicate({ canDuplicate, onDuplicate }) {
  if (!canDuplicate) return { cellActions: [] };

  const Component = ({ item }) => (
    <ActionComponent
      onClick={() => {
        onDuplicate([item._id]);
      }}
      label="duplicate"
      tooltip="Duplicate"
      Icon={ControlPointDuplicateIcon}
    />
  );

  return {
    cellActions: [
      {
        Component,
        label: 'duplicate',
      },
    ],
  };
}
