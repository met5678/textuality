import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { RaceTrack } from './RaceTrack';
import gsap from 'gsap';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import ordinal from 'ordinal';
import { RaceController } from '../RaceController';

export const RESULT_BANNER_FONT_FAMILY = 'house-of-cards, serif';
export const RESULT_BANNER_FILL = '#FFFFFF';

export const RESULT_BANNER_MARGIN_X = 40;
export const RESULT_BANNER_PADDING_X = 40;
export const RESULT_BANNER_MARGIN_Y = 10;
export const RESULT_BANNER_PADDING_Y = 5;

export class RaceTrackResultBanner {
  private controller: RaceController;
  private raceTrack: RaceTrack;
  private horse: RaceHorse;
  private _gsapTimeline: gsap.core.Timeline;

  alpha: number = 0;
  isVisible: boolean = false;

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

  getColor(): string {
    return this.horse.color;
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.raceTrack.getFinishLinePosition().x - RESULT_BANNER_MARGIN_X,
      y: this.raceTrack.getPosition().y + RESULT_BANNER_MARGIN_Y,
    };
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

    return `${ordinal(this.horse.result.placement)}: ${this.horse.name} (${
      this.horse.result.time
    }s)`;
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
