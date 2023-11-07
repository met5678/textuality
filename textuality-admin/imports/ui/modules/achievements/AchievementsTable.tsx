import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import AchievementForm from './AchievementForm';
import Table from '/imports/ui/generic/Table/Table';
import Achievements from '/imports/api/achievements';
import { GridColDef } from '@mui/x-data-grid';
import AchievementSchema, { Achievement } from '/imports/schemas/achievement';

const columns: GridColDef<Achievement>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'trigger',
    headerName: 'Trigger',
    width: 200,
  },
  {
    field: 'player_text',
    headerName: 'Player Text',
    flex: 1,
  },
  {
    field: 'earned',
    headerName: 'Earned',
    width: 60,
  },
];

const AchievementsTable = () => {
  const isLoading = useSubscribe('achievements.all');
  const achievements = useTracker(() =>
    Achievements.find({}, { sort: { number: 1 } }).fetch(),
  );
  const [editAchievement, setEditAchievement] =
    useState<Partial<Achievement> | null>(null);

  return (
    <>
      <Table
        columns={columns}
        data={achievements}
        isLoading={isLoading()}
        canDelete={true}
        onDelete={(achievement) =>
          Meteor.call('achievements.delete', achievement)
        }
        canAdd={true}
        onAdd={() => setEditAchievement(AchievementSchema.clean({}))}
        canEdit={true}
        onEdit={setEditAchievement}
        density="standard"
      />
      <AchievementForm
        model={editAchievement}
        onClose={() => setEditAchievement(null)}
      />
    </>
  );
};

export default AchievementsTable;
