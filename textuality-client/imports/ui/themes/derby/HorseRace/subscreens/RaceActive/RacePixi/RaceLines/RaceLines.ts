import {
  Container,
  Graphics,
  Text,
  TextStyle,
  Sprite,
  Texture,
  Assets,
} from 'pixi.js';
import { RaceTrack, UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';
import { RaceTextures } from '../RaceTextures/RaceTextures';
import { DropShadowFilter, OutlineFilter } from 'pixi-filters';

interface FurlongMarker {
  container: Container;
  line: Sprite;
  box: Sprite;
  text: Text;
}

const FURLONG_MARKER_DIMENSION = 150;
const FURLONG_MARKER_TEXT_COLOR = 0xffffff;
const FURLONG_MARKER_FONT_SIZE = 120;
const FURLONG_MARKER_FONT_FAMILY = 'brioso-pro-display, serif';
const FURLONG_MARKER_FONT_WEIGHT = '700' as const;

export class RaceLines {
  private container: Container;
  private startGraphics: Graphics;
  private finishGraphics: Graphics;
  private furlongMarkers: FurlongMarker[] = [];
  private tracks: RaceTrack[];
  private furlongLength: number;
  private checkerSize: number = 20;

  constructor(tracks: RaceTrack[], furlongLength: number) {
    this.container = new Container();
    this.startGraphics = new Graphics();
    this.finishGraphics = new Graphics();
    this.container.addChild(this.startGraphics, this.finishGraphics);

    this.tracks = tracks;
    this.furlongLength = furlongLength;
    this.draw();
  }

  private getTotalTrackHeight(): number {
    return this.tracks.reduce((height, track) => {
      return height + track.getDimensions().height;
    }, 0);
  }

  private drawStartLine() {
    this.startGraphics.clear();

    const totalHeight = this.getTotalTrackHeight();
    const numCheckers = Math.ceil(totalHeight / this.checkerSize);

    for (let i = 0; i < numCheckers; i++) {
      const y = i * this.checkerSize;
      const isRed = i % 2 === 1;

      this.startGraphics.rect(0, y, this.checkerSize, this.checkerSize);
      this.startGraphics.fill(isRed ? 0x681e22 : 0xc4b090);
    }
  }

  private drawFinishLine() {
    this.finishGraphics.clear();

    const finishX = this.furlongLength * UNITS_PER_FURLONG;
    const totalHeight = this.getTotalTrackHeight();
    const numCheckers = Math.ceil(totalHeight / this.checkerSize);

    for (let i = 0; i < numCheckers; i++) {
      const y = i * this.checkerSize;
      const isBlack = i % 2 === 0;

      this.finishGraphics.rect(finishX, y, this.checkerSize, this.checkerSize);
      this.finishGraphics.fill(isBlack ? 0x000000 : 0xffffff);
    }
  }

  private async createFurlongMarker(
    furlong: number,
    x: number,
    height: number,
  ) {
    const container = new Container();

    // Create the line using a white sprite
    const line = new Sprite(Texture.WHITE);
    line.width = 8;
    line.height = height;
    line.tint = 0x000066;
    line.alpha = 0.5;
    line.position.x = 0;
    line.position.y = 0;

    // Create the box
    const box = new Sprite(await Assets.load(RaceTextures.wood));
    box.width = FURLONG_MARKER_DIMENSION;
    box.height = FURLONG_MARKER_DIMENSION;
    box.anchor.set(0.5, 1);
    box.position.x = 0;
    box.position.y = -10;
    // box.filters = new OutlineFilter({
    //   color: 0x999999,
    //   thickness: 2,
    // });

    // Create the text
    const text = new Text({
      text: furlong.toString(),
      style: {
        fontFamily: FURLONG_MARKER_FONT_FAMILY,
        fontSize: FURLONG_MARKER_FONT_SIZE,
        fill: FURLONG_MARKER_TEXT_COLOR,
        fontWeight: FURLONG_MARKER_FONT_WEIGHT,
        align: 'center',
      },
    });
    text.anchor.set(0.5);
    text.position.y = -FURLONG_MARKER_DIMENSION / 2 - 10;

    // Add everything to the container
    container.addChild(line, box, text);
    container.position.x = x;

    return { container, line, box, text };
  }

  private async drawFurlongMarkers() {
    // Clean up existing markers
    this.furlongMarkers.forEach((marker) => {
      marker.container.parent?.removeChild(marker.container);
      marker.container.destroy({ children: true });
    });
    this.furlongMarkers = [];

    const totalHeight = this.getTotalTrackHeight();

    // Create a marker for each furlong (except start and finish)
    for (let furlong = 1; furlong < this.furlongLength; furlong++) {
      const x = furlong * UNITS_PER_FURLONG;
      const marker = await this.createFurlongMarker(furlong, x, totalHeight);
      this.furlongMarkers.push(marker);
      this.container.addChild(marker.container);
    }
  }

  private draw() {
    this.drawStartLine();
    this.drawFinishLine();
    this.drawFurlongMarkers();
  }

  public getContainer(): Container {
    return this.container;
  }

  public destroy() {
    this.furlongMarkers.forEach((marker) => {
      marker.container.destroy({ children: true });
    });
    this.startGraphics.destroy();
    this.finishGraphics.destroy();
    this.container.destroy();
  }
}
