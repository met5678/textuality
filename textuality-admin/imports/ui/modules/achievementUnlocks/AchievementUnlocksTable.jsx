import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import DateDisplay from 'generic/DateDisplay';
import { Table, generateObjColumn } from 'generic/Table';

import AchievementUnlocks from 'api/achievementUnlocks';
import Players from 'api/players';

const columns = [
  {
    dataField: 'name',
    text: 'Achievement'
  },
  {
    dataField: 'alias',
    text: 'Player'
  },
  {
    dataField: 'numAchievements',
    text: '# total',
    headerStyle: { width: '70px' }
  },
  {
    dataField: 'time',
    text: 'Time',
    sort: true,
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>,
    headerStyle: { width: '90px' }
  }
];

const AchievementUnlocksTable = ({ loading, unlocks }) => {
  if (loading) return <LoadingBar />;

  return (
    <>
      <Table columns={columns} data={unlocks} />
    </>
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('achievementUnlocks.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    unlocks: AchievementUnlocks.find({}, { sort: { time: -1 } }).fetch()
  };

  return {};
})(AchievementUnlocksTable);
