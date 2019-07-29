import React from 'react';

import PlayersTable from './PlayersTable';

const PlayersPage = ({ match }) => {
  return (
    <>
      <h2>All Players</h2>
      <PlayersTable />
    </>
  );
};

export default PlayersPage;
