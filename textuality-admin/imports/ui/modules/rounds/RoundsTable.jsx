import React from 'react';
import {
  withTracker,
  useSubscribe,
  useTracker,
} from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import RoundForm from './RoundForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';
import { Button } from 'reactstrap';

import Rounds from 'api/rounds';

const columns = [
  {
    dataField: 'number',
    text: 'Number',
  },
  {
    dataField: 'name',
    text: 'Name',
  },
  {
    dataField: 'status',
    text: 'Status',
  },
  {
    dataField: 'solution',
    text: 'Solution',
    formatter: (cell, row) => (
      <>
        {typeof cell != 'object' ? (
          <span>No solution</span>
        ) : (
          <span>
            {cell.person}, {cell.room}, {cell.weapon}
          </span>
        )}
      </>
    ),
  },
  {
    dataField: 'actions',
    isDummyField: true,
    text: 'Actions',
    formatter: (cell, row) => (
      <>
        <Button
          onClick={() => {
            Meteor.call('round.start', { missionId: row._id });
          }}
        >
          Start
        </Button>
        <Button
          onClick={() =>
            Meteor.call('round.endWarning', { missionId: row._id })
          }
        >
          10min Warn
        </Button>
      </>
    ),
  },
];

const RoundsTable = () => {
  const isLoading = useSubscribe('rounds.all');
  const rounds = useTracker(() =>
    Rounds.find({}, { sort: { number: 1 } }).fetch()
  );

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={rounds}
        canDelete={true}
        onDelete={(achievement) => Meteor.call('rounds.delete', achievement)}
        canInsert={true}
        onInsert={(achievement) => Meteor.call('rounds.new', achievement)}
        canEdit={true}
        onEdit={(achievement) => Meteor.call('rounds.update', achievement)}
        form={RoundForm}
      />
    </>
  );
};

export default RoundsTable;
