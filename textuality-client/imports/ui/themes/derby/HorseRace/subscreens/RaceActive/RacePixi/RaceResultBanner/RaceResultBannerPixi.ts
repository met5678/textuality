import {
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'pixi.js';
import {
  RaceTrackBanner,
  RESULT_BANNER_FILL,
  RESULT_BANNER_FONT_FAMILY,
  RESULT_BANNER_FONT_WEIGHT,
  RESULT_BANNER_MARGIN_Y,
  RESULT_BANNER_PADDING_X,
  RESULT_BANNER_PADDING_Y,
} from './RaceResultBanner';
import fontColorContrast from 'font-color-contrast';
import { DropShadowFilter, GlowFilter } from 'pixi-filters';
import { RaceTextures } from '../RaceTextures/RaceTextures';

export class RaceResultBannerPixi extends Container {
  private resultBanner: RaceTrackBanner;
  private bannerContainer: Container = new Container();
  private bannerSprite1: Sprite = new Sprite();
  private bannerSprite2: Sprite = new Sprite();
  private medalSprite: Sprite = new Sprite();
  private bannerText: Text;
  private bannerMask: Graphics;
  private glowFilter: GlowFilter = new GlowFilter();

  constructor(resultBanner: RaceTrackBanner) {
    super();
    this.resultBanner = resultBanner;

    this.createBannerBackground();
    this.createMedalSprite();

    this.bannerText = new Text({
      style: this.getTextStyle(),
    });
    this.bannerText.anchor.set(1, 0);
    this.bannerText.label = 'result-banner-text';
    this.bannerMask = new Graphics();

    this.addChild(this.bannerContainer);
    this.addChild(this.bannerText);
    this.init();
    this.update();
  }

  private async createMedalSprite() {
    const medalTexture = await Assets.load(RaceTextures.medal);
    this.medalSprite.texture = medalTexture;
    this.medalSprite.anchor.set(0.5, 0.5);
    this.medalSprite.label = 'result-banner-medal';

    this.medalSprite.filters = [
      new GlowFilter({
        color: 0xffffff,
        alpha: 0.5,
        innerStrength: 1,
        outerStrength: 3,
      }),
    ];

    this.addChild(this.medalSprite);
  }

  private createBannerBackground() {
    this.bannerContainer.label = 'result-banner-background';

    this.bannerSprite1 = new Sprite();
    this.bannerSprite1.anchor.set(1, 0);
    this.bannerSprite1.label = 'result-banner-background-1';
    this.bannerSprite1.texture = Texture.WHITE;
    this.bannerSprite1.skew.set(-0.3, 0);
    this.bannerSprite1.position.set(15, 0);

    this.bannerSprite2 = new Sprite();
    this.bannerSprite2.anchor.set(1, 0);
    this.bannerSprite2.label = 'result-banner-background-2';
    this.bannerSprite2.texture = Texture.WHITE;
    this.bannerSprite2.skew.set(0.3, 0);
    this.bannerSprite2.position.set(-15, 0);

    this.bannerContainer.addChild(this.bannerSprite1);
    this.bannerContainer.addChild(this.bannerSprite2);

    this.bannerContainer.filters = [
      new GlowFilter({
        color: 0xffffff,
        alpha: 0.3,
        innerStrength: 1,
        outerStrength: 3,
      }),
    ];

    this.addChild(this.bannerContainer);
  }

  getTextStyle(): TextStyle {
    return new TextStyle({
      fontFamily: RESULT_BANNER_FONT_FAMILY,
      fontWeight: RESULT_BANNER_FONT_WEIGHT,
      fontSize: this.resultBanner.getFontHeight(),
      fill: RESULT_BANNER_FILL,
    });
  }

  init() {
    this.bannerText.x = -RESULT_BANNER_PADDING_X;
    this.bannerText.y = RESULT_BANNER_PADDING_Y;
    this.bannerText.text = this.resultBanner.getBannerText();
    this.bannerText.style.fill = this.resultBanner.getBannerTextColor();

    this.bannerSprite1.tint = this.resultBanner.getBannerColor();
    this.bannerSprite1.width =
      this.bannerText.width + RESULT_BANNER_PADDING_X * 2;
    this.bannerSprite1.height = this.resultBanner.getBannerHeight();

    this.bannerSprite2.tint = this.resultBanner.getBannerColor();
    this.bannerSprite2.width =
      this.bannerText.width + RESULT_BANNER_PADDING_X * 2;
    this.bannerSprite2.height = this.resultBanner.getBannerHeight();
    const position = this.resultBanner.getPosition();
    this.position.set(position.x, position.y);

    if (this.resultBanner.hasMedal()) {
      this.medalSprite.visible = true;
      this.medalSprite.scale.set(0.5, 0.5);
      this.medalSprite.position.set(
        -this.bannerContainer.width - 50,
        this.resultBanner.getMedalY().y,
      );
      this.medalSprite.tint = this.resultBanner.getMedalColor();
    } else {
      this.medalSprite.visible = false;
    }
  }

  update() {
    if (this.resultBanner.getBannerText() !== this.bannerText.text) {
      this.init();
    }
    this.alpha = this.resultBanner.alpha;
    this.medalSprite.rotation = this.resultBanner.getMedalRotation();
  }

  destroy() {
    this.bannerSprite1.destroy();
    this.bannerText.destroy();
    this.bannerMask.destroy();
  }
}
