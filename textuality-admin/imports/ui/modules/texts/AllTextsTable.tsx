import React from 'react';
import arraySort from 'array-sort';
import { useTracker, useSubscribe, useFind } from 'meteor/react-meteor-data';
import { DateTime } from 'luxon';

import Table from '/imports/ui/generic/Table/Table';
// import DateDisplay from 'generic/DateDisplay';

import InTexts from '/imports/api/inTexts';
import OutTexts from '/imports/api/outTexts';
import Players from '/imports/api/players';
import { GridColDef } from '@mui/x-data-grid';
import LoadingBar from '../../generic/LoadingBar';
import dayjs from 'dayjs';

const columns: GridColDef[] = [
  // {
  //   field: 'direction',
  //   headerName: '',
  //   sortable: false,
  //   valueFormatter: params => (params.value === 'in' ? '→' : '←'),
  //   width: 35
  // },
  {
    field: 'alias',
    headerName: 'Player',
    width: 150,
  },
  {
    field: 'body',
    headerName: 'Text',
    flex: 1,
  },
  {
    field: 'media',
    headerName: 'Media',
    valueFormatter: (cell) => (!!cell.value ? 'Yes' : 'No'),
    width: 65,
  },
  {
    field: 'purpose',
    headerName: 'Purpose',
    width: 90,
  },
  {
    field: 'time',
    headerName: 'Time',
    type: 'dateTime',
    valueFormatter: (cell) =>
      DateTime.fromJSDate(cell.value).toLocaleString(
        DateTime.TIME_24_WITH_SECONDS,
      ),
    width: 95,
  },
];

const AllTextsTable = () => {
  const isLoading = useSubscribe('inTexts.all');
  const inTexts = useFind(() => InTexts.find({}, { sort: { time: -1 } }), []);
  if (isLoading()) return <LoadingBar />;

  return (
    <Table
      columns={columns}
      data={inTexts}
      // tableArgs={{
      //   hover: false,
      //   rowClasses: row => {
      //     if (row.direction === 'in') {
      //       if (row.purpose === 'feed') return 'table-primary';
      //       if (row.purpose === 'mediaOnly') return 'table-secondary';
      //       if (row.purpose === 'system') return 'table-dark';
      //       if (row.purpose === 'hashtag') return 'table-success';
      //       if (row.purpose === 'initial') return 'table-info';
      //       return 'table-warning';
      //     } else {
      //       return 'table-default';
      //     }
      //   }
      // }}
    />
  );
};

export default AllTextsTable;

// export default withTracker(props => {
//   const handles = [
//     Meteor.subscribe('inTexts.all'),
//     Meteor.subscribe('outTexts.all'),
//     Meteor.subscribe('players.basic')
//   ];

//   const inTexts = InTexts.find({}, { sort: { time: -1 } }).fetch();
//   inTexts.forEach(inText => (inText.direction = 'in'));

//   const outTexts = OutTexts.find({}, { sort: { time: -1 } }).fetch();
//   outTexts.forEach(outText => {
//     outText.direction = 'out';
//     outText.alias = Players.find(
//       { _id: { $in: outText.players } },
//       { fields: { alias: 1 } }
//     )
//       .fetch()
//       .map(player => player.alias)
//       .join(', ');
//   });
//   texts = [...inTexts, ...outTexts];
//   texts = arraySort(texts, 'time', { reverse: true });

//   return {
//     loading: handles.some(handle => !handle.ready()),
//     texts
//   };

//   return {};
// })(AllTextsTable);
