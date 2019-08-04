import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Badge } from 'reactstrap';
import LoadingBar from 'generic/LoadingBar';
import Toggle from 'generic/Toggle';

import Aliases from 'api/aliases';

const AliasPill = ({ alias }) => {
  const onDelete = React.useCallback(() => {
    Meteor.call('aliases.delete', alias._id);
  });
  return (
    <Button
      size="lg"
      color={alias.used ? 'secondary' : 'success'}
      className="alias-pill"
    >
      {alias.name}{' '}
      <Badge onClick={onDelete} color="danger">
        X
      </Badge>
    </Button>
  );
};

const AliasesList = ({ loading, aliases }) => {
  if (loading) return <LoadingBar />;

  return (
    <div>
      {aliases.map(alias => (
        <AliasPill alias={alias} key={alias._id} />
      ))}
    </div>
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('aliases.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    aliases: Aliases.find({}, { sort: { name: 1 } }).fetch()
  };

  return {};
})(AliasesList);
