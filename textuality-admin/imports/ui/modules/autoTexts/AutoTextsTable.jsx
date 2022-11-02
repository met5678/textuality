import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import LoadingBar from 'generic/LoadingBar';
import AutoTextForm from './AutoTextForm';
import { Table, generateObjColumn } from 'generic/Table';
import Toggle from 'generic/Toggle';

import AutoTexts from 'api/autoTexts';

const columns = [
  {
    dataField: 'trigger',
    sort: true,
    text: 'Trigger',
    formatter: (cell, row) => {
      if (row.isNumeric()) {
        return `${cell} (${row.trigger_num})`;
      } else {
        return cell;
      }
    },
  },
  {
    dataField: 'playerText',
    text: 'Player text',
  },
  {
    dataField: 'screenText',
    text: 'Screen text',
  },
];

const AutoTextsTable = () => {
  const isLoading = useSubscribe('autoTexts.all');
  const autoTexts = useTracker(() =>
    AutoTexts.find({}, { sort: { trigger: 1, triggerDetail: 1 } }).fetch()
  );

  if (isLoading()) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={autoTexts}
        canDelete={true}
        onDelete={(autoText) => Meteor.call('autoTexts.delete', autoText)}
        canInsert={true}
        onInsert={(autoText) => Meteor.call('autoTexts.new', autoText)}
        canEdit={true}
        onEdit={(autoText) => Meteor.call('autoTexts.update', autoText)}
        form={AutoTextForm}
      />
    </>
  );
};

export default AutoTextsTable;
