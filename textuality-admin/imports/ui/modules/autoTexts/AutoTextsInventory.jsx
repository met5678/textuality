import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { withTracker } from 'meteor/react-meteor-data';

import AutoTexts from 'api/autoTexts';
import AutoTextSchema from 'schemas/autoText';

const AutoTextsInvetory = ({ loading, autoTexts }) => {
  const allTriggers = AutoTextSchema.getAllowedValuesForKey('trigger');

  return (
    <>
      <h2>Missing AutoTexts</h2>
      <ListGroup flush>
        {allTriggers.map(trigger => {
          const num = autoTexts.filter(at => at.trigger === trigger).length;
          if (num === 0)
            return <ListGroupItem key={trigger}>{trigger}</ListGroupItem>;
          return null;
        })}
      </ListGroup>
    </>
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('autoTexts.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    autoTexts: AutoTexts.find().fetch()
  };

  return {};
})(AutoTextsInvetory);
