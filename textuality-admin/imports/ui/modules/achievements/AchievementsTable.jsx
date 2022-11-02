import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import AchievementForm from './AchievementForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import Achievements from 'api/achievements';

const columns = [
  {
    dataField: 'number',
    text: 'Number',
    headerStyle: { width: '60px' },
  },
  {
    dataField: 'name',
    text: 'Name',
  },
  {
    dataField: 'trigger',
    text: 'Trigger',
    formatter: (cell, row) => (
      <>
        {cell}
        {typeof row.triggerDetail !== 'undefined' && (
          <>
            <br />
            {row.triggerDetail}
          </>
        )}
      </>
    ),
  },
  {
    dataField: 'playerText',
    text: 'Player Text',
  },
  {
    dataField: 'screenText',
    text: 'Screen Text',
  },
  {
    dataField: 'hideFromCasefile',
    text: 'Hide',
    headerStyle: { width: '50px' },
  },
  {
    dataField: 'earned',
    text: 'Earned',
    headerStyle: { width: '60px' },
  },
];

const AchievementsTable = () => {
  const isLoading = useSubscribe('achievements.all');
  const achievements = useTracker(() =>
    Achievements.find({}, { sort: { number: 1 } }).fetch()
  );

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={achievements}
        canDelete={true}
        onDelete={(achievement) =>
          Meteor.call('achievements.delete', achievement)
        }
        canInsert={true}
        onInsert={(achievement) => Meteor.call('achievements.new', achievement)}
        canEdit={true}
        onEdit={(achievement) =>
          Meteor.call('achievements.update', achievement)
        }
        form={AchievementForm}
      />
    </>
  );
};

export default AchievementsTable;
