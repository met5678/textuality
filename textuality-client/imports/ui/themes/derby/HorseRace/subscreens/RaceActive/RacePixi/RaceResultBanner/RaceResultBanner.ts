import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { RaceTrack } from '../RaceTrack/RaceTrack';
import gsap from 'gsap';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import ordinal from 'ordinal';
import { RaceController } from '../RaceController';
import fontColorContrast from 'font-color-contrast';

export const RESULT_BANNER_FONT_FAMILY = 'eurostile, sans-serif';
export const RESULT_BANNER_FONT_WEIGHT = '700' as const;
export const RESULT_BANNER_FILL = '#FFFFFF';

export const RESULT_BANNER_MARGIN_X = 40;
export const RESULT_BANNER_PADDING_X = 20;
export const RESULT_BANNER_MARGIN_Y = 10;
export const RESULT_BANNER_PADDING_Y = 10;

export const MEDAL_COLORS = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export class RaceTrackBanner {
  private controller: RaceController;
  private raceTrack: RaceTrack;
  private horse: RaceHorse;
  private _gsapTimeline: gsap.core.Timeline;

  alpha: number = 0;
  isVisible: boolean = false;
  private _gsapMedalTween: any;
  private _medalRotation: number = 0;

  public get ready(): boolean {
    return !!(this.horse && this.horse.result && this.raceTrack);
  }

  constructor(
    controller: RaceController,
    raceTrack: RaceTrack,
    horse: RaceHorse,
  ) {
    this.controller = controller;
    this.raceTrack = raceTrack;
    this.horse = horse;
    this.update(0);
    this._gsapTimeline = gsap.timeline({
      paused: true,
    });
    this.isVisible = false;

    console.log('RaceTrackResultBanner', this.horse.name);
  }

  getBannerColor(): string {
    return this.horse.color;
  }

  getBannerTextColor(): string {
    return fontColorContrast(this.getBannerColor(), 0.6);
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.raceTrack.getFinishLinePosition().x - RESULT_BANNER_MARGIN_X,
      y: this.raceTrack.getPosition().y + RESULT_BANNER_MARGIN_Y,
    };
  }

  hasMedal(): boolean {
    return !!(this.horse.result?.placement && this.horse.result.placement <= 3);
  }

  getMedalColor(): string {
    if (!this.horse.result) {
      return MEDAL_COLORS[1];
    }
    if (this.horse.result.placement >= 1 && this.horse.result.placement <= 3) {
      return MEDAL_COLORS[
        this.horse.result.placement as keyof typeof MEDAL_COLORS
      ];
    }
    return MEDAL_COLORS[1];
  }

  getMedalY() {
    return {
      y: this.raceTrack.getDimensions().height / 2,
    };
  }

  getMedalRotation() {
    if (!this._gsapMedalTween) {
      this._medalRotation = 0;
      this._gsapMedalTween = gsap.to(this, {
        _medalRotation: 0.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });
      return 0;
    }
    return this._medalRotation;
  }

  getTrackHeight(): number {
    return this.raceTrack.getDimensions().height;
  }

  getBannerHeight(): number {
    return this.getTrackHeight() - RESULT_BANNER_MARGIN_Y * 2;
  }

  getFontHeight(): number {
    return this.getBannerHeight() - RESULT_BANNER_PADDING_Y * 2;
  }

  getBannerText(): string {
    if (!this.horse || !this.horse.result) {
      return '';
    }

    return `${ordinal(this.horse.result.placement)}: ${this.horse.name} -- ${
      this.horse.result.time
    }s`;
  }

  initGsapTimeline() {
    this._gsapTimeline = gsap.timeline({
      paused: true,
    });

    this._gsapTimeline.to(this, {
      x: this.raceTrack.getFinishLinePosition().x - RESULT_BANNER_MARGIN_X,
      duration: 1,
      ease: 'none',
    });
  }

  update(time: number) {
    // if (!this._gsapTimeline && this.horse.result) {
    //   this.initGsapTimeline();
    // }

    if (
      this.horse.result?.time &&
      time >= this.horse.result.time &&
      !this.isVisible
    ) {
      this.isVisible = true;
      gsap.to(this, { alpha: 2, duration: 1 });
    } else if (this.isVisible) {
      this.isVisible = false;
      gsap.to(this, { alpha: 0, duration: 1 });
    }
  }
}
