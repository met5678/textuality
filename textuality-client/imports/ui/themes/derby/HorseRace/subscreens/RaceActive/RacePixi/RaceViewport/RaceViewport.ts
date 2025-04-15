import { Viewport } from 'pixi-viewport';
import { Application, Point } from 'pixi.js';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import { Dimensions } from '../RacePixi.types';
import { UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';
import { RaceController } from '../RaceController';
const DEADZONE_START = 600;
const DEADZONE_END = 500;
const HORSE_LEAD_PADDING = 250;

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
      -DEADZONE_START,
      scaledFurthestHorse - screenSize.width + HORSE_LEAD_PADDING,
    );
    this.viewportX = Math.min(
      this.viewportX,
      scaledFinishLineX - screenSize.width + DEADZONE_END,
    );
  }

  public destroy() {
    // Cleanup if needed
  }
}
