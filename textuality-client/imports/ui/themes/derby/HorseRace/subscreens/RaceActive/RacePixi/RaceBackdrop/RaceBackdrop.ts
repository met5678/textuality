import { Container, TilingSprite, Assets } from 'pixi.js';
import { Dimensions } from '../RacePixi.types';
import { PRE_START_FURLONGS, UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';
import { RaceTextures } from '../RaceTextures/RaceTextures';
export const BACKDROP_PADDING = 500;

export class RaceBackdrop {
  private container: Container;
  private backdropFill: TilingSprite | null = null;
  private worldSize: Dimensions = { width: 0, height: 0 };

  constructor() {
    this.container = new Container();
    this.container.label = 'backdrop';
  }

  public async init() {
    this.backdropFill = new TilingSprite(await Assets.load(RaceTextures.grass));
    this.backdropFill.tileScale.set(1);
    this.backdropFill.tint = 0x9999cc;
    this.container.x =
      -BACKDROP_PADDING - PRE_START_FURLONGS * UNITS_PER_FURLONG;
    this.container.y = -BACKDROP_PADDING;
    this.container.addChild(this.backdropFill);
    this.container.label = 'backdrop-container';
  }

  public updateWorldSize(worldSize: Dimensions) {
    this.worldSize = worldSize;
    if (this.backdropFill) {
      this.backdropFill.width = this.worldSize.width + BACKDROP_PADDING * 2;
      this.backdropFill.height = this.worldSize.height + BACKDROP_PADDING * 2;
    }
  }

  public getContainer(): Container {
    return this.container;
  }

  public destroy() {}
}
