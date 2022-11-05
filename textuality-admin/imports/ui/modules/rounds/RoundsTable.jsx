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
    headerStyle: { width: '60px' },
  },
  {
    dataField: 'name',
    text: 'Name',
    headerStyle: { width: '80px' },
  },
  {
    dataField: 'status',
    text: 'Status',
    headerStyle: { width: '100px' },
  },
  {
    dataField: 'revealState',
    text: 'Reveal Phase',
    headerStyle: { width: '150px' },
    formatter: (cell, row) => (
      <>
        {row.revealState?.phase ?? '--'}
        <br />
        {row.revealState?.currentClue ?? '--'}
        <br />
        {row.revealState?.currentPlayers?.length ?? '--'}
      </>
    ),
  },
  {
    dataField: 'solution',
    text: 'Solution',
    headerStyle: { width: '150px' },
    formatter: (cell, row) => (
      <>
        {typeof cell != 'object' ? (
          <span>No solution</span>
        ) : (
          <span>
            {cell.person}
            <br />
            {cell.room}
            <br />
            {cell.weapon}
          </span>
        )}
      </>
    ),
  },
  {
    dataField: 'timeStart',
    text: 'Start Time',
    headerStyle: { width: '100px' },
    formatter: (cell, row) => {
      return cell?.toLocaleTimeString() ?? 'none';
    },
  },
  {
    dataField: 'timeEnd',
    text: 'End Time',
    headerStyle: { width: '100px' },
    formatter: (cell, row) => {
      return cell?.toLocaleTimeString() ?? 'none';
    },
  },
  {
    dataField: 'actions',
    isDummyField: true,
    text: 'Actions',
    formatter: (cell, row) => (
      <>
        <Button
          onClick={() => {
            Meteor.call('rounds.start', { roundId: row._id });
          }}
        >
          Start
        </Button>
        <Button
          onClick={() =>
            Meteor.call('rounds.startCountdown', { roundId: row._id })
          }
        >
          5min Warn
        </Button>
        <Button
          onClick={() =>
            Meteor.call('rounds.startRevealSequence', { roundId: row._id })
          }
        >
          Reveal
        </Button>
        <Button
          onClick={() => Meteor.call('rounds.abort', { roundId: row._id })}
        >
          Abort
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
