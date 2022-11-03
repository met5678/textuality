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
    headerStyle: { width: '100px' },
  },
  {
    dataField: 'name',
    text: 'Name',
    headerStyle: { width: '100px' },
  },
  {
    dataField: 'shortName',
    text: 'Short name',
    headerStyle: { width: '100px' },
  },
  {
    dataField: 'playerText',
    text: 'Player Text',
  },
  {
    dataField: 'image',
    text: 'Card',
    isDummyField: true,
    headerStyle: { width: '100px' },
    formatter: (cell, row) => {
      return <img src={row.getCardUrl()} style={{ height: '100px' }} />;
    },
  },
  {
    dataField: 'earned',
    text: 'Earned',
    headerStyle: { width: '60px' },
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
