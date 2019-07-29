import React from 'react';

import EventsTable from './EventsTable';

const EventsPage = ({ match }) => {
  return (
    <>
      <h2>All Events</h2>
      <EventsTable />
    </>
  );
};

export default EventsPage;
