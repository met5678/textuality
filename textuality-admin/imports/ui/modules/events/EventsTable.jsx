import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';

import DateDisplay from 'generic/DateDisplay';
import LoadingBar from 'generic/LoadingBar';
import EventForm from './EventForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import Events from 'api/events';

const columns = [
  {
    dataField: 'name',
    sort: true,
    text: 'Name'
  },
  {
    dataField: 'phone_number',
    text: 'Phone Number'
  },
  {
    dataField: 'active',
    text: 'Active',
    formatter: (cell, row) => (
      <Toggle
        value={cell}
        onClick={() => {
          Meteor.call('events.activate', row._id, cell);
        }}
      />
    )
  }
];

const EventsTable = ({ loading, history, events }) => {
  if (loading) return <LoadingBar />;

  return (
    <Table
      columns={columns}
      data={events}
      canDelete={true}
      onDelete={event => Meteor.call('events.delete', event)}
      canInsert={true}
      onInsert={event => Meteor.call('events.new', event)}
      canEdit={true}
      onEdit={event => Meteor.call('events.update', event)}
      form={EventForm}
    />
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('events.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    events: Events.find().fetch()
  };

  return {};
})(withRouter(EventsTable));
