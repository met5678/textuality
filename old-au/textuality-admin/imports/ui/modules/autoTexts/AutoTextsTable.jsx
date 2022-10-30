import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

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
    }
  },
  {
    dataField: 'playerText',
    text: 'Player text'
  },
  {
    dataField: 'screenText',
    text: 'Screen text'
  }
];

const AutoTextsTable = ({ loading, autoTexts }) => {
  if (loading) return <LoadingBar />;

  return (
    <>
      <Table
        columns={columns}
        data={autoTexts}
        canDelete={true}
        onDelete={autoText => Meteor.call('autoTexts.delete', autoText)}
        canInsert={true}
        onInsert={autoText => Meteor.call('autoTexts.new', autoText)}
        canEdit={true}
        onEdit={autoText => Meteor.call('autoTexts.update', autoText)}
        form={AutoTextForm}
      />
    </>
  );
};

export default withTracker(props => {
  const handles = [Meteor.subscribe('autoTexts.all')];

  return {
    loading: handles.some(handle => !handle.ready()),
    autoTexts: AutoTexts.find().fetch()
  };

  return {};
})(AutoTextsTable);
