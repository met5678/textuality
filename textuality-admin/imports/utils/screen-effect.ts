/**
 * ScreenEffect Utility
 * --------------------
 * Based on https://github.com/joshwcomeau/screen-effect
 *
 * Adds layered visual effects to a DOM element for a retro display vibe.
 *
 * Requires screen-effect.css to be included!
 *
 * Supported Effects:
 * - "vcr": Adds animated static noise (CRT tracking effect) - added by default
 * - "snow": Simulates visual "snow" like on old TV screens - added by default
 * - "scanlines": Applies animated horizontal scanlines - added by default
 * - "wobblex": Applies horizontal wobble (CSS only) - set wobble: true to enable
 * - "wobbley": Applies vertical wobble (CSS only) - set wobble: true to enable
 * - "vignette": Adds a darkened border gradient around the element - set vignette: true to enable
 *
 * Example usage:
 *   const screen = new ScreenEffect("#screen", { vcr: false, wobble: true, vignette: true });
 *
 * Call destroy() to remove all effects and restore the original DOM structure
 */

function getRandomInt(min: number, max: number): number {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
    Math.ceil(min)
  );
}

export class ScreenEffect {
  private parent: HTMLElement;
  private config: any;
  private effects: Record<string, any> = {};
  private nodes: any = {};
  private snowFrame: number | null = null;
  private vcrInterval: ReturnType<typeof setInterval> | null = null;

  constructor(parent: string | HTMLElement, options = {}) {
    this.parent =
      typeof parent === 'string' ? document.querySelector(parent)! : parent;
    this.config = { wobble: false, vignette: false, ...options };

    window.addEventListener('resize', this.onResize.bind(this));
    this.render();

    // Add default effects
    this.add(['vcr', 'snow', 'scanlines']);

    if (this.config.wobble) {
      this.add(['wobblex', 'wobbley']);
    }

    if (this.config.vignette) {
      this.add('vignette');
    }
  }

  public destroy(): void {
    Object.keys(this.effects).forEach((effect) => this.remove(effect));

    // Restore original DOM structure
    if (
      this.nodes.wrapper3 &&
      this.parent &&
      this.nodes.container?.parentNode
    ) {
      this.nodes.container.parentNode.insertBefore(
        this.parent,
        this.nodes.container,
      );
      this.nodes.container.remove();
    }

    this.effects = {};
  }

  private render(): void {
    const container = this.createDiv('screen-container');
    // carry over layout classes from original element
    this.parent.classList.forEach((cls: string) => {
      container.classList.add(cls);
    });
    const wrapper1 = this.createDiv('screen-wrapper');
    const wrapper2 = this.createDiv('screen-wrapper');
    const wrapper3 = this.createDiv('screen-wrapper');

    wrapper1.appendChild(wrapper2);
    wrapper2.appendChild(wrapper3);
    container.appendChild(wrapper1);

    this.parent.parentNode!.insertBefore(container, this.parent);
    wrapper3.appendChild(this.parent);

    this.nodes = { container, wrapper1, wrapper2, wrapper3 };
    this.onResize();
  }

