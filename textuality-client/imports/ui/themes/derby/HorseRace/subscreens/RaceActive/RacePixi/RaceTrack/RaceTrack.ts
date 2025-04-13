import { RaceController } from '../RaceController';
import { Dimensions } from '../RacePixi.types';
import { OVERRUN_DISTANCE } from '/imports/api/themes/derby/race/timeline/generate-timeline';
import { Weather } from '/imports/schemas/derby/race';

export const UNITS_PER_FURLONG = 3000;
export const PRE_START_FURLONGS = 0.5;
export const TRACK_HEIGHT_UNITS = 120;

export class RaceTrack {
  index: number;
  controller: RaceController;
  furlong_length: number;

  constructor(
    index: number,
    furlong_length: number,
    controller: RaceController,
  ) {
    this.index = index;
    this.controller = controller;
    this.furlong_length = furlong_length;
  }

  getDimensions(): Dimensions {
    return {
      width:
        (this.furlong_length + OVERRUN_DISTANCE + PRE_START_FURLONGS) *
        UNITS_PER_FURLONG,
      height: TRACK_HEIGHT_UNITS,
    };
  }

  getPosition(): { x: number; y: number } {
    return {
      x: -PRE_START_FURLONGS * UNITS_PER_FURLONG,
      y: this.index * TRACK_HEIGHT_UNITS,
    };
  }

  getWeather(): Weather {
    return this.controller.getTrackData().weather || 'clear';
  }

  getStartingGatePosition(): { x: number; y: number } {
    return {
      x: PRE_START_FURLONGS * UNITS_PER_FURLONG,
      y: this.getBottomY(),
    };
  }

  getBottomY(): number {
    return this.index * TRACK_HEIGHT_UNITS + TRACK_HEIGHT_UNITS;
  }
}
