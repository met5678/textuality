import { Container, Sprite, Texture } from 'pixi.js';
import { Race } from '/imports/schemas/derby/race';
import RaceHorsePixi from '../RaceHorse/RaceHorsePixi';

class RaceTrackPixi extends Container {
  horse: RaceHorsePixi;
  groundSprite: Sprite;
  topEdgeSprite: Sprite;
  bottomEdgeSprite: Sprite;

  constructor(horse: RaceHorsePixi) {
    super();
    this.horse = horse;
    this.groundSprite = new Sprite();
    this.topEdgeSprite = new Sprite();
    this.bottomEdgeSprite = new Sprite();
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  init() {
    this.groundSprite.width = this.width;
    this.groundSprite.height = this.height;
    this.groundSprite.texture = Texture.WHITE;
    this.groundSprite.tint = 0x227722;
    this.addChild(this.groundSprite);

    this.topEdgeSprite.width = this.width;
    this.topEdgeSprite.height = 2;
    this.topEdgeSprite.texture = Texture.WHITE;
    this.topEdgeSprite.tint = 0x227722;
    this.addChild(this.topEdgeSprite);

    this.bottomEdgeSprite.width = this.width;
    this.bottomEdgeSprite.height = 2;
    this.bottomEdgeSprite.texture = Texture.WHITE;
    this.bottomEdgeSprite.tint = 0x227722;
    this.bottomEdgeSprite.y = this.height - this.bottomEdgeSprite.height;
    this.addChild(this.bottomEdgeSprite);

    this.addChild(this.horse);
  }

  update() {}
}

export default RaceTrackPixi;
