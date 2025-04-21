import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import Table from '/imports/ui/generic/Table/Table';

import { GridColDef } from '@mui/x-data-grid';
import Events from '/imports/api/events';
import { getStubWithEvent } from '/imports/utils/get-stub-with-event';
import Tellers, {
  TellerWithHelpers,
} from '/imports/api/themes/derby/tellers/tellers';
import {
  TELLER_VIDEOS,
  TELLER_STATUS,
  TellerSchema,
} from '/imports/schemas/derby/teller';
import Races from '/imports/api/themes/derby/race';
import RaceBets from '/imports/api/themes/derby/raceBets';

const columns: GridColDef<TellerWithHelpers>[] = [
  {
    field: 'url',
    headerName: 'Url',
    width: 120,
    editable: true,
  },
  {
    field: 'video',
    headerName: 'Video',
    width: 70,
    type: 'singleSelect',
    valueOptions: [...TELLER_VIDEOS],
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
  },
  {
    field: 'available_bet_types',
    headerName: 'Available Bet Types',
    width: 90,
    editable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    editable: true,
    type: 'singleSelect',
    valueOptions: [...TELLER_STATUS],
  },
  {
    field: 'time_left',
    headerName: 'Time Left',
    width: 90,
    type: 'number',
  },
  {
    field: 'current_bet',
    headerName: 'Current Bet',
    width: 90,
    renderCell: (params) => {
      const bet = RaceBets.findOne(params.row.current_bet);
      return bet?.step;
    },
  },
];

const TellersTable = () => {
  const isLoading = useSubscribe('derby.tellers.all');
  const tellers = useFind(() => Tellers.find({}, { sort: { url: 1 } }), []);

  return (
    <>
      <Table<TellerWithHelpers>
        columns={columns}
        data={tellers}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(
          selectedTellers: TellerWithHelpers | TellerWithHelpers[],
        ) => {
          const ids = Array.isArray(selectedTellers)
            ? selectedTellers.map((teller) => teller._id)
            : [selectedTellers._id];
          Meteor.call('derby.tellers.delete', ids);
        }}
        canDuplicate={true}
        onDuplicate={async (teller) => {
          const newTeller = await Meteor.callAsync(
            'derby.tellers.duplicate',
            teller._id,
          );
          return newTeller;
        }}
        canAddInline={true}
        onGetStub={() => getStubWithEvent<TellerWithHelpers>(TellerSchema)}
        onValidate={(teller) => TellerSchema.validate(teller)}
        onEditCell={async (teller) => {
          teller.event = Events.currentId()!;
          const newTeller = await Meteor.callAsync(
            'derby.tellers.upsert',
            teller,
          );
          return newTeller;
        }}
        initialSortField="number"
        initialSortOrder="asc"
      />
    </>
  );
};

export default TellersTable;
