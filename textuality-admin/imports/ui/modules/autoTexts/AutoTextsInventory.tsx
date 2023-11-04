import React from 'react';
import { useSubscribe, useTracker, useFind } from 'meteor/react-meteor-data';

import LoadingBar from '/imports/ui/generic/LoadingBar';

import AutoTexts from '/imports/api/autoTexts';
import AutoTextSchema, { AutoText } from '/imports/schemas/autoText';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const UnusedAutoTextListItem = ({
  trigger,
  onClick,
}: {
  trigger: string;
  onClick: () => void;
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemText primary={trigger} />
      </ListItemButton>
    </ListItem>
  );
};

interface AutoTextInventoryProps {
  createAutoText: (autoText: Partial<AutoText>) => any;
}

const AutoTextsInventory = ({ createAutoText }: AutoTextInventoryProps) => {
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
        <UnusedAutoTextListItem
          key={trigger}
          trigger={trigger}
          onClick={() => createAutoText({ trigger })}
        />
      ))}
    </List>
  );
};

export default AutoTextsInventory;
