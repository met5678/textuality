import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Input, Button, FormGroup, FormFeedback } from 'reactstrap';
import LoadingBar from 'generic/LoadingBar';
import Toggle from 'generic/Toggle';

import Aliases from 'api/aliases';

const AliasActions = () => {
  const resetAliases = React.useCallback(
    () =>
      confirm(
        'This will set all aliases as unused, allowing them to be re-used.'
      ) && Meteor.call('aliases.resetEvent')
  );
  const deleteAliases = React.useCallback(
    () =>
      confirm(
        'Are you sure you want to DELETE all aliases and not just reset them?'
      ) && Meteor.call('aliases.clearAll')
  );

  return (
    <div>
      <Button color="warning" onClick={resetAliases}>
        Reset Aliases
      </Button>{' '}
      <Button color="danger" onClick={deleteAliases}>
        Delete Aliases
      </Button>
    </div>
  );
};

export default AliasActions;
