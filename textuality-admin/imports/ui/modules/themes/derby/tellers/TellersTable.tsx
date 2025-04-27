import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import Tellers, {
  TellerWithHelpers,
} from '/imports/api/themes/derby/tellers/tellers';
import { TELLER_ACTORS, TellerSchema } from '/imports/schemas/derby/teller';
import RaceBets from '/imports/api/themes/derby/raceBets';
import { useTableCollectionProps } from '/imports/utils/get-table-collection-props';
import { TELLER_STATUS } from '/imports/schemas/derby/teller-status/teller-status';
import { Meteor } from 'meteor/meteor';

const columns: GridColDef<TellerWithHelpers>[] = [
  {
    field: 'url',
    headerName: 'Url',
    width: 120,
    editable: true,
  },
  {
    field: 'actor',
    headerName: 'Actor',
    width: 70,
    type: 'singleSelect',
    valueOptions: [...TELLER_ACTORS],
    editable: true,
  },
  {
    field: 'min_wager',
    headerName: 'Min Wager',
    width: 90,
    editable: true,
    type: 'number',
  },
  {
    field: 'text_code',
    headerName: 'Text Code',
    width: 90,
    editable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    editable: true,
    type: 'singleSelect',
    valueOptions: Array.from(TELLER_STATUS),
  },
  {
    field: 'time_left',
    headerName: 'Time Left',
    width: 90,
    type: 'number',
    editable: true,
  },
  {
    field: 'current_bet',
    headerName: 'Current Bet',
    width: 90,
    renderCell: (params) => {
      if (!params.row.current_bet) return '--';
      const bet = RaceBets.findOne(params.row.current_bet);
      return bet?.step;
    },
  },
];

const TellersTable = () => {
  const isLoading = useSubscribe('derby.tellers.all');
  const tellers = useFind(() => Tellers.find({}, { sort: { url: 1 } }), []);

  const tableEditProps = useTableCollectionProps(
    TellerSchema,
    Tellers,
    'derby.tellers',
  );

  return (
    <>
      <Table<TellerWithHelpers>
        columns={columns}
        data={tellers}
        isLoading={isLoading()}
        {...tableEditProps}
        initialSortField="url"
        initialSortOrder="asc"
        customRowActions={[
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => Meteor.call('derby.tellers.open', params.row._id)}
              label="Open Teller"
            />
          ),
          (params) => (
            <GridActionsCellItem
              showInMenu={true}
              onClick={() => Meteor.call('derby.tellers.close', params.row._id)}
              label="Close Teller"
            />
          ),
        ]}
      />
    </>
  );
};

export default TellersTable;
