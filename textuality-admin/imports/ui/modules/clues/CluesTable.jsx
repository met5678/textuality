import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import ClueForm from './ClueForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import Clues from 'api/clues';

const columns = [
  {
    dataField: 'type',
    text: 'Type',
  },
  {
    dataField: 'name',
    text: 'Name',
  },
  {
    dataField: 'short_name',
    text: 'Short name',
  },
  {
    dataField: 'playerText',
    text: 'Player Text',
  },
  {
    dataField: 'earned',
    text: 'Earned',
  },
];

const CluesTable = ({ loading, clues }) => {
  if (loading) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={clues}
        canDelete={true}
        onDelete={(achievement) => Meteor.call('clues.delete', achievement)}
        canInsert={true}
        onInsert={(achievement) => Meteor.call('clues.new', achievement)}
        canEdit={true}
        onEdit={(achievement) => Meteor.call('clues.update', achievement)}
        form={ClueForm}
      />
    </>
  );
};

export default withTracker((props) => {
  const handles = [Meteor.subscribe('clues.all')];

  return {
    loading: handles.some((handle) => !handle.ready()),
    clues: Clues.find({}, { sort: { number: 1 } }).fetch(),
  };
})(CluesTable);
