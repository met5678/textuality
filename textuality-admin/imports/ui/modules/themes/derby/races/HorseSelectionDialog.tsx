import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemButton,
  ListItemIcon,
  Box,
  ButtonGroup,
} from '@mui/material';
import Horses from '../../../../../api/themes/derby/horses';
import { Race } from '/imports/schemas/derby/race';

interface HorseSelectionDialogProps {
  race: Race;
  onClose: () => void;
}

const HorseSelectionDialog = ({ race, onClose }: HorseSelectionDialogProps) => {
  const isLoadingHorses = useSubscribe('horses.all');
  const horses = useFind(() => Horses.find({}, { sort: { number: 1 } }), []);
  const [selectedHorses, setSelectedHorses] = useState<string[]>([]);

  useEffect(() => {
    setSelectedHorses(race.horses || []);
  }, [race.horses]);

  const handleToggleHorse = (horseId: string) => {
    const newHorses = selectedHorses.includes(horseId)
      ? selectedHorses.filter((id) => id !== horseId)
      : [...selectedHorses, horseId];

    setSelectedHorses(newHorses);
  };

  const handleSelectAll = () => {
    setSelectedHorses(horses.map((horse) => horse._id));
  };

  const handleDeselectAll = () => {
    setSelectedHorses([]);
  };

  const handleSave = () => {
    Meteor.call('derby.races.update', {
      ...race,
      horses: selectedHorses,
      odds: selectedHorses.map((horseId) => {
        return {
          horse: horseId,
          odds: 1 + Math.floor(Math.random() * 20),
        };
      }),
    });
    onClose();
  };

  if (isLoadingHorses()) {
    return null;
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Horses for Race</DialogTitle>
      <DialogContent sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Box mb={2}>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={handleSelectAll}>Select All</Button>
            <Button onClick={handleDeselectAll}>Deselect All</Button>
          </ButtonGroup>
        </Box>
        <List>
          {horses.map((horse) => (
            <ListItem key={horse._id} disablePadding>
              <ListItemButton onClick={() => handleToggleHorse(horse._id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedHorses.includes(horse._id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={`${horse.number} - ${horse.name}`}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', gap: 2 }}>
                      <span>Spd: {horse.stats.speed}</span>
                      <span>End: {horse.stats.endurance}</span>
                      <span>Lck: {horse.stats.luck}</span>
                      <span>Comp: {horse.stats.competitiveness}</span>
                      <span>Water: {horse.stats.water_resistance}</span>
                      <span>Wind: {horse.stats.wind_resistance}</span>
                      <span>Elec: {horse.stats.electric_resistance}</span>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HorseSelectionDialog;
