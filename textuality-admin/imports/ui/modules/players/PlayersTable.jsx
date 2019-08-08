import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import DateDisplay from 'generic/DateDisplay';
import PlayerForm from './PlayerForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import Players from 'api/players';

const columns = [
  {
    dataField: 'phoneNumber',
    sort: true,
    text: 'Phone Number'
  },
  {
    dataField: 'alias',
    sort: true,
    text: 'Alias',
    headerStyle: { width: '150px' }
  },
  {
    dataField: 'status',
    sort: true,
    text: 'Status',
    headerStyle: { width: '90px' }
  },
  {
    dataField: 'feedTextsSent',
    sort: true,
    text: 'Feed',
    headerStyle: { width: '75px' }
  },
  {
    dataField: 'feedMediaSent',
    sort: true,
    text: 'Media',
    headerStyle: { width: '80px' }
  },
  {
    dataField: 'joined',
    sort: true,
    text: 'Joined',
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>,
    headerStyle: { width: '85px' }
  },
  {
    dataField: 'recent',
    sort: true,
    text: 'Recent',
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>,
    headerStyle: { width: '85px' }
  }
];

const PlayersTable = ({ loading, players }) => {
  if (loading) return <LoadingBar />;

  return (
    <Table
      columns={columns}
      data={players}
      canDelete={true}
      onDelete={player => Meteor.call('players.delete', player)}
      canEdit={true}
      onEdit={player => Meteor.call('players.update', player)}
      form={PlayerForm}
    />
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('players.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    players: Players.find().fetch()
  };

  return {};
})(PlayersTable);
