import Shape from './Shape';
import type { ShapeConfig } from './Shape';

interface CrossConfig extends ShapeConfig {
  size: number;
}

export default class Circle extends Shape<CrossConfig> {
  constructor(config: CrossConfig) {
    super();
    this.config = config;
  }
  public get __tag() {
    return 'Cross';
  }
  public draw() {
    const { center, size, fillColor = 'white', ctx } = this.config;
    const { x, y } = center;
    ctx.beginPath();
    ctx.strokeStyle = fillColor;
    ctx.moveTo(x-(size/2),y);
    ctx.lineTo(x+(size/2),y);
    ctx.moveTo(x,y-(size/2));
    ctx.lineTo(x,y+(size/2));
    ctx.closePath();
    ctx.stroke();
  }
}
