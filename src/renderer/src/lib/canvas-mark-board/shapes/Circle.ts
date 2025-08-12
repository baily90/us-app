import Shape from './Shape';
import type { ShapeConfig } from './Shape';
interface CircleConfig extends ShapeConfig {
  radius: number;
}
export default class Circle extends Shape<CircleConfig> {
  constructor(config: CircleConfig) {
    super();
    this.config = config;
  }
  public get __tag() {
    return 'Circle';
  }
  public draw() {
    const { center, radius, fillColor = 'black', ctx } = this.config;
    const { x, y, fictitious } = center;
    ctx.save();
    ctx.beginPath();
    if(fictitious) {
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = fillColor;
      ctx.stroke();
    }else {
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.closePath();
    ctx.restore();
  }
}
