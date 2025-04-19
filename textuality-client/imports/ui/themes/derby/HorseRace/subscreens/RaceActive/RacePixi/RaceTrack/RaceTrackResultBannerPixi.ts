import { Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { RaceTrack } from './RaceTrack';
import gsap from 'gsap';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import ordinal from 'ordinal';
import { RaceTrackResultBanner } from './RaceTrackResultBanner';

const BANNER_TEXT_STYLE = new TextStyle({
  fontFamily: 'house-of-cards, serif',
  fontSize: 24,
  fill: 0xffffff,
});

export class RaceTrackResultBannerPixi extends Container {
  private resultBanner: RaceTrackResultBanner;
  private bannerSprite: Sprite;
  private bannerText: Text;
  private bannerMask: Graphics;

  constructor(resultBanner: RaceTrackResultBanner) {
    super();
    this.resultBanner = resultBanner;
    this.bannerSprite = new Sprite();
    this.bannerText = new Text({
      style: BANNER_TEXT_STYLE,
    });
    this.bannerMask = new Graphics();
    this.addChild(this.bannerSprite);
    this.addChild(this.bannerText);
    this.init();
    this.update();
  }

  init() {
    // console.log('init', this.resultBanner);

    if (!this.resultBanner.ready) {
      return;
    }

    this.bannerSprite.texture = Texture.WHITE;
    this.bannerSprite.tint = this.resultBanner.getColor();
    this.bannerSprite.label = 'result-banner-background';

    this.bannerText.text = this.resultBanner.getBannerText();

    this.bannerSprite.width = this.bannerText.width + 20;
    this.bannerSprite.height = this.resultBanner.getTrackHeight();
    this.bannerText.y = 10;

    const position = this.resultBanner.getPosition();
    this.position.set(position.x, position.y);
    console.log({ position });
  }

  update() {}

  destroy() {
    this.bannerSprite.destroy();
    this.bannerText.destroy();
    this.bannerMask.destroy();
  }
}
