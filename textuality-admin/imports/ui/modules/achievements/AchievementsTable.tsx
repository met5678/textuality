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
    width: 300,
    valueGetter: (params) => {
      const { trigger, trigger_detail_string, trigger_detail_number } =
        params.row;
      let triggerString = trigger;
      if (trigger_detail_string) {
        triggerString += ` (${trigger_detail_string})`;
      }
      if (trigger_detail_number) {
        triggerString += ` (${trigger_detail_number})`;
      }
      return triggerString;
    },
  },
  {
    field: 'player_text',
    headerName: 'Player Text',
    flex: 1,
  },
  {
    field: 'player_text_image',
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
  {
    field: 'hide_from_screen',
    type: 'boolean',
    headerName: 'Hide',
    width: 50,
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
        onDelete={(achievement) => {
          Meteor.call(
            'achievements.delete',
            achievement.map((r) => r._id),
          );
        }}
        canAdd={true}
        onAdd={() => setEditAchievement(AchievementSchema.clean({}))}
        canEdit={true}
        onEdit={setEditAchievement}
        dynamicHeight={true}
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
