import { GodrayFilter } from 'pixi-filters';
import { Container, Sprite, Texture } from 'pixi.js';

export class SunOverlayPixi extends Container {
  private sunOverlaySprite: Sprite;
  private godrayFilter: GodrayFilter = new GodrayFilter({
    alpha: 0.5,
    gain: 0.6,
    angle: 30,
    time: 0,
    lacunarity: 2.75,
  });

  constructor() {
    super();

    this.sunOverlaySprite = new Sprite(Texture.WHITE);
    this.sunOverlaySprite.blendMode = 'add';
    this.sunOverlaySprite.alpha = 0;

    this.addChild(this.sunOverlaySprite);
  }

  public updateSize(width: number, height: number) {
    this.sunOverlaySprite.width = width;
    this.sunOverlaySprite.height = height;
  }

  public enable() {
    this.sunOverlaySprite.filters = [this.godrayFilter];
    this.visible = true;
  }

  public update() {
    this.godrayFilter.time += 0.003;
  }

  public disable() {
    this.sunOverlaySprite.filters = [];
    this.visible = false;
  }
}
