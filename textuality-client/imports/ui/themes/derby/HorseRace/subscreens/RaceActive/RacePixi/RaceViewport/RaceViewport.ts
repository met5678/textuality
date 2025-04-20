import { RaceHorse } from '../RaceHorse/RaceHorse';
import { TRACK_HEIGHT_UNITS, UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';
import { RaceController } from '../RaceController';
import { clamp } from '/imports/utils/clamp';
import { BACKDROP_PADDING } from '../RaceBackdrop/RaceBackdrop';
import { linearInterpolate } from '/imports/utils/linear-interpolate';

/**
 * How far from the left edge of the screen the starting line can be before the viewport starts scrolling
 */
export const VIEWPORT_DEADZONE_START = 600;

/**
 * How far from the right edge of the screen the finish line can be before the viewport stops scrolling
 */
export const VIEWPORT_DEADZONE_END = 500;

/**
 * How much padding to leave between the leading horse and the right edge of the screen
 */
export const VIEWPORT_HORSE_LEAD_PADDING = 250;

/**
 * How much padding to leave between the trailing horse and the left edge of the screen
 */
export const VIEWPORT_HORSE_TRAIL_PADDING = 300;

/**
 * How much padding to add to the top to keep the top horse sprite from being cut off
 */
export const TOP_HORSE_PADDING = 100;

/**
 * How much additional padding of grass to add to the top/bottom of the viewport
 */
export const LAWN_PADDING_MIN = 50;
export const LAWN_PADDING_MAX = BACKDROP_PADDING - TOP_HORSE_PADDING;

/**
 * How much progress through the race starts to start interpolating the scale
 */
const INTERPOLATE_AFTER = 0.8;

export class RaceViewport {
  private controller: RaceController;
  private _offsetX: number = 0;

  constructor(controller: RaceController) {
    this.controller = controller;
  }

  private getTracksHeight() {
    return this.controller.getTracks().length * TRACK_HEIGHT_UNITS;
  }

  private getMinPaddedTracksHeight() {
    return this.getTracksHeight() + TOP_HORSE_PADDING + LAWN_PADDING_MIN * 2;
  }

  private getMaxPaddedTracksHeight() {
    return this.getTracksHeight() + TOP_HORSE_PADDING + LAWN_PADDING_MAX * 2;
  }

  private getViewportHeight() {
    return this.controller.getDimensions().height;
  }

  private getViewportWidth() {
    return this.controller.getDimensions().width;
  }

  private getMaxScale() {
    const viewportHeight = this.getViewportHeight();
    const paddedViewportHeight = viewportHeight;

    const paddedTracksHeight = this.getMinPaddedTracksHeight();

    const scale = paddedViewportHeight / paddedTracksHeight;
    return scale;
  }

  private getMinScale() {
    const viewportHeight = this.getViewportHeight();
    const paddedViewportHeight = viewportHeight;

    const paddedTracksHeight = this.getMaxPaddedTracksHeight();

    const scale = paddedViewportHeight / paddedTracksHeight;
    return scale;
  }

  private getMinScaleWithInterpolation() {
    const raceProgress = Math.min(1, this.controller.getRaceProgress());
    const interpolateProgress =
      raceProgress <= INTERPOLATE_AFTER
        ? 0
        : (raceProgress - INTERPOLATE_AFTER) / (1 - INTERPOLATE_AFTER);

    return linearInterpolate(
      this.getMinScale(),
      this.getMaxScale(),
      interpolateProgress,
    );
  }

  private getLeadingAndTrailingHorseX() {
    let leadingHorseX = -Infinity;
    let trailingHorseX = Infinity;

    for (const horse of this.controller.getHorses()) {
      if (horse.x > leadingHorseX) {
        leadingHorseX = horse.x;
      }
      if (horse.x < trailingHorseX) {
        trailingHorseX = horse.x;
      }
    }

    return { leadingHorseX, trailingHorseX };
  }

  private getScaleToFitHorses() {
    const { leadingHorseX, trailingHorseX } =
      this.getLeadingAndTrailingHorseX();
    const horseRangeX = leadingHorseX - trailingHorseX;

    const viewportWidthWithPadding =
      this.getViewportWidth() -
      VIEWPORT_HORSE_TRAIL_PADDING -
      VIEWPORT_HORSE_LEAD_PADDING;

    const scaleToFitHorses = viewportWidthWithPadding / horseRangeX;

    return scaleToFitHorses;
  }

  public getScale() {
    return clamp(
      this.getScaleToFitHorses(),
      this.getMinScaleWithInterpolation(),
      this.getMaxScale(),
    );
  }

  public getOffsetX(): number {
    const { leadingHorseX } = this.getLeadingAndTrailingHorseX();

    const finishLineX =
      this.controller.getTrackData().furlong_length * UNITS_PER_FURLONG;

    // Scale the horse's position to match viewport scale
    const scaledFurthestHorse = leadingHorseX * this.getScale();
    const scaledFinishLineX = finishLineX * this.getScale();

    const horseOffsetX =
      scaledFurthestHorse -
      this.getViewportWidth() +
      VIEWPORT_HORSE_LEAD_PADDING;

    const minX = -VIEWPORT_DEADZONE_START;
    const maxX =
      scaledFinishLineX - this.getViewportWidth() + VIEWPORT_DEADZONE_END;

    const result = clamp(horseOffsetX, minX, maxX);

    return -result;
  }

  public getOffsetY(): number {
    const scaledTracksHeight = this.getTracksHeight() * this.getScale();
    const scaledTracksMidpoint = scaledTracksHeight / 2;
    const viewportHeight = this.getViewportHeight();
    const viewportMidpoint = viewportHeight / 2;
    const offsetY =
      viewportMidpoint -
      scaledTracksMidpoint +
      TOP_HORSE_PADDING * this.getScale() * 0.5;
    return offsetY;
  }

  public update(horses: RaceHorse[], furlong_length: number) {}
}
