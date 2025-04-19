import { RaceHorse } from '../RaceHorse/RaceHorse';
import { UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';
import { RaceController } from '../RaceController';

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

export class RaceViewport {
  private scale: number = 0.5;
  private viewportX: number = 0;
  private controller: RaceController;
  constructor(controller: RaceController) {
    this.controller = controller;
  }

  public getScale(): number {
    return this.scale;
  }

  public getOffsetX(): number {
    return -this.getViewportX();
  }

  public getOffsetY(): number {
    return -this.getViewportY();
  }

  public getViewportX(): number {
    return this.viewportX;
  }

  public getViewportY(): number {
    return -100;
  }

  public update(horses: RaceHorse[], furlong_length: number) {
    const screenSize = this.controller.getDimensions();

    const furthestHorseX = horses.reduce((furthest, horse) => {
      return Math.max(furthest, horse.x);
    }, 0);

    const finishLineX = furlong_length * UNITS_PER_FURLONG;

    // Scale the horse's position to match viewport scale
    const scaledFurthestHorse = furthestHorseX * this.scale;
    const scaledFinishLineX = finishLineX * this.scale;
    this.viewportX = Math.max(
      -VIEWPORT_DEADZONE_START,
      scaledFurthestHorse - screenSize.width + VIEWPORT_HORSE_LEAD_PADDING,
    );
    this.viewportX = Math.min(
      this.viewportX,
      scaledFinishLineX - screenSize.width + VIEWPORT_DEADZONE_END,
    );
  }
}
