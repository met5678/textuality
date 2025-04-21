import React, { ReactElement } from 'react';
import { Link, useRoute } from 'wouter';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import MessageTwoToneIcon from '@mui/icons-material/MessageTwoTone';
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import TagTwoToneIcon from '@mui/icons-material/TagTwoTone';
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
import Events from '/imports/api/events';
import { useTracker } from 'meteor/react-meteor-data';
import { EventTheme } from '/imports/schemas/event';

type NavItem = {
  title: string;
  href: string;
  icon: ReactElement;
  theme?: EventTheme;
  startWithDivider?: boolean;
};

const navItems: Array<NavItem> = [
  {
    title: 'Texts',
    href: '/texts',
    icon: <MessageTwoToneIcon />,
  },
  {
    title: 'Players',
    href: '/players',
    icon: <PeopleTwoToneIcon />,
  },
  {
    title: 'Media',
    href: '/media',
    icon: <ImageTwoToneIcon />,
  },
  {
    title: 'Unlocks',
    href: '/unlocks',
    icon: <LockOpenTwoToneIcon />,
  },
  {
    startWithDivider: true,
    title: 'Achievements',
    href: '/achievements',
    icon: <TaskAltIcon />,
  },
  {
    title: 'Aliases',
    href: '/aliases',
    icon: <BadgeTwoToneIcon />,
  },
  {
    title: 'AutoTexts',
    href: '/autoTexts',
    icon: <VoicemailIcon />,
  },
  {
    title: 'Checkpoints',
    href: '/checkpoints',
    icon: <TagTwoToneIcon />,
  },
  {
    title: 'Missions',
    href: '/missions',
    icon: <PersonSearchTwoToneIcon />,
  },
  {
    title: 'Slot Machines',
    href: '/casino/slot-machines',
    icon: <Typography>🎰</Typography>,
    theme: 'casino',
    startWithDivider: true,
  },
  {
    title: 'Roulettes',
    href: '/casino/roulettes',
    icon: <Typography>🎡</Typography>,
    theme: 'casino',
  },
  {
    title: 'Quests',
    href: '/casino/quests',
    icon: <Typography>🦹‍♀️</Typography>,
    theme: 'casino',
  },
  {
    title: 'Horses',
    href: '/derby/horses',
    icon: <Typography>🐎</Typography>,
    theme: 'derby',
    startWithDivider: true,
  },
  {
    title: 'Races',
    href: '/derby/races',
    icon: <Typography>🏁</Typography>,
    theme: 'derby',
  },
  {
    title: 'Powerups',
    href: '/derby/powerups',
    icon: <Typography>🍄</Typography>,
    theme: 'derby',
  },
  {
    title: 'Tellers',
    href: '/derby/tellers',
    icon: <Typography>👩‍🏫</Typography>,
    theme: 'derby',
  },
  {
    title: 'Fortune Teller',
    href: '/derby/tasks',
    icon: <Typography>🔮</Typography>,
    theme: 'derby',
  },
  {
    startWithDivider: true,
    title: 'Events',
    href: '/events',
    icon: <EventTwoToneIcon />,
  },
];

const drawerWidth = 200;

const NavDrawerItem = ({ href, icon, title, startWithDivider }: NavItem) => {
  const [isMatch] = useRoute(href);

  return (
    <>
      {startWithDivider && (
        <Box py={1}>
          <Divider />
        </Box>
      )}
      <ListItem key={href} disablePadding>
        <Link to={href}>
          <ListItemButton selected={isMatch}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{title}</ListItemText>
          </ListItemButton>
        </Link>
      </ListItem>
    </>
  );
};

const NavDrawer = () => {
  const currentEvent = useTracker(() => Events.current());
  const theme = currentEvent?.theme;

  const filteredNavItems = navItems.filter((item) => {
    if (!item.theme) return true;
    if (!theme) return true;
    return item.theme === theme;
  });

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6">Textuality</Typography>
      </Toolbar>
      <Divider />
      <List dense={true}>
        {filteredNavItems.map((item: NavItem) => (
          <NavDrawerItem {...item} key={item.href} />
        ))}
      </List>
    </Drawer>
  );
};

export default NavDrawer;
