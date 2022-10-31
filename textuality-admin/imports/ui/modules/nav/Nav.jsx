import React from 'react';
import { Link } from 'react-router-dom';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const NavTab = ({ label, to }) => (
  <Tab label={label} value={to} to={to} component={Link} />
);

const Nav = () => (
  <Tabs value="/texts" variant="scrollable" scrollButtons="auto">
    <Tab label="Texts" value="/texts" to="/texts" component={Link} />
    <Tab label="Players" value="/players" to="/players" component={Link} />
    <Tab label="Checkpoints" to="/checkpoints" />
    <Tab label="Rounds" to="/rounds" />
    <Tab label="Events" to="/events" />
    <Tab label="Missions" to="/missions" />
    <Tab label="Clues" value="/clues" to="/clues" />
    <Tab label="AutoTexts" value="/setup/auto-texts" />
    <Tab label="Characters" to="/setup/characters" />
    <Tab label="Weapons" to="/setup/weapons" />
    <Tab label="Rooms" to="/setup/rooms" />
  </Tabs>
);

export default Nav;
