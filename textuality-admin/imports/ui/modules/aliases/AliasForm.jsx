import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Input, Button, FormGroup, FormFeedback } from 'reactstrap';
import LoadingBar from 'generic/LoadingBar';
import Toggle from 'generic/Toggle';

import Aliases from 'api/aliases';

const AliasForm = () => {
  const [error, setError] = React.useState(null);
  const [value, setValue] = React.useState('');

  const onKeyDown = React.useCallback(e => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      Meteor.call('aliases.new', e.currentTarget.value, err => {
        if (err) {
          setError(err.reason);
        } else {
          setError(null);
          setValue('');
        }
      });
    }
  });

  return (
    <>
      <FormGroup>
        <Input
          value={value}
          invalid={error}
          onKeyDown={onKeyDown}
          onChange={e => setValue(e.currentTarget.value)}
          maxLength="15"
        />
        {error && <FormFeedback>{error}</FormFeedback>}
      </FormGroup>
    </>
  );
};

export default AliasForm;
