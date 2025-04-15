import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '../../generic/Table/Table';
import LoadingBar from '../../generic/LoadingBar';

import AutoTexts from '/imports/api/autoTexts';
import { GridColDef } from '@mui/x-data-grid';
import AutoTextSchema, { AutoText } from '/imports/schemas/autoText';
import { AutoTextWithHelpers } from '/imports/api/autoTexts/autoTexts';
import Events from '/imports/api/events';
import { getStubWithEvent } from '../../../utils/get-stub-with-event';

const columns: GridColDef<AutoTextWithHelpers>[] = [
  {
    field: 'trigger',
    headerName: 'Trigger',
    valueFormatter: (value, row) => {
      return value + (row.isNumeric?.() ? `(${row.triggerNum})` : '');
    },
    width: 200,
    type: 'singleSelect',
    editable: true,
    valueOptions: AutoTextSchema.getAllowedValuesForKey('trigger')?.map(
      (trigger) => ({
        label: trigger,
        value: trigger,
      }),
    ),
  },
  {
    field: 'playerText',
    headerName: 'Player text',
    editable: true,
    flex: 1,
  },
  {
    field: 'image_url',
    headerName: 'Image',
    renderCell: (params) => {
      if (!params.value) return null;
      return (
        <img
          src={params.value}
          style={{ width: 50, height: 50, objectFit: 'contain' }}
        />
      );
    },
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
        onDelete={(autoText) => {
          if (Array.isArray(autoText)) {
            Meteor.call(
              'autoTexts.delete',
              autoText.map((autoText) => autoText._id),
            );
          } else {
            Meteor.call('autoTexts.delete', autoText._id);
          }
        }}
        canAddInline={true}
        onGetStub={() => getStubWithEvent<AutoTextWithHelpers>(AutoTextSchema)}
        onValidate={(autoText) => AutoTextSchema.validate(autoText)}
        canEdit={true}
        onEdit={onEdit}
        onEditCell={async (row) => {
          row.event = Events.currentId()!;
          const newAutoText = await Meteor.callAsync('autoTexts.upsert', row);
          console.log('newAutoText', newAutoText);
          return newAutoText;
        }}
        dynamicHeight={true}
      />
    </>
  );
};

export default AutoTextsTable;
