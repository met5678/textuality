import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind, useTracker } from 'meteor/react-meteor-data';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
} from '@mui/material';
import Horses from '/imports/api/themes/derby/horse';
import RaceSchema, {
  Race,
  RaceId,
  TRACK_CONDITION_VALUES,
  TrackCondition,
  Weather,
  WEATHER_VALUES,
} from '/imports/schemas/derby/race';
import Races from '/imports/api/themes/derby/race/races';
import { RaceTimelineGraph } from './RaceTimelineGraph';

interface RaceTimelineDialogProps {
  raceId: RaceId;
  onClose: () => void;
}

const RaceTimelineDialog = ({ raceId, onClose }: RaceTimelineDialogProps) => {
  const isLoadingHorses = useSubscribe('horses.all');
  const race = useFind(() => Races.find({ _id: raceId }), [])[0];
  const horses = useFind(
    () =>
      Horses.find({ _id: { $in: race.horses || [] } }, { sort: { number: 1 } }),
    [],
  );
  const raceTimeline = useTracker(() => Races.findOne(race._id)?.timeline);
  const raceResults = useTracker(() => Races.findOne(race._id)?.results);
  const [seed, setSeed] = useState<string>('');
  const [trackCondition, setTrackCondition] = useState<TrackCondition>(
    race.track_condition,
  );
  const [furlongLength, setFurlongLength] = useState<number>(
    race.furlong_length,
  );
  const [weather, setWeather] = useState<Weather>(race.weather || 'clear');

  const handleGenerateTimeline = async () => {
    try {
      // First update the race with current values
      await Meteor.callAsync('derby.races.update', {
        _id: race._id,
        track_condition: trackCondition,
        furlong_length: furlongLength,
        weather: weather,
      });

      // Then generate the timeline
      await Meteor.callAsync(
        'derby.races.generateTimeline',
        race._id,
        seed ? parseInt(seed) : undefined,
      );
    } catch (error) {
      console.error('Error updating race or generating timeline:', error);
    }
  };

  if (isLoadingHorses()) {
    return null;
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Race Timeline</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleGenerateTimeline}
              disabled={!race.horses?.length}
            >
              Generate Race Timeline
            </Button>
            <TextField
              label="Seed"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              type="number"
              size="small"
              sx={{ width: 100 }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Track Condition</InputLabel>
              <Select
                value={trackCondition}
                label="Track Condition"
                onChange={(e) =>
                  setTrackCondition(e.target.value as TrackCondition)
                }
              >
                {TRACK_CONDITION_VALUES.map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Weather</InputLabel>
              <Select
                value={weather}
                label="Weather"
                onChange={(e) => setWeather(e.target.value as Weather)}
              >
                {WEATHER_VALUES.map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ width: 200 }}>
              <Typography variant="body2" gutterBottom>
                Race Length (furlongs)
              </Typography>
              <Slider
                value={furlongLength}
                onChange={(_, value) => setFurlongLength(value as number)}
                min={5}
                max={12}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>

          {raceTimeline && raceResults && (
            <RaceTimelineGraph
              race={race}
              horses={horses}
              timeline={raceTimeline}
              results={raceResults}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RaceTimelineDialog;
