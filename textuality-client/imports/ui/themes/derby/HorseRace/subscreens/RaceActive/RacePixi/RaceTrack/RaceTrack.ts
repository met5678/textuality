import { RaceController } from '../RaceController';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import { Dimensions } from '../RacePixi.types';
import { Weather } from '/imports/schemas/derby/race';

export const UNITS_PER_FURLONG = 1000;
export const TRACK_HEIGHT_UNITS = 150;

export class RaceTrack {
  index: number;
  horse: RaceHorse;
  controller: RaceController;
  height: number;
  furlong_length: number;

  constructor(
    index: number,
    horse: RaceHorse,
    height: number,
    controller: RaceController,
  ) {
    this.index = index;
    this.horse = horse;
    this.controller = controller;
    this.height = height;
    this.furlong_length = 5;
  }

  getDimensions(): Dimensions {
    return {
      width: this.furlong_length * UNITS_PER_FURLONG,
      height: TRACK_HEIGHT_UNITS,
    };
  }

  getPosition(): { x: number; y: number } {
    return {
      x: 0,
      y: this.index * TRACK_HEIGHT_UNITS,
    };
  }

  getWeather(): Weather {
    return this.controller.getTrackData().weather || 'clear';
  }
}
