import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

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
    dataField: 'shortName',
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

const CluesTable = () => {
  const isLoading = useSubscribe('clues.all');
  const clues = useTracker(() =>
    Clues.find({}, { sort: { type: 1, shortName: 1 } }).fetch()
  );

  if (isLoading()) return <LoadingBar />;

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

export default CluesTable;
