import { Assets, Spritesheet, Texture } from 'pixi.js';
import { HorseStatus } from '/imports/schemas/derby/race-timeline/types';

export const HORSE_SPRITES: Record<HorseStatus, Texture[]> = {
  running: [],
  trotting: [],
  still: [],
};

export async function loadHorseSprites() {
  const sheet: Spritesheet = await Assets.load(
    '/derby/sprites/horse/spritesheet-run.json',
  );
  await sheet.parse();

  HORSE_SPRITES.running = Object.values(sheet.textures);
}
