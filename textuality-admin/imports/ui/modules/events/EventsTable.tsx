import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { useState } from 'react';

import Events from '/imports/api/events';

import { Button, Switch } from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import AutoFormDialog from '../../generic/AutoForm/AutoFormDialog';
import EventSchema, { Event } from '/imports/schemas/event';
import LoadingBar from '/imports/ui/generic/LoadingBar';
import Table from '/imports/ui/generic/Table/Table';
import EventForm from './EventForm';

// const columns = [
//   {
//     dataField: 'name',
//     sort: true,
//     text: 'Name'
//   },
//   {
//     dataField: 'phoneNumber',
//     text: 'Phone Number'
//   },
//   {
//     dataField: 'active',
//     text: 'Active',
//     formatter: (cell, row) => (
//       <Toggle
//         value={cell}
//         onClick={() => {
//           Meteor.call('events.activate', row._id, cell);
//         }}
//       />
//     )
//   },
//   {
//     dataField: 'reset',
//     isDummyField: true,

//     formatter: (cell, row) => (
//       <Button
//         color="danger"
//         onClick={() =>
//           confirm(
//             'This will erase all current players/texts. Scripted items will remain. Are you sure?'
//           ) && Meteor.call('events.reset', row._id)
//         }
//       >
//         Reset
//       </Button>
//     )
//   }
// ];

const tableColumns: GridColDef<Event>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    flex: 1,
  },
  {
    field: 'theme',
    headerName: 'Theme',
    flex: 1,
  },
  {
    field: 'active',
    headerName: 'Active',
    renderCell: (params) => {
      return (
        <Switch
          checked={params.value}
          onChange={() =>
            Meteor.call('events.activate', params.row._id, params.value)
          }
        />
      );
    },
  },
  {
    field: 'state',
    headerName: 'State',
    width: 120,
  },
  {
    field: 'reset',
    headerName: 'Reset',
    renderCell: (params) => {
      return (
        <Button
          size="small"
          variant="contained"
          color="warning"
          onClick={() => {
            if (
              confirm(
                'Resetting an event will erase all players and texts and reset everything to its initial state. Continue?',
              )
            ) {
              Meteor.call('events.reset', params.row._id);
            }
          }}
        >
          Reset
        </Button>
      );
    },
  },
];

const EventsTable = () => {
  const isLoading = useSubscribe('events.all');
  const events: Event[] = useTracker(() => Events.find().fetch());
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table
        columns={tableColumns}
        data={events}
        canDelete={true}
        onDelete={(event) => {
          if (Array.isArray(event)) {
            Meteor.call(
              'events.delete',
              event.map((event) => event._id),
            );
          } else {
            Meteor.call('events.delete', event._id);
          }
        }}
        canAdd={true}
        onAdd={() => setEditEvent(EventSchema.clean({}))}
        canEdit={true}
        onEdit={setEditEvent}
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => Meteor.call('finale.casino.start', params.row._id)}
              label="Start Finale"
            />
          ),
        ]}
      />
      <EventForm model={editEvent} onClose={() => setEditEvent(null)} />
    </>
  );
};

export default EventsTable;
