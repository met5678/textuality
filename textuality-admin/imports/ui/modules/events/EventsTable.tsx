import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { useState } from 'react';

import Events from '/imports/api/events';

import { Button, Switch } from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Event } from '/imports/schemas/event';
import LoadingBar from '/imports/ui/generic/LoadingBar';
import Table from '/imports/ui/generic/Table/Table';
import EventForm from './EventForm';
import { EventCopyFromModal } from './EventCopyFromModal';

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
    field: 'skin',
    headerName: 'Skin',
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
  const [copyToEvent, setCopyToEvent] = useState<Event | null>(null);

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
        onAdd={() => setEditEvent({} as Event)}
        canEdit={true}
        onEdit={setEditEvent}
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => {
                if (params.row.skin === 'normal') {
                  Meteor.callAsync(
                    `finale.${params.row.theme}.start`,
                    params.row._id,
                  );
                } else {
                  Meteor.callAsync(
                    `finale.${params.row.theme}.${params.row.skin}.start`,
                    params.row._id,
                  );
                }
              }}
              label="Start Finale"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => Meteor.call('finale.derby.cancel', params.row._id)}
              label="Cancel Finale"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => Meteor.call('finale.endMessage', params.row._id)}
              label="Send End"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => setCopyToEvent(params.row)}
              label="Copy From Event..."
            />
          ),
        ]}
      />
      <EventForm model={editEvent} onClose={() => setEditEvent(null)} />
      {copyToEvent && (
        <EventCopyFromModal
          destinationEvent={copyToEvent}
          onClose={() => setCopyToEvent(null)}
        />
      )}
    </>
  );
};

export default EventsTable;
