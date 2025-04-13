import React from 'react';
import { IconButton, ButtonGroup } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { RaceTimeline } from '/imports/schemas/derby/race';

interface RacePlaybackControlsProps {
  raceId: string;
  timeline?: RaceTimeline;
  size?: 'small' | 'medium' | 'large';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const RacePlaybackControls: React.FC<RacePlaybackControlsProps> = ({
  timeline,
  size = 'large',
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  return (
    <ButtonGroup variant="contained" size={size}>
      <IconButton
        onClick={() => {
          onStop();
        }}
        disabled={!timeline}
        size={size}
      >
        <FastRewindIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          if (timeline?.is_playing) {
            onPause();
          } else {
            timeline?.current_frame === 0 ? onStart() : onResume();
          }
        }}
        disabled={!timeline}
        size={size}
        color={timeline?.is_playing ? 'success' : 'default'}
      >
        {timeline?.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    </ButtonGroup>
  );
};
