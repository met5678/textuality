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
import Horses from '../../../../../api/themes/derby/horses';
import RaceSchema, {
  Race,
  RaceId,
  Weather,
  WEATHER_VALUES,
} from '/imports/schemas/derby/race';
import Races from '/imports/api/themes/derby/race/races';
import { RaceTimelineGraph } from './RaceTimelineGraph';
import { KEYFRAME_INTERVAL_SECONDS } from '/imports/api/themes/derby/race/timeline/generate-timeline';
import { RacePlaybackControls } from './components/RacePlaybackControls';

interface RaceTimelineDialogProps {
  raceId: RaceId;
  onClose: () => void;
}

const RaceTimelineDialog = ({ raceId, onClose }: RaceTimelineDialogProps) => {
  const isLoadingHorses = useSubscribe('derby.horses.all');
  const race = useFind(() => Races.find({ _id: raceId }), [])[0];
  const horses = useFind(
    () =>
      Horses.find({ _id: { $in: race.horses || [] } }, { sort: { number: 1 } }),
    [],
  );
  const raceTimeline = useTracker(() => Races.findOne(race._id)?.timeline);
  const raceResults = useTracker(() => Races.findOne(race._id)?.results);
  const [seed, setSeed] = useState<string>('');
  const [furlongLength, setFurlongLength] = useState<number>(
    race.furlong_length,
  );
  const [weather, setWeather] = useState<Weather>(race.weather || 'clear');
  const currentFrame = useTracker(
    () => Races.findOne(race._id)?.timeline?.current_frame || 0,
  );

  const handleGenerateTimeline = async () => {
    try {
      // First update the race with current values
      await Meteor.callAsync('derby.races.update', {
        _id: race._id,
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

  const handleStartRace = async () => {
    try {
      await Meteor.callAsync('derby.races.startRace', raceId);
    } catch (error) {
      console.error('Error starting race:', error);
    }
  };

  const handlePauseRace = async () => {
    try {
      await Meteor.callAsync('derby.races.pauseRace', raceId);
    } catch (error) {
      console.error('Error pausing race:', error);
    }
  };

  const handleResumeRace = async () => {
    try {
      await Meteor.callAsync('derby.races.startRace', raceId, true);
    } catch (error) {
      console.error('Error resuming race:', error);
    }
  };

  const handleStopRace = async () => {
    try {
      await Meteor.callAsync('derby.races.stopRace', raceId);
    } catch (error) {
      console.error('Error stopping race:', error);
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={furlongLength}
                    onChange={(_, value) => setFurlongLength(value as number)}
                    min={5}
                    max={12}
                    step={1}
                    valueLabelDisplay="off"
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 20 }}>
                    {furlongLength}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <RacePlaybackControls
                raceId={raceId}
                timeline={raceTimeline}
                onStart={handleStartRace}
                onPause={handlePauseRace}
                onResume={handleResumeRace}
                onStop={handleStopRace}
              />
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Current Frame:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ minWidth: 40, textAlign: 'center' }}
                >
                  {currentFrame}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({Math.round(currentFrame * KEYFRAME_INTERVAL_SECONDS)}s)
                </Typography>
              </Box>
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
