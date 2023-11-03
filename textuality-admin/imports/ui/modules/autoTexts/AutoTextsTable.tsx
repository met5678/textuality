import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker, useFind } from 'meteor/react-meteor-data';

import Table from '../../generic/Table/Table';
import LoadingBar from '../../generic/LoadingBar';

import AutoTexts from '/imports/api/autoTexts';
import { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'trigger',
    headerName: 'Trigger',
    valueGetter: (cell) =>
      cell.value + cell.row.isNumeric() ? `(${cell.row.triggerNum})` : '',
  },
  {
    field: 'playerText',
    headerName: 'Player text',
  },
];

const AutoTextsTable = () => {
  const isLoading = useSubscribe('autoTexts.all');
  const autoTexts = useFind(() =>
    AutoTexts.find({}, { sort: { trigger: 1, triggerNum: 1 } }).fetch(),
  );

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={autoTexts}
        canDelete={true}
        onDelete={(autoText) => Meteor.call('autoTexts.delete', autoText)}
        // canInsert={true}
        // onInsert={(autoText) => Meteor.call('autoTexts.new', autoText)}
        // canEdit={true}
        // onEdit={(autoText) => Meteor.call('autoTexts.update', autoText)}
        // form={AutoTextForm}
      />
    </>
  );
};

export default AutoTextsTable;
