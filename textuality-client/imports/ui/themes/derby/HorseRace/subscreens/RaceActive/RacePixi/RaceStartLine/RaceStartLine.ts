import { Container, Graphics } from 'pixi.js';
import {
  RaceTrack,
  PRE_START_FURLONGS,
  UNITS_PER_FURLONG,
} from '../RaceTrack/RaceTrack';

export class RaceStartLine {
  private container: Container;
  private graphics: Graphics;
  private tracks: RaceTrack[];
  private checkerSize: number = 20;

  constructor(tracks: RaceTrack[]) {
    this.container = new Container();
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.tracks = tracks;
    this.draw();
  }

  private draw() {
    this.graphics.clear();

    // Get the total height of all tracks
    const totalHeight = this.tracks.reduce((height, track) => {
      return height + track.getDimensions().height;
    }, 0);

    // Draw checkerboard pattern
    const numCheckers = Math.ceil(totalHeight / this.checkerSize) + 1;
    for (let i = 0; i < numCheckers; i++) {
      const y = i * this.checkerSize;
      const isRed = i % 2 === 1;

      this.graphics.fill(isRed ? 0x681e22 : 0xc4b090);
      this.graphics.rect(0, y, this.checkerSize, this.checkerSize);
    }
  }

  public getContainer(): Container {
    return this.container;
  }

  public destroy() {
    this.graphics.destroy();
    this.container.destroy();
  }
}
