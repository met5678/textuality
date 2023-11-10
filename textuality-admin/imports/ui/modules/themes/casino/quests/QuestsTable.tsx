import React, { useState } from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';

import { Meteor } from 'meteor/meteor';
import { GridColDef } from '@mui/x-data-grid';
import QuestFormDialog from './QuestFormDialog';
import QuestSchema, { Quest } from '/imports/schemas/quest';
import Quests from '/imports/api/themes/casino/quests';
import Table from '/imports/ui/generic/Table/Table';

const columns: GridColDef<Quest>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
  },
  {
    field: 'num_assigned',
    headerName: 'Assigned',
    width: 100,
    type: 'number',
  },
  {
    field: 'num_completed',
    headerName: 'Completed',
    width: 100,
    type: 'number',
  },
];

const QuestsTable = () => {
  const isLoading = useSubscribe('quests.all');
  const quests = useFind(() => Quests.find({}), []);
  const [editQuest, setEditQuest] = useState<Partial<Quest> | null>(null);

  return (
    <>
      <Table<Quest>
        columns={columns}
        data={quests}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(quest) => {
          Meteor.call(
            'quests.delete',
            quest.map((r) => r._id),
          );
        }}
        canAdd={true}
        onAdd={() => setEditQuest(QuestSchema.clean({}))}
        canEdit={true}
        onEdit={setEditQuest}
        customRowActions={[]}
      />
      <QuestFormDialog model={editQuest} onClose={() => setEditQuest(null)} />
    </>
  );
};

export default QuestsTable;
