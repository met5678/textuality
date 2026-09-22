import { AnimatedSprite, Container } from 'pixi.js';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import { HORSE_SPRITES, JOCKEY_SPRITES } from './RaceHorseSprites';
import { BloomFilter, ColorReplaceFilter, GlowFilter } from 'pixi-filters';

const bloomFilter = new BloomFilter({
  strength: 2,
});

class RaceHorsePixi extends Container {
  private horseSprite: AnimatedSprite;
  private raceHorse: RaceHorse;
  private glowFilter: GlowFilter;
  private jockeySprite: AnimatedSprite;

  private _jockeyColorFilter: ColorReplaceFilter;
  constructor(horse: RaceHorse) {
    super();
    this.raceHorse = horse;
    this.horseSprite = new AnimatedSprite(HORSE_SPRITES.running, true);
    this.horseSprite.anchor.set(1, 1);
    this.horseSprite.label = 'horseSprite';
    this.horseSprite.animationSpeed = 0.5;
    this.jockeySprite = new AnimatedSprite(JOCKEY_SPRITES.running, true);
    this.jockeySprite.anchor.set(1, 1);
    this.jockeySprite.label = 'jockeySprite';
    this.jockeySprite.animationSpeed = 0.5;
    this._jockeyColorFilter = new ColorReplaceFilter({
      originalColor: 0x0000ff,
      targetColor: 0x0000ff,
    });
    this.jockeySprite.filters = [this._jockeyColorFilter];
    this.glowFilter = new GlowFilter({
      color: 0xffffaa,
      outerStrength: 2,
      innerStrength: 0,
      alpha: 0.5,
      distance: 5,
    });

    this.horseSprite.scale.set(1);
    this.horseSprite.play();
    this.horseSprite.tint = this.raceHorse.color;
    this.jockeySprite.scale.set(1);
    this.jockeySprite.play();
    this._jockeyColorFilter.targetColor = this.raceHorse.color;
    this.addChild(this.horseSprite);
    this.addChild(this.jockeySprite);
    // this.addChild(new Sprite(Texture.WHITE));
    this.label = 'horseContainer';
  }

  update() {
    this.x = this.raceHorse.x;
    this.y = this.raceHorse.y;
    this.horseSprite.tint = this.raceHorse.color;
    this._jockeyColorFilter.targetColor = this.raceHorse.color;

    if (this.raceHorse.glowStrength > 0) {
      this.filters = [this.glowFilter, bloomFilter];
      this.glowFilter.outerStrength = this.raceHorse.glowStrength;
      this.glowFilter.innerStrength = this.raceHorse.glowStrength;
      this.glowFilter.color = this.raceHorse.glowColor;
    } else {
      this.filters = [];
    }
  }

  destroy() {
    this.horseSprite.destroy();
  }
}

export default RaceHorsePixi;
