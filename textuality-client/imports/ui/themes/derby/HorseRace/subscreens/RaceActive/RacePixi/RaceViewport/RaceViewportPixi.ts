import { Container, Application } from 'pixi.js';
import { RaceController } from '../RaceController';

export class RaceViewportPixi {
  private container: Container;
  private app: Application;
  private controller: RaceController;

  constructor(app: Application, controller: RaceController) {
    this.app = app;
    this.controller = controller;
    this.container = new Container();
    this.container.label = 'viewport';
    this.initializeContainer();
  }

  private initializeContainer() {
    const viewport = this.controller.getViewport();

    // Use viewport values if available, otherwise use defaults
    const scale = viewport.getScale();
    const offsetX = viewport.getOffsetX();
    const offsetY = viewport.getOffsetY();

    this.container.scale.set(scale);
    this.container.position.set(offsetX, offsetY);
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
