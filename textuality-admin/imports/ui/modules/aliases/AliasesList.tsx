import React, { useCallback } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Aliases from '/imports/api/aliases';
import LoadingBar from '../../generic/LoadingBar';
import { Alias } from '/imports/schemas/alias';
import { Box, Chip } from '@mui/material';

const AliasPill = ({ alias }: { alias: Alias }) => {
  const onDelete = useCallback(() => {
    Meteor.call('aliases.delete', alias._id);
  }, []);
  return (
    <Chip
      label={alias.name}
      onDelete={onDelete}
      variant={alias.used ? 'filled' : 'outlined'}
    />
  );
};

const AliasesList = () => {
  const isLoading = useSubscribe('aliases.all');
  const aliases: Alias[] = useFind(
    () => Aliases.find({}, { sort: { name: 1 } }),
    [],
  );

  if (isLoading()) return <LoadingBar />;

  return (
    <Box display="flex" flexWrap="wrap" gap={1}>
      {aliases.map((alias: Alias) => (
        <AliasPill alias={alias} key={alias._id} />
      ))}
    </Box>
  );
};

export default AliasesList;
