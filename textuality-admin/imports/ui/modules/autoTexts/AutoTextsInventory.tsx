import React, { useMemo } from 'react';
import { useSubscribe, useTracker, useFind } from 'meteor/react-meteor-data';

import LoadingBar from '/imports/ui/generic/LoadingBar';

import AutoTexts from '/imports/api/autoTexts';
import AutoTextSchema, {
  AutoText,
  AUTOTEXT_TRIGGERS_BASE,
  THEME_TRIGGERS,
} from '/imports/schemas/autoText';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useEventId } from '/imports/ui/hooks/use-event-id';
import Events from '/imports/api/events';
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
  const eventId = useEventId();
  const event = useTracker(() => Events.current());
  const autoTexts: AutoText[] = useFind(
    () =>
      AutoTexts.find(
        { event: eventId },
        { fields: { trigger: 1 }, sort: { trigger: 1 } },
      ),
    [],
  );

  const allTriggers = useMemo(() => {
    const triggers: string[] = [...AUTOTEXT_TRIGGERS_BASE];
    if (event?.theme && event.theme in THEME_TRIGGERS) {
      triggers.push(
        ...THEME_TRIGGERS[event.theme as keyof typeof THEME_TRIGGERS],
      );
    }
    return triggers;
  }, [event]);

  if (isLoading()) return <LoadingBar />;

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
