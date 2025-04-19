import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { RaceTrack } from './RaceTrack';
import gsap from 'gsap';
import { RaceHorse } from '../RaceHorse/RaceHorse';
import ordinal from 'ordinal';
import { RaceController } from '../RaceController';

const BANNER_TEXT_STYLE = new TextStyle({
  fontFamily: 'house-of-cards, serif',
  fontSize: 24,
  fill: 0xffffff,
});

export class RaceTrackResultBanner {
  private controller: RaceController;
  private raceTrack: RaceTrack;
  private horse: RaceHorse;
  private _gsapTimeline: gsap.core.Timeline;

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
  }

  getColor(): string {
    return this.horse.color;
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.raceTrack.getFinishLinePosition().x,
      y: this.raceTrack.getBottomY(),
    };
  }

  getTrackHeight(): number {
    return this.raceTrack.getDimensions().height;
  }

  getBannerText(): string {
    if (!this.horse || !this.horse.result) {
      return '';
    }

    return `${ordinal(this.horse.result.placement)}: ${this.horse.name} (${
      this.horse.result.time
    })`;
  }

  update(time: number) {
    // this._gsapTimeline?.seek(time);
    // this.y = this.track.getBottomY() - BOTTOM_PADDING;
  }
}
