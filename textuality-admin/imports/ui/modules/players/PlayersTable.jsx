import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import PlayerForm from './PlayerForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import Players from 'api/players';

const columns = [
  {
    dataField: 'phone_number',
    sort: true,
    text: 'Phone Number'
  },
  {
    dataField: 'alias',
    sort: true,
    text: 'Alias'
  },
  {
    dataField: 'status',
    sort: true,
    text: 'Status'
  },
  {
    dataField: 'texts_sent',
    sort: true,
    text: '# Messages'
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
  const handles = [Meteor.subscribe('players.basic')];

  return {
    loading: handles.some(handle => !handle.ready()),
    players: Players.find().fetch()
  };

  return {};
})(PlayersTable);
