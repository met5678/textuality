import { RaceController } from '../RaceController';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';
import { HorseId, HorseStats } from '/imports/schemas/derby/horse';
import {
  HorseStatus,
  RaceTimelineHorseKeyframe,
} from '/imports/schemas/derby/race-timeline/types';
import { RaceTrack, UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';
import gsap from 'gsap';
import { KEYFRAME_INTERVAL_SECONDS } from '/imports/api/themes/derby/race/timeline/generate-timeline';
import { RaceHorseResult } from '/imports/schemas/derby/race';
import { ColorSource } from 'pixi.js';

export const BOTTOM_PADDING = 30;

const getGlowForKeyframe = (keyframe: RaceTimelineHorseKeyframe) => {
  console.log('keyframe', keyframe);
  if (keyframe.effects.includes('electrocuted')) {
    console.log('electrocuted');
    return {
      color: 0xffffaa,
      alpha: 1,
      strength: 20,
      knockout: true,
    };
  }
  if (keyframe.effects.includes('electricboost')) {
    return {
      color: 0xaaffff,
      alpha: 1,
      strength: 20,
      knockout: false,
    };
  }
  // if (keyframe.effects.includes('blownback')) {
  //   return {
  //     color: 0xaaaaaa,
  //     alpha: 1,
  //     strength: 5,
  //     knockout: false,
  //   };
  // }
  return {
    color: 0x000000,
    alpha: 0,
    strength: 0,
    knockout: false,
  };
};

export class RaceHorse {
  id!: HorseId;
  name!: string;
  color!: string;
  stats!: HorseStats;

  index: number;
  controller: RaceController;
  track: RaceTrack;

  x: number = 0;
  y: number = 0;
  currentStatus: HorseStatus = 'still';
  result: RaceHorseResult | null = null;
  _gsapPositionTimeline: gsap.core.Timeline;
  _gsapEffectTimeline: gsap.core.Timeline;

  glowColor: ColorSource = 0xffffaa;
  glowStrength: number = 0;
  glowKnockout: boolean = false;
  glowAlpha: number = 0;
  constructor(
    index: number,
    horse: HorseWithHelpers,
    track: RaceTrack,
    controller: RaceController,
  ) {
    this.index = index;
    this.setHorse(horse);
    this.controller = controller;
    this.track = track;
    this.update(0);
    this._gsapPositionTimeline = gsap.timeline({
      paused: true,
    });
    this._gsapEffectTimeline = gsap.timeline({
      paused: true,
    });
  }

  setHorse(horse: HorseWithHelpers) {
    this.id = horse._id;
    this.name = horse.name;
    this.color = horse.color;
    this.stats = horse.stats();
  }

  setResult(result: RaceHorseResult) {
    this.result = result;
  }

  setKeyframes(horseKeyframes: RaceTimelineHorseKeyframe[]) {
    this._gsapPositionTimeline.clear();

    horseKeyframes.forEach((keyframe) => {
      if (keyframe.frame < 1) return;
      this._gsapPositionTimeline.to(
        this,
        {
          x: keyframe.position * UNITS_PER_FURLONG,
          duration: KEYFRAME_INTERVAL_SECONDS,
          ease: 'none',
        },
        keyframe.frame - 1,
      );

      this._gsapEffectTimeline.to(
        this,
        {
          glowColor: getGlowForKeyframe(keyframe)?.color,
          glowStrength: getGlowForKeyframe(keyframe)?.strength || 0,
          glowKnockout: getGlowForKeyframe(keyframe)?.knockout || false,
          glowAlpha: getGlowForKeyframe(keyframe)?.alpha || 0,
        },
        keyframe.frame,
      );
    });
  }

  update(time: number) {
    this._gsapPositionTimeline?.seek(time);
    this._gsapEffectTimeline?.seek(time);
    this.y = this.track.getBottomY() - BOTTOM_PADDING;
  }
}
