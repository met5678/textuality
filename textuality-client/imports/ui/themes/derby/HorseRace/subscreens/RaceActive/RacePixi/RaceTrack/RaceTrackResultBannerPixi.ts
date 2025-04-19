import { Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import {
  RaceTrackResultBanner,
  RESULT_BANNER_FILL,
  RESULT_BANNER_FONT_FAMILY,
  RESULT_BANNER_MARGIN_Y,
  RESULT_BANNER_PADDING_X,
  RESULT_BANNER_PADDING_Y,
} from './RaceTrackResultBanner';

export class RaceTrackResultBannerPixi extends Container {
  private resultBanner: RaceTrackResultBanner;
  private bannerSprite: Sprite;
  private bannerText: Text;
  private bannerMask: Graphics;

  constructor(resultBanner: RaceTrackResultBanner) {
    super();
    this.resultBanner = resultBanner;
    this.bannerSprite = new Sprite();
    this.bannerSprite.anchor.set(1, 0);
    this.bannerSprite.label = 'result-banner-background';
    this.bannerText = new Text({
      style: this.getTextStyle(),
    });
    this.bannerText.anchor.set(1, 0);
    this.bannerText.label = 'result-banner-text';
    this.bannerMask = new Graphics();
    this.addChild(this.bannerSprite);
    this.addChild(this.bannerText);
    this.init();
    this.update();
  }

  getTextStyle(): TextStyle {
    return new TextStyle({
      fontFamily: RESULT_BANNER_FONT_FAMILY,
      fontSize: this.resultBanner.getFontHeight(),
      fill: RESULT_BANNER_FILL,
    });
  }

  init() {
    // if (!this.resultBanner.ready) {
    //   return;
    // }

    this.bannerText.text = this.resultBanner.getBannerText();
    this.bannerText.x = -RESULT_BANNER_PADDING_X;
    this.bannerText.y = RESULT_BANNER_PADDING_Y;

    this.bannerSprite.texture = Texture.WHITE;
    this.bannerSprite.tint = this.resultBanner.getColor();
    this.bannerSprite.width =
      this.bannerText.width + RESULT_BANNER_PADDING_X * 2;
    this.bannerSprite.height = this.resultBanner.getBannerHeight();

    const position = this.resultBanner.getPosition();
    this.position.set(position.x, position.y);
    console.log({ position, bannerDims: this.bannerSprite.getSize() });
  }

  update() {
    this.visible = this.resultBanner.isVisible;
  }

  destroy() {
    this.bannerSprite.destroy();
    this.bannerText.destroy();
    this.bannerMask.destroy();
  }
}
