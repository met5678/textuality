import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';

import AutoTexts from 'api/autoTexts';
import AutoTextSchema from 'schemas/autoText';

const AutoTextsInvetory = () => {
  const isLoading = useSubscribe('autoTexts.all');
  const autoTexts = useTracker(() =>
    AutoTexts.find({}, { sort: { trigger: 1, triggerDetail: 1 } }).fetch()
  );

  if (isLoading()) return <LoadingBar />;

  const allTriggers = AutoTextSchema.getAllowedValuesForKey('trigger').sort();

  return (
    <>
      <h2>Missing AutoTexts</h2>
      <ListGroup flush>
        {allTriggers.map((trigger) => {
          const num = autoTexts.filter((at) => at.trigger === trigger).length;
          if (num === 0)
            return <ListGroupItem key={trigger}>{trigger}</ListGroupItem>;
          return null;
        })}
      </ListGroup>
    </>
  );
};

export default AutoTextsInvetory;
