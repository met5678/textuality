import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import AchievementForm from './AchievementForm';
import Table from '/imports/ui/generic/Table/Table';
import Achievements from '/imports/api/achievements';
import { GridColDef } from '@mui/x-data-grid';
import AchievementSchema, {
  Achievement,
  ACHIEVEMENT_TRIGGERS,
} from '/imports/schemas/achievement';
import { useEventId } from '../../hooks/use-event-id';
import { useTableCollectionProps } from '/imports/utils/get-table-collection-props';

const columns: GridColDef<Achievement>[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    editable: true,
  },
  {
    field: 'trigger',
    headerName: 'Trigger',
    width: 300,
    type: 'singleSelect',
    valueOptions: [...ACHIEVEMENT_TRIGGERS],
    valueGetter: (_value, row) => {
      const { trigger, trigger_detail_string, trigger_detail_number } = row;
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
    editable: true,
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
    field: 'money_award',
    headerName: 'Award',
    width: 70,
    editable: true,
    type: 'number',
  },
  {
    field: 'hide_from_screen',
    type: 'boolean',
    headerName: 'Hide',
    width: 50,
    editable: true,
  },
  {
    field: 'earned',
    headerName: 'Earned',
    width: 60,
    type: 'number',
  },
];

const AchievementsTable = () => {
  const isLoading = useSubscribe('achievements.all');
  const eventId = useEventId();
  const achievements = useTracker(() =>
    Achievements.find({ event: eventId }, { sort: { number: 1 } }).fetch(),
  );
  const [editAchievement, setEditAchievement] =
    useState<Partial<Achievement> | null>(null);

  const tableEditProps = useTableCollectionProps(
    AchievementSchema,
    Achievements,
    'achievements',
    setEditAchievement,
  );

  return (
    <>
      <Table
        columns={columns}
        data={achievements}
        isLoading={isLoading()}
        {...tableEditProps}
        canAddInline={false}
        canDuplicate={false}
        dynamicHeight={true}
      />
      <AchievementForm
        model={editAchievement}
        onClose={() => setEditAchievement(null)}
      />
    </>
  );
};

export default AchievementsTable;
