import { Container, Sprite, Texture } from 'pixi.js';
import { RaceTrack } from './RaceTrack';

class RaceTrackResultBannerPixi extends Container {
  private raceTrack: RaceTrack;
  private bannerSprite: Sprite;

  constructor(raceTrack: RaceTrack) {
    super();
    this.raceTrack = raceTrack;
    this.bannerSprite = new Sprite();
    this.init();
    this.update();
  }

  init() {
    this.bannerSprite.texture = Texture.WHITE;
    this.bannerSprite.tint = 0x000000;
    this.bannerSprite.alpha = 0.8;
    this.addChild(this.bannerSprite);
    this.bannerSprite.label = 'result-banner';
  }

  update() {
    const dimensions = this.raceTrack.getDimensions();
    const position = this.raceTrack.getPosition();

    // Position the banner above the track
    this.position.x = position.x;
    this.position.y = position.y - dimensions.height;

    // Set banner size
    this.bannerSprite.width = 400;
    this.bannerSprite.height = dimensions.height;
  }
}

export { RaceTrackPixi, RaceTrackResultBannerPixi };
