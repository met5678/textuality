import { Container, Graphics, Text, TextStyle, Sprite, Texture } from 'pixi.js';
import { RaceTrack, UNITS_PER_FURLONG } from '../RaceTrack/RaceTrack';

interface FurlongMarker {
  container: Container;
  line: Sprite;
  box: Sprite;
  text: Text;
}

const FURLONG_MARKER_DIMENSION = 100;

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

      this.finishGraphics.rect(
        finishX - this.checkerSize,
        y,
        this.checkerSize,
        this.checkerSize,
      );
      this.finishGraphics.fill(isBlack ? 0x000000 : 0xffffff);
    }
  }

  private createFurlongMarker(
    furlong: number,
    x: number,
    height: number,
  ): FurlongMarker {
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
    const box = new Sprite(Texture.WHITE);
    box.width = FURLONG_MARKER_DIMENSION;
    box.height = FURLONG_MARKER_DIMENSION;
    box.tint = 0x404040;
    box.anchor.set(0.5, 1);
    box.position.x = 0;
    box.position.y = -10;

    // Create the text
    const textStyle = new TextStyle({
      fontFamily: 'house-of-cards, serif',
      fontSize: 60,
      fill: 0xffffff,
      align: 'center',
    });
    const text = new Text(furlong.toString(), textStyle);
    text.anchor.set(0.5);
    text.position.y = -FURLONG_MARKER_DIMENSION / 2 - 10;

    // Add everything to the container
    container.addChild(line, box, text);
    container.position.x = x;

    return { container, line, box, text };
  }

  private drawFurlongMarkers() {
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
      const marker = this.createFurlongMarker(furlong, x, totalHeight);
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
