import { Container, Application } from 'pixi.js';
import { RaceController } from '../RaceController';

export class RaceViewportPixi {
  private container: Container;
  private app: Application;
  private controller: RaceController;
  private defaultScale: number = 0.6;
  private defaultOffset: number = 100;

  constructor(app: Application, controller: RaceController) {
    this.app = app;
    this.controller = controller;
    this.container = new Container();
    this.container.label = 'viewport';
    this.initializeContainer();
  }

  private initializeContainer() {
    const viewport = this.controller?.getViewport();

    // Use viewport values if available, otherwise use defaults
    const scale = viewport?.getScale() ?? this.defaultScale;
    const offset = viewport?.getOffsetX() ?? this.defaultOffset;
    const viewportX = viewport?.getViewportX() ?? offset;

    this.container.scale.set(scale);
    this.container.position.set(offset, offset);
    this.container.x = viewportX;
  }

  public addChild(child: Container) {
    this.container.addChild(child);
  }

  public getContainer(): Container {
    return this.container;
  }

  public update() {
    const viewport = this.controller?.getViewport();
    if (!viewport) return;

    // Apply viewport position and scale
    this.container.scale.set(viewport.getScale());
    this.container.position.set(viewport.getOffsetX(), viewport.getOffsetY());
  }

  public destroy() {
    this.container.destroy();
  }
}
