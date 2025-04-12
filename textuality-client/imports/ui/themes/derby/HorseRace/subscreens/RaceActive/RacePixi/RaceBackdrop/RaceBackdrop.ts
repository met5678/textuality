import { Container, TilingSprite, Assets } from 'pixi.js';
import { Dimensions } from '../RacePixi.types';

export const BACKDROP_PADDING = 200;

export class RaceBackdrop {
  private container: Container;
  private backdropFill: TilingSprite | null = null;
  private worldSize: Dimensions = { width: 0, height: 0 };

  constructor() {
    this.container = new Container();
    this.container.label = 'backdrop';
  }

  public async init() {
    this.backdropFill = new TilingSprite(
      await Assets.load('/derby/textures/grass.png'),
    );
    this.backdropFill.tileScale.set(1);
    this.updateWorldSize({ width: 8000, height: 8000 });
    this.container.x = -BACKDROP_PADDING;
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

  public destroy() {
    this.backdropFill?.destroy();
    this.container.destroy();
  }
}
