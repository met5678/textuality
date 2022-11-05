import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import DateDisplay from 'generic/DateDisplay';
import { Table, generateObjColumn } from 'generic/Table';

import Guesses from 'api/guesses';

const columns = [
  {
    dataField: 'alias',
    text: 'Player',
    headerStyle: { width: '80px' },
  },
  {
    dataField: 'person',
    text: 'Person',
    headerStyle: { width: '110px' },
  },
  {
    dataField: 'room',
    text: 'Room',
    headerStyle: { width: '110px' },
  },
  {
    dataField: 'weapon',
    text: 'Weapon',
    headerStyle: { width: '110px' },
  },
];

const GuessesTable = () => {
  const isLoading = useSubscribe('guesses.all');
  const guesses = useTracker(() => Guesses.find().fetch());

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={guesses}
        canDelete={true}
        onDelete={(guess) => Meteor.call('guesses.delete', guess)}
      />
    </>
  );
};

export default GuessesTable;
