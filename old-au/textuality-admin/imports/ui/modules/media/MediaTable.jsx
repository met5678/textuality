import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import DateDisplay from 'generic/DateDisplay';
import { Table, generateObjColumn } from 'generic/Table';

import Media from 'api/media';
import Players from 'api/players';

const columns = [
  {
    dataField: 'player',
    sort: true,
    text: 'Player',
    formatter: (cell, row) => {
      const player = Players.findOne(cell);
      if (player) return player.alias;
      return '';
    }
  },
  {
    dataField: 'preview',
    text: 'Preview',
    isDummyField: true,
    formatter: (cell, row) => <img src={row.getUrl(80)} />
  },
  {
    dataField: 'type',
    text: 'Type',
    headerStyle: { width: '80px' }
  },
  {
    dataField: 'faces',
    text: 'Faces',
    formatter: cell => cell.length,
    headerStyle: { width: '70px' }
  },
  {
    dataField: 'purpose',
    text: 'Purpose',
    headerStyle: { width: '100px' }
  },
  {
    dataField: 'fit',
    text: 'Fit',
    headerStyle: { width: '90px' },
    isDummyField: true,
    formatter: (cell, row) => {
      if (row.isSquare()) return 'square';
      if (row.isLandscape()) return 'landscape';
      if (row.isPortrait()) return 'portrait';
      return '';
    }
  },
  {
    dataField: 'time',
    text: 'Time',
    sort: true,
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>,
    headerStyle: { width: '90px' }
  }
];

const MediaTable = ({ loading, media }) => {
  if (loading) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={media}
        canDelete={true}
        onDelete={media => Meteor.call('media.delete', media)}
      />
    </>
  );
};

export default withTracker(props => {
  const handles = [
    Meteor.subscribe('media.all'),
    Meteor.subscribe('players.basic')
  ];

  return {
    loading: handles.some(handle => !handle.ready()),
    media: Media.find({}, { sort: { time: -1 } }).fetch()
  };

  return {};
})(MediaTable);
