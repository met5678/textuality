import React from 'react';
import arraySort from 'array-sort';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import { Table, generateObjColumn } from 'generic/Table';
import DateDisplay from 'generic/DateDisplay';

import InTexts from 'api/inTexts';
import OutTexts from 'api/outTexts';
import Players from 'api/players';

const columns = [
  {
    dataField: 'direction',
    text: '',
    formatter: cell => (cell === 'in' ? '→' : '←'),
    headerStyle: { width: '35px' }
  },
  {
    dataField: 'alias',
    sort: true,
    text: 'Player',
    headerStyle: { width: '150px' }
  },
  {
    dataField: 'body',
    text: 'Text'
  },
  {
    dataField: 'media',
    text: 'Media',
    formatter: cell => (!!cell ? 'Yes' : 'No'),
    headerStyle: { width: '65px' }
  },
  {
    dataField: 'purpose',
    text: 'Purpose',
    headerStyle: { width: '90px' }
  },
  {
    dataField: 'time',
    text: 'Time',
    sort: true,
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>,
    headerStyle: { width: '90px' }
  }
];

const AllTextsTable = ({ loading, texts }) => {
  if (loading) return <LoadingBar />;

  return (
    <Table
      columns={columns}
      data={texts}
      tableArgs={{
        hover: false,
        rowClasses: row => {
          if (row.direction === 'in') {
            if (row.purpose === 'feed') return 'table-primary';
            if (row.purpose === 'mediaOnly') return 'table-secondary';
            if (row.purpose === 'system') return 'table-dark';
            if (row.purpose === 'hashtag') return 'table-success';
            if (row.purpose === 'initial') return 'table-info';
            return 'table-warning';
          } else {
            return 'table-default';
          }
        }
      }}
    />
  );
};

export default withTracker(props => {
  const handles = [
    Meteor.subscribe('inTexts.all'),
    Meteor.subscribe('outTexts.all'),
    Meteor.subscribe('players.basic')
  ];

  const inTexts = InTexts.find({}, { sort: { time: -1 } }).fetch();
  inTexts.forEach(inText => (inText.direction = 'in'));

  const outTexts = OutTexts.find({}, { sort: { time: -1 } }).fetch();
  outTexts.forEach(outText => {
    outText.direction = 'out';
    outText.alias = Players.find(
      { _id: { $in: outText.players } },
      { fields: { alias: 1 } }
    )
      .fetch()
      .map(player => player.alias)
      .join(', ');
  });
  texts = [...inTexts, ...outTexts];
  texts = arraySort(texts, 'time', { reverse: true });

  return {
    loading: handles.some(handle => !handle.ready()),
    texts
  };

  return {};
})(AllTextsTable);
