import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import { Table, generateObjColumn } from 'generic/Table';
import DateDisplay from 'generic/DateDisplay';

import InTexts from 'api/inTexts';
// import OutTexts from 'api/outTexts';

const columns = [
  {
    dataField: 'alias',
    sort: true,
    text: 'Player'
  },
  {
    dataField: 'body',
    text: 'Text'
  },
  {
    dataField: 'purpose',
    text: 'Purpose'
  },
  {
    dataField: 'time',
    text: 'Time',
    sort: true,
    formatter: cell => <DateDisplay date={cell} />
  }
];

const AllTextsTable = ({ loading, texts }) => {
  if (loading) return <LoadingBar />;

  return (
    <Table
      columns={columns}
      data={texts}
      canDelete={true}
      onDelete={event => Meteor.call('inTexts.delete', event)}
    />
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('inTexts.all')];

  const inTexts = InTexts.find({}, { sort: { time: -1 } }).fetch();
  inTexts.forEach(inText => (inText.direction = 'in'));
  texts = [...inTexts];

  return {
    loading: handles.some(handle => !handle.ready()),
    texts
  };

  return {};
})(AllTextsTable);
