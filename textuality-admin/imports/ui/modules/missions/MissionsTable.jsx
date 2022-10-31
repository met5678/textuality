import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from 'reactstrap';

import LoadingBar from 'generic/LoadingBar';
import DateDisplay from 'generic/DateDisplay';
import MissionForm from './MissionForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import Missions from 'api/missions';

const columns = [
  {
    dataField: 'name',
    text: 'Name'
  },
  {
    dataField: 'active',
    text: 'Active',
    formatter: (cell, row) => <Toggle value={cell} />
  },
  {
    dataField: 'timePreText',
    text: 'Pre Time',
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>
  },
  {
    dataField: 'timeStart',
    text: 'Starts',
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>
  },
  {
    dataField: 'timeEnd',
    text: 'Ends',
    formatter: cell => <DateDisplay format="h:mma">{cell}</DateDisplay>
  },
  {
    dataField: 'actions',
    isDummyField: true,
    text: 'Actions',
    formatter: (cell, row) => (
      <>
        <Button
          onClick={() => {
            console.log('click');
            Meteor.call('missions.preStart', { missionId: row._id });
          }}
        >
          Pre
        </Button>
        <Button
          onClick={() => Meteor.call('missions.start', { missionId: row._id })}
        >
          Start
        </Button>
        <Button
          onClick={() => Meteor.call('missions.end', { missionId: row._id })}
        >
          End
        </Button>
      </>
    )
  }
];

const MissionsTable = ({ loading, missions }) => {
  if (loading) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={missions}
        canDelete={true}
        onDelete={achievement => Meteor.call('missions.delete', achievement)}
        canInsert={true}
        onInsert={achievement => Meteor.call('missions.new', achievement)}
        canEdit={true}
        onEdit={achievement => Meteor.call('missions.update', achievement)}
        form={MissionForm}
      />
    </>
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('missions.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    missions: Missions.find({}).fetch()
  };
})(MissionsTable);
