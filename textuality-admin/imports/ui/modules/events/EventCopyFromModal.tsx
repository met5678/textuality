import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import Events from '/imports/api/events';
import InputSelect from '../../generic/InputSelect';
import { Event } from '/imports/schemas/event';
import { Meteor } from 'meteor/meteor';

export const EventCopyFromModal = ({
  destinationEvent,
  onClose,
}: {
  destinationEvent: Event;
  onClose: () => void;
}) => {
  const [copyFromEvent, setCopyFromEvent] = useState<Event | null>(null);
  const events = useTracker(() => {
    return Events.find().fetch();
  });

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Copy From Other Event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the event to copy contents from.
        </DialogContentText>
        <InputSelect
          label="Copy from"
          options={events.map((event) => event.name)}
          value={copyFromEvent?.name ?? null}
          multi={false}
          onChange={(value) => {
            if (!value) setCopyFromEvent(null);
            setCopyFromEvent(
              events.find((event) => event.name === value) ?? null,
            );
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          onClick={() => {
            if (copyFromEvent) {
              debugger;
              Meteor.call(
                'events.copyFrom',
                destinationEvent._id,
                copyFromEvent._id,
              );
            }
            onClose();
          }}
        >
          Copy
        </Button>
      </DialogActions>
    </Dialog>
  );
};
