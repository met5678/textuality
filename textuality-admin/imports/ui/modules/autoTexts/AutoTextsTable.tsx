import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker, useFind } from 'meteor/react-meteor-data';

import Table from '../../generic/Table/Table';
import LoadingBar from '../../generic/LoadingBar';

import AutoTexts from '/imports/api/autoTexts';
import { GridColDef } from '@mui/x-data-grid';
import { AutoText } from '/imports/schemas/autoText';

const columns: GridColDef[] = [
  {
    field: 'trigger',
    headerName: 'Trigger',
    valueGetter: (cell) => {
      return (
        cell.value + (cell.row.isNumeric() ? `(${cell.row.triggerNum})` : '')
      );
    },
    width: 200,
  },
  {
    field: 'playerText',
    headerName: 'Player text',
    flex: 1,
  },
];

const AutoTextsTable = ({ onEdit }: { onEdit: (obj: any) => any }) => {
  const isLoading = useSubscribe('autoTexts.all');
  const autoTexts = useFind(
    () => AutoTexts.find({}, { sort: { trigger: 1, triggerNum: 1 } }),
    [],
  );

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={autoTexts}
        canDelete={true}
        onDelete={(autoText: Partial<AutoText>) =>
          Meteor.call('autoTexts.delete', autoText._id)
        }
        canEdit={true}
        onEdit={onEdit}
        dynamicHeight={true}
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
