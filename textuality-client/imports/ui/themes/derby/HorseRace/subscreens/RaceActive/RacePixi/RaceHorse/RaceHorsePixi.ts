import { Application, Container, Sprite, Texture } from 'pixi.js';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
class RaceHorsePixi extends Container {
  private horseSprite: Sprite;

  constructor(horse: HorseWithHelpers) {
    super();
    this.horseSprite = new Sprite();
    this.horseSprite.width = 50;
    this.horseSprite.height = 50;
    this.horseSprite.texture = Texture.WHITE;
    this.horseSprite.tint = 0x227722;
    this.addChild(this.horseSprite);
  }

  update() {}

  destroy() {
    this.horseSprite.destroy();
  }
}

export default RaceHorsePixi;
