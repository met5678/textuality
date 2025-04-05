import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import { HorseId, HorseStats } from '/imports/schemas/derby/horse';
import {
  HorseStatus,
  JockeyStatus,
  RaceTimeline,
  RaceTimelineHorseKeyframe,
} from '/imports/schemas/derby/race';

export class RaceHorse {
  id!: HorseId;
  name!: string;
  color!: string;
  stats!: HorseStats;
  keyframes: RaceTimelineHorseKeyframe[];

  currentPosition: number;
  currentStatus: HorseStatus;
  currentJockeyStatus: JockeyStatus;

  constructor(horse: HorseWithHelpers) {
    this.setHorse(horse);
    this.keyframes = [];

    this.currentStatus = 'still';
    this.currentJockeyStatus = 'still';
    this.currentPosition = 0;
  }

  setHorse(horse: HorseWithHelpers) {
    this.id = horse._id;
    this.name = horse.name;
    this.color = horse.color;
    this.stats = horse.stats;
  }

  setKeyframes(timeline: RaceTimeline) {
    this.keyframes = timeline.horses[this.id];
  }

  /**
   * Updates the timeline position of the horse. Finds the keyframe before and after
   * the given position and interpolates the horse's position, status, and jockey status between them.
   * @param timelineFrame - The frame in the timeline to update to.
   */
  updateForTimelineFrame(timelineFrame: number) {
    const keyframeBefore = this.keyframes.find((k) => k.frame <= timelineFrame);
    const keyframeAfter = this.keyframes.find((k) => k.frame > timelineFrame);

    if (!keyframeBefore || !keyframeAfter) {
      return;
    }

    this.currentPosition =
      keyframeBefore.position +
      ((keyframeAfter.position - keyframeBefore.position) *
        (timelineFrame - keyframeBefore.frame)) /
        (keyframeAfter.frame - keyframeBefore.frame);

    if (this.currentStatus !== keyframeBefore.status) {
      this.currentStatus = keyframeBefore.status;
    }
    if (this.currentJockeyStatus !== keyframeBefore.jockey_status) {
      this.currentJockeyStatus = keyframeBefore.jockey_status;
    }
  }
}
