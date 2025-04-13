import { Container, Graphics } from 'pixi.js';
import { RaceTrack } from '../RaceTrack/RaceTrack';
import { UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';

export class RaceFinishLine {
  private container: Container;
  private graphics: Graphics;
  private tracks: RaceTrack[];
  private furlongLength: number;
  private checkerSize: number = 20; // Increased size for better visibility

  constructor(tracks: RaceTrack[], furlongLength: number) {
    this.container = new Container();
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.tracks = tracks;
    this.furlongLength = furlongLength;
    this.draw();
  }

  private draw() {
    this.graphics.clear();

    // Calculate the finish line position
    const finishX = this.furlongLength * UNITS_PER_FURLONG;

    // Get the total height of all tracks
    const totalHeight = this.tracks.reduce((height, track) => {
      return height + track.getDimensions().height;
    }, 0);

    // Draw checkerboard pattern
    const numCheckers = Math.ceil(totalHeight / this.checkerSize);
    for (let i = 0; i < numCheckers; i++) {
      const y = i * this.checkerSize;
      const isBlack = i % 2 === 0;

      this.graphics.rect(
        finishX - this.checkerSize,
        y,
        this.checkerSize,
        this.checkerSize,
      );
      this.graphics.fill(isBlack ? 0x000000 : 0xffffff);
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