  private createDiv(className: string): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
  }

  private onResize(): void {
    this.effects.vcr && this.effects.vcr.enabled && this.generateVCRNoise();
  }

  public add(type: string | string[], options: any = {}): this {
    const config = { fps: 20, blur: 1, ...options };

    if (Array.isArray(type)) {
      type.forEach((t) => this.add(t));
      return this;
    }

    const wrapper = this.nodes.wrapper2;

    if (type === 'snow') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.classList.add(type);
      canvas.width = this.parent.clientWidth / 2;
      canvas.height = this.parent.clientHeight / 2;
      wrapper.appendChild(canvas);

      const animate = () => {
        this.generateSnow(ctx);
        this.snowFrame = requestAnimationFrame(animate);
      };
      animate();

      this.effects[type] = { wrapper, node: canvas, enabled: true, config };
      return this;
    }

    if (type === 'vcr') {
      const canvas = document.createElement('canvas');
      canvas.classList.add(type);
      canvas.width = this.parent.clientWidth;
      canvas.height = this.parent.clientHeight;
      wrapper.appendChild(canvas);

      this.effects[type] = {
        wrapper,
        node: canvas,
        ctx: canvas.getContext('2d'),
        enabled: true,
        config,
      };

      this.generateVCRNoise();
      return this;
    }

    let node: HTMLElement | false = false;

    switch (type) {
      case 'wobblex':
      case 'wobbley':
        wrapper.classList.add(type);
        break;
      case 'scanlines':
      case 'vignette':
        node = this.createDiv(type);
        const parentWrapper =
          type === 'vignette' ? this.nodes.container : wrapper;
        parentWrapper.appendChild(node);
        break;
    }

    this.effects[type] = { wrapper, node, enabled: true, config };
    return this;
  }

  public remove(type: string): this {
    const effect = this.effects[type];
    if (!effect || !effect.enabled) return this;

    effect.enabled = false;
    if (type === 'vcr' && this.vcrInterval) {
      if (typeof this.vcrInterval === 'number') {
        clearInterval(this.vcrInterval);
      } else {
        clearInterval(this.vcrInterval as NodeJS.Timeout);
      }
    }
    if (type === 'snow') cancelAnimationFrame(this.snowFrame!);

    try {
      if (
        effect.node &&
        effect.wrapper &&
        effect.wrapper.contains(effect.node)
      ) {
        effect.wrapper.removeChild(effect.node);
      } else if (effect.wrapper) {
        effect.wrapper.classList.remove(type);
      }
    } catch (error) {
      console.warn(`Failed to remove effect ${type}:`, error);
    }

    return this;
  }

  private generateSnow(ctx: CanvasRenderingContext2D): void {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const d = ctx.createImageData(w, h);
    const b = new Uint32Array(d.data.buffer);

    for (let i = 0; i < b.length; i++) b[i] = ((255 * Math.random()) | 0) << 24;

    ctx.putImageData(d, 0, 0);
  }

  private generateVCRNoise(): void {
    const config = this.effects.vcr.config;
    if (config.fps >= 60) {
      if (this.vcrInterval) {
        clearInterval(this.vcrInterval);
      }
      const animate = () => {
        this.renderTrackingNoise();
        this.vcrInterval = requestAnimationFrame(
          animate,
        ) as unknown as ReturnType<typeof setInterval>;
      };
      animate();
    } else {
      if (this.vcrInterval) {
        clearInterval(this.vcrInterval);
      }
      this.vcrInterval = setInterval(
        () => this.renderTrackingNoise(),
        1000 / config.fps,
      );
    }
  }

  private renderTrackingNoise(radius = 2, xmax?: number, ymax?: number): void {
    const { node: canvas, ctx, config } = this.effects.vcr;
    const num = config.num || 20;
    const posy1 = config.miny || 0;
    const posy2 = config.maxy || canvas.height;
    let posy3 = config.miny2 || 0;

    canvas.style.filter = `blur(${config.blur}px)`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.beginPath();

    for (let i = 0; i <= num; i++) {
      const x = Math.random() * (xmax || canvas.width);
      const y1 = getRandomInt(posy1 + 3, posy2);
      const y2 = getRandomInt(0, (posy3 -= 3));

      ctx.fillRect(x, y1, radius, radius);
      ctx.fillRect(x, y2, radius, radius);
      ctx.fill();

      this.renderTail(ctx, x, y1, radius);
      this.renderTail(ctx, x, y2, radius);
    }
    ctx.closePath();
  }

  private renderTail(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
  ): void {
    const n = getRandomInt(1, 50);
    const dir = Math.random() > 0.5 ? 1 : -1;
    let rd = radius;

    for (let i = 0; i < n; i++) {
      const step = 0.01;
      let r = getRandomInt((rd -= step), radius);
      let dx = getRandomInt(1, 4) * dir;
      radius -= 0.1;
      ctx.fillRect((x += dx), y, r, r);
      ctx.fill();
    }
  }
}
