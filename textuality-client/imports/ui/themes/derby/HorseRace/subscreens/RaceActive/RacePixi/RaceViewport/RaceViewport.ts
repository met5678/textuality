import { Viewport } from 'pixi-viewport';
import { RacePixi } from '../RacePixi';
import { Application, Point } from 'pixi.js';
import { RaceHorse } from '../RaceHorse/RaceHorse';
export class RaceViewport extends Viewport {
  constructor(app: Application) {
    super({
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      worldWidth: 1000,
      worldHeight: 1000,
      events: app.renderer.events,
    });
  }

  setScreenSize(width: number, height: number) {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  setWorldSize(width: number, height: number) {
    this.worldWidth = width;
    this.worldHeight = height;
  }

  updateViewport(horses: RaceHorse[]) {
    const horsePositions = horses.map((horse) => horse.x);
    const minX = Math.min(...horsePositions);
    const maxX = Math.max(...horsePositions);
    const minY = Math.min(...horsePositions);
    const maxY = Math.max(...horsePositions);
    this.center = new Point((minX + maxX) / 2, (minY + maxY) / 2);
    this.fit(true, maxX - minX, maxY - minY);
    this.clamp();
  }
}
