import React from 'react';
import { useSubscribe, useTracker, useFind } from 'meteor/react-meteor-data';

import LoadingBar from '/imports/ui/generic/LoadingBar';

import AutoTexts from '/imports/api/autoTexts';
import AutoTextSchema, { AutoText } from '/imports/schemas/autoText';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const UnusedAutoTextListItem = ({ trigger }: { trigger: string }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemText primary={trigger} />
      </ListItemButton>
    </ListItem>
  );
};

const AutoTextsInvetory = () => {
  const isLoading = useSubscribe('autoTexts.all');
  const autoTexts: AutoText[] = useFind(
    () => AutoTexts.find({}, { fields: { trigger: 1 }, sort: { trigger: 1 } }),
    [],
  );
  if (isLoading()) return <LoadingBar />;

  const allTriggers = AutoTextSchema.getAllowedValuesForKey('trigger')!.map(
    (val) => String(val),
  );
  const unusedTriggers = allTriggers.filter((trigger) =>
    autoTexts.every((autoText) => autoText.trigger !== trigger),
  );

  return (
    <List dense={true}>
      {unusedTriggers.map((trigger) => (
        <UnusedAutoTextListItem key={trigger} trigger={trigger} />
      ))}
    </List>
  );
};

export default AutoTextsInvetory;
