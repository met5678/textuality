import { Assets, Container, TilingSprite } from 'pixi.js';
import { RaceTextures } from '../RaceTextures/RaceTextures';
import { PRE_START_FURLONGS, UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';

export class RaceFencePixi extends Container {
  private fence: TilingSprite = new TilingSprite();

  constructor() {
    super();
    this.init();
    this.label = 'fence-container';
    this.fence.label = 'fence';
  }

  async init() {
    this.fence.texture = await Assets.load(RaceTextures.fence);
    this.addChild(this.fence);
    this.fence.anchor.set(0, 1);
    this.fence.scale.set(1, 0.75);
  }

  updateSize(width: number) {
    this.fence.width = width;
    this.fence.height = 128;
    this.x = -PRE_START_FURLONGS * UNITS_PER_FURLONG;
  }

  updateYPosition(y: number) {
    console.log('updateYPosition', y);
    this.y = y;
  }
}
