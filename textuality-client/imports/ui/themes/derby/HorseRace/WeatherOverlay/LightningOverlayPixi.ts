import { gsap } from 'gsap';
import { GlowFilter } from 'pixi-filters';
import { BlurFilter, Container, Graphics, Sprite, Texture } from 'pixi.js';

// --- Configuration Constants ---
const NUM_BOLTS_PER_INTENSITY = 5;
const BOLT_SEGMENTS = 12;
const BOLT_JITTER_X = 150;
const BOLT_LINE_WIDTH = 4;

const MAX_GLOW_ALPHA = 0.1;
const GLOW_IN_DURATION = 0.1;
const GLOW_FADE_DURATION = 0.3;

const MAX_BLUR = 5;
const BLUR_IN_DURATION = 0.05;

const BOLT_FLASH_IN_DURATION = 0.01;
const BOLT_FLASH_OUT_DURATION = 0.5;
const BOLT_FLASH_STAGGER = 0.03;

export class LightningOverlayPixi extends Container {
  private glow: Sprite;
  private blurFilter: BlurFilter;
  private lightningContainer: Container;
  private _dimensions: { width: number; height: number } = {
    width: 0,
    height: 0,
  };

  constructor() {
    super();

    this.glow = new Sprite(Texture.WHITE);
    this.blurFilter = new BlurFilter();
    this.glow.alpha = 0;
    this.addChild(this.glow);
    this.lightningContainer = new Container();
    this.addChild(this.lightningContainer);
    this.lightningContainer.filters = [
      new GlowFilter({
        color: 0xffffff,
        alpha: 0.5,
        outerStrength: 10,
        distance: 10,
      }),
    ];
  }

  /** Call this if your canvas/app resizes. */
  public updateSize(width: number, height: number) {
    this._dimensions = { width, height };
    this.glow.width = width;
    this.glow.height = height;
  }

  /**
   * Triggers a quick lightning flash.
   * @param intensity  How bright/many bolts (1 = normal, up to ~2)
   */
  public triggerFlash(intensity: number = 1) {
    console.log('triggerFlash', intensity);
    const bolts: Graphics[] = [];
    const count = Math.max(1, Math.floor(NUM_BOLTS_PER_INTENSITY * intensity));

    // spawn bolts
    for (let i = 0; i < count; i++) {
      const bolt = this.makeBolt();
      bolt.alpha = 0;
      this.lightningContainer.addChild(bolt);
      bolts.push(bolt);
    }

    // build GSAP timeline
    const tl = gsap.timeline();

    // Glow in
    tl.to(
      this.glow,
      {
        alpha: MAX_GLOW_ALPHA * intensity,
        duration: GLOW_IN_DURATION,
        ease: 'power2.out',
      },
      0,
    );
    tl.to(
      this.blurFilter,
      {
        blur: MAX_BLUR * intensity,
        duration: BLUR_IN_DURATION,
      },
      0,
    );

    // Glow fade
    tl.to(
      this.glow,
      {
        alpha: 0,
        duration: GLOW_FADE_DURATION,
        ease: 'power2.in',
      },
      GLOW_IN_DURATION,
    );
    tl.to(
      this.blurFilter,
      {
        blur: 0,
        duration: GLOW_FADE_DURATION,
      },
      GLOW_IN_DURATION,
    );

    // Bolt flashes
    bolts.forEach((bolt, idx) => {
      const delay = idx * BOLT_FLASH_STAGGER;
      tl.to(bolt, { alpha: 1, duration: BOLT_FLASH_IN_DURATION }, delay);
      tl.to(
        bolt,
        { alpha: 0, duration: BOLT_FLASH_OUT_DURATION },
        delay + BOLT_FLASH_IN_DURATION,
      );
    });

    tl.play();

    // Cleanup
    tl.call(() => {
      console.log('cleanup', bolts);
      bolts.forEach((b) => b.destroy());
      this.glow.alpha = 0;
    });
  }

  /** Optional per-frame hook if you need it */
  public update(delta: number) {
    // no-op; GSAP handles everything
  }

  /** Builds one jagged bolt from top to bottom */
  private makeBolt(): Graphics {
    const g = new Graphics();

    let x = Math.random() * this._dimensions.width;
    let y = 0;
    g.moveTo(x, y);

    for (let i = 1; i <= BOLT_SEGMENTS; i++) {
      y = (this._dimensions.height / BOLT_SEGMENTS) * i;
      x += (Math.random() - 0.5) * BOLT_JITTER_X;
      g.lineTo(x, y);
    }

    g.stroke({ color: 0xffffff, width: BOLT_LINE_WIDTH });

    return g;
  }
}
