import { Assets, Container, Sprite, Texture, TilingSprite } from 'pixi.js';
import { RaceTrack } from './RaceTrack';
import { Weather } from '/imports/schemas/derby/race';

const TRACK_EDGE_HEIGHT = 4;
const TRACK_EDGE_TINT = 0x111122;
const TRACK_TEXTURES: Record<Weather, string> = {
  clear: '/derby/textures/dirt.png',
  windy: '/derby/textures/dirt.png',
  rain: '/derby/textures/mud.png',
  storm: '/derby/textures/mud.png',
};

class RaceTrackPixi extends Container {
  raceTrack: RaceTrack;
  groundSprite: TilingSprite;
  topEdgeSprite: Sprite;
  bottomEdgeSprite: Sprite;

  constructor(raceTrack: RaceTrack) {
    super();
    this.raceTrack = raceTrack;
    this.groundSprite = new TilingSprite();
    this.topEdgeSprite = new Sprite();
    this.bottomEdgeSprite = new Sprite();

    this.init();
    this.update();
  }

  init() {
    Assets.load(TRACK_TEXTURES[this.raceTrack.getWeather()]).then((texture) => {
      this.groundSprite.texture = texture;
    });
    this.addChild(this.groundSprite);

    this.topEdgeSprite.texture = Texture.WHITE;
    this.topEdgeSprite.tint = TRACK_EDGE_TINT;
    this.topEdgeSprite.anchor.y = 0.5;
    this.addChild(this.topEdgeSprite);

    this.bottomEdgeSprite.texture = Texture.WHITE;
    this.bottomEdgeSprite.tint = TRACK_EDGE_TINT;
    this.bottomEdgeSprite.anchor.y = 0.5;
    this.addChild(this.bottomEdgeSprite);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.groundSprite.width = width;
    this.groundSprite.height = height;

    this.topEdgeSprite.width = width;
    this.topEdgeSprite.height = TRACK_EDGE_HEIGHT;

    this.bottomEdgeSprite.width = width;
    this.bottomEdgeSprite.height = TRACK_EDGE_HEIGHT;
    this.bottomEdgeSprite.y = height;
  }

  update() {
    const dimensions = this.raceTrack.getDimensions();
    this.setSize(dimensions.width, dimensions.height);
    this.position = this.raceTrack.getPosition();
  }
}

export default RaceTrackPixi;
