import CanvasMarkBoard from '@renderer/lib/canvas-mark-board/index.ts'
const { ClickMarkObject } = CanvasMarkBoard

interface IPointData {
  x: number
  y: number
}

const getDistance = (point: IPointData, point2: IPointData): number => {
  const s = Math.sqrt(Math.pow(point.x - point2.x, 2) + Math.pow(point.y - point2.y, 2))
  return s
}

class Circle {
  config: any
  constructor(config: any) {
    this.config = config
  }
  public get __tag() {
    return 'Circle'
  }
  public draw() {
    const { center, radius, fillColor = 'black', ctx } = this.config
    const { x, y } = center
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
}
/** 自定义点 */
class MarkDotObject extends ClickMarkObject {
  constructor(box: any) {
    super(box)
    this.type = 'dot' as any
    this.minPointCount = 1
    this.maxPointCount = 1
  }
  /** 判断点是否在多边形内部 */
  isPointInside(point: IPointData): boolean {
    let expand = this.expent / this.box.initLayout.zoom
    // 勾股定理
    if (!this.pointList.length || this.status === 'draw') return false
    let distanceFromCenter = Math.sqrt(
      Math.pow(this.pointList[0].x - point.x, 2) + Math.pow(this.pointList[0].y - point.y, 2)
    )
    let distance = 4
    return distanceFromCenter <= distance + expand && distance !== 0
  }
  /** 渲染 */
  render() {
    this.removeAll()
    let {
      config,
      regionCtx: ctx,
      t: { a: zoom }
    } = this.box
    if (!this.box.selectObject) {
      this.box.clearCanvas(ctx)
    }
    if (this.status === 'edit') {
      this.box.clearCanvas(ctx)
      ctx.fillStyle = this.status === 'edit' ? config.fillColor : 'rgba(0,0,0,0)'
      ctx.fill(new Path2D(this.pathData))
      this.pointList.map((item, index) => {
        let circle = null
        if (this.acctivePointIndex === index) {
          circle = new Circle({
            ctx,
            center: item,
            radius: 8 / zoom,
            fillColor: this.color!
          })
        } else {
          circle = new Circle({
            ctx,
            center: item,
            radius: 6 / zoom,
            fillColor: this.color!
          })
        }
        circle.draw()
      })
    }
  }
  get pathData(): string {
    let path = ``
    if (this.pointList.length) {
      let point1 = {
        x: this.pointList[0].x - 4,
        y: this.pointList[0].y
      }
      let point2 = {
        x: this.pointList[0].x + 4,
        y: this.pointList[0].y
      }

      let distance = getDistance(this.pointList[0], point1)
      path += `
          M ${point1.x} ${point1.y}
          A ${distance} ${distance} 0 0 1 ${point2.x} ${point2.y}
          A ${distance} ${distance} 0 0 1 ${point1.x} ${point1.y}
        `
      path += `Z `
    }
    return path
  }
}

export { MarkDotObject }
