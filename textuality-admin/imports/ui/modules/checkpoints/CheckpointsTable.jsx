import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import CheckpointForm from './CheckpointForm';

import Checkpoints from 'api/checkpoints';

const columns = [
  {
    dataField: 'number',
    text: 'Num'
  },
  {
    dataField: 'hashtag',
    text: 'Hashtag'
  },
  {
    dataField: 'group',
    text: 'Group'
  },
  {
    dataField: 'location',
    text: 'Location'
  }
];

const CheckpointsTable = ({ loading, checkpoints }) => {
  if (loading) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={checkpoints}
        canDelete={true}
        onDelete={checkpoint => Meteor.call('checkpoints.delete', checkpoint)}
        canInsert={true}
        onInsert={checkpoint => Meteor.call('checkpoints.new', checkpoint)}
        canEdit={true}
        onEdit={checkpoint => Meteor.call('checkpoints.update', checkpoint)}
        form={CheckpointForm}
      />
    </>
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('checkpoints.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    checkpoints: Checkpoints.find({}, { sort: { number: 1 } }).fetch()
  };

  return {};
})(CheckpointsTable);
