import React from 'react';

import CheckpointsTable from './CheckpointsTable';

const CheckpointsPage = ({ match }) => {
  return (
    <>
      <h2>All Checkpoints</h2>
      <CheckpointsTable />
    </>
  );
};

export default CheckpointsPage;
