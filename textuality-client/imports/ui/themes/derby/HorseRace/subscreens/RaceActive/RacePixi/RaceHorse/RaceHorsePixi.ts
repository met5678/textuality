import {
  AnimatedSprite,
  Application,
  Container,
  Sprite,
  Texture,
} from 'pixi.js';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import RaceTrackPixi from '../RaceTrack/RaceTrackPixi';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import { HORSE_SPRITES } from './RaceHorseSprites';

class RaceHorsePixi extends Container {
  private horseSprite: AnimatedSprite;
  private raceHorse: RaceHorse;

  constructor(horse: RaceHorse) {
    super();
    this.raceHorse = horse;
    this.horseSprite = new AnimatedSprite(HORSE_SPRITES.running, true);
    this.horseSprite.anchor.set(1, 1);
    this.horseSprite.label = 'horseSprite';
    this.horseSprite.animationSpeed = 0.5;

    this.horseSprite.scale.set(1);
    this.horseSprite.play();
    this.horseSprite.tint = this.raceHorse.color;
    this.addChild(this.horseSprite);

    // this.addChild(new Sprite(Texture.WHITE));
    this.label = 'horseContainer';
  }

  update() {
    this.x = this.raceHorse.x;
    this.y = this.raceHorse.y;
    this.horseSprite.tint = this.raceHorse.color;
  }

  destroy() {
    this.horseSprite.destroy();
  }
}

export default RaceHorsePixi;
