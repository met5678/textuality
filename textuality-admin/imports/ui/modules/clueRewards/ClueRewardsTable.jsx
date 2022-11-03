import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import DateDisplay from 'generic/DateDisplay';
import { Table, generateObjColumn } from 'generic/Table';

import ClueRewards from 'api/clueRewards';

const columns = [
  {
    dataField: 'clueType',
    text: 'Type',
    headerStyle: { width: '80px' },
  },
  {
    dataField: 'clueName',
    text: 'Name',
    headerStyle: { width: '110px' },
  },
  {
    dataField: 'alias',
    text: 'Player',
  },
  {
    dataField: 'totalCluesFound',
    text: 'Player clue total',
  },
  {
    dataField: 'time',
    text: 'Time',
    sort: true,
    formatter: (cell) => <DateDisplay format="h:mma">{cell}</DateDisplay>,
    headerStyle: { width: '100px' },
  },
];

const ClueRewardsTable = () => {
  const isLoading = useSubscribe('clueRewards.all');
  const rewards = useTracker(() => ClueRewards.find().fetch());

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table columns={columns} data={rewards} />
    </>
  );
};

export default ClueRewardsTable;
