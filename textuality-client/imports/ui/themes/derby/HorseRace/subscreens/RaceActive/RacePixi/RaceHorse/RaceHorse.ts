import { RaceController } from '../RaceController';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import { HorseId, HorseStats } from '/imports/schemas/derby/horse';
import { RaceTimeline } from '/imports/schemas/derby/race';
import {
  HorseStatus,
  RaceTimelineHorseKeyframe,
} from '/imports/schemas/derby/race-timeline/types';
import { RaceTrack, UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';
import gsap from 'gsap';
import { KEYFRAME_INTERVAL_SECONDS } from '/imports/api/themes/derby/race/timeline/generate-timeline';

export const BOTTOM_PADDING = 30;

export class RaceHorse {
  id!: HorseId;
  name!: string;
  color!: string;
  stats!: HorseStats;

  index: number;
  horse: HorseWithHelpers;
  controller: RaceController;
  track: RaceTrack;

  x: number = 0;
  y: number = 0;
  currentStatus: HorseStatus = 'still';
  _gsapTimeline: gsap.core.Timeline;

  constructor(
    index: number,
    horse: HorseWithHelpers,
    track: RaceTrack,
    controller: RaceController,
  ) {
    this.index = index;
    this.id = horse._id;
    this.horse = horse;
    this.controller = controller;
    this.track = track;
    this.setHorse(horse);
    this.update(0);
    this._gsapTimeline = gsap.timeline({
      paused: true,
    });
  }

  setHorse(horse: HorseWithHelpers) {
    this.id = horse._id;
    this.name = horse.name;
    this.color = horse.color;
    this.stats = horse.stats;
  }

  setKeyframes(horseKeyframes: RaceTimelineHorseKeyframe[]) {
    this._gsapTimeline.clear();

    console.log('setKeyframes', { horseKeyframes });

    horseKeyframes.forEach((keyframe) => {
      if (keyframe.frame < 1) return;
      this._gsapTimeline.to(
        this,
        {
          x: keyframe.position * UNITS_PER_FURLONG,
          duration: KEYFRAME_INTERVAL_SECONDS,
          ease: 'none',
        },
        keyframe.frame - 1,
      );
    });
  }

  update(time: number) {
    this._gsapTimeline?.seek(time);
    this.y = this.track.getBottomY() - BOTTOM_PADDING;
  }
}
