import React, { useCallback } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Stack } from '@mui/material';

const AliasActions = () => {
  const resetAliases = useCallback(
    () =>
      confirm(
        'This will set all aliases as unused, allowing them to be re-used.',
      ) && Meteor.call('aliases.resetEvent'),
    [],
  );
  const deleteAliases = useCallback(
    () =>
      confirm(
        'Are you sure you want to DELETE all aliases and not just reset them?',
      ) && Meteor.call('aliases.clearAll'),
    [],
  );

  return (
    <Stack direction="column" spacing={2} pt={2}>
      <Button
        variant="contained"
        color="warning"
        fullWidth={true}
        onClick={resetAliases}
      >
        Reset Aliases
      </Button>
      <Button
        variant="contained"
        color="error"
        fullWidth={true}
        onClick={deleteAliases}
      >
        Delete Aliases
      </Button>
    </Stack>
  );
};

export default AliasActions;
