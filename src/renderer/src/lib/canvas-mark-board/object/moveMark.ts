import CanvasMarkBoard from "..";
import { Circle } from "../shapes";
import { getMinDistance, getUUID, isPointInPolygon } from "../utils";
import MarkObject from "./object";
import type { IPointData, IObjectLabelData, IMarkObjectJSON } from "../types";
/**
 * 移动绘制标注对象 MoveMarkObject
 */
export default class MoveMarkObject extends MarkObject {
  completeOffset: number = 30;
  constructor(box: CanvasMarkBoard) {
    super();
    this.id = getUUID();
    this.minPointCount = 2;
    this.box = box;
    this.index = box.markObjectList.length + 1;
  }

  /** 鼠标按下 */
  boxMousedown(e: IPointData) {
    const point = e;
    if (this.status == "draw") {
      const newPoint = this.forbidOut(point)
      this.pointList = [newPoint, newPoint];
      this.mouseDown = true;
    }
    if (this.box.selectObject) {
      if (this.box.selectObject.id === this.id && this.isPointInside(point)) {
        this.mouseDown = true;
        this.lastMousePoint = this.box.lastPoint!;
      }
    }
  }
  setCursor() {}
  setMoveEdit(_offset?: any) {}
  /** 鼠标移动 */
  boxMousemove() {
    if (this.box.selectObject) {
      if (this.box.selectObject.id != this.id) {
        return;
      }
    }
    if (this.completeing == true) return;
    if (this.status == "draw" && this.pointList[0]) {
      const newPoint = this.forbidOut(this.box.lastPoint!)
      this.pointList[1] = newPoint
      this.render();
    }
    this.setCursor();
    if (
      this.box.selectObject?.id === this.id &&
      this.mouseDown &&
      this.status == "edit"
    ) {
      // 偏移量
      const offset = {
        x: this.box.lastPoint!.x - this.lastMousePoint!.x,
        y: this.box.lastPoint!.y - this.lastMousePoint!.y,
      };
      if (this.acctivePointIndex == -1) {
        // 更新点位
        this.pointList = this.pointList.map((point) => {
          return {
            x: point.x + offset.x,
            y: point.y + offset.y,
          }
        });
      } else {
        this.setMoveEdit(offset);
      }
      // 更新最后鼠标位置
      this.lastMousePoint = this.box.lastPoint!;
      this.render();
    } else if (this.status == "edit") {
      this.acctivePointIndex = getMinDistance(
        this.box.lastPoint!,
        this.vertexList,
        this.expent,
        this.box.t.a
      );
      this.render();
    }
  }
  /** 鼠标松开 */
  boxMouseup() {
    if (
      this.mouseDown &&
      this.status == "edit" &&
      this.acctivePointIndex > -1
    ) {
      this.box.selectObject = this;
    }

    if (this.box.selectObject) {
      if (this.box.selectObject.id != this.id) {
        return;
      } else if (this.box.selectObject.id === this.id) {
        this.status = "edit";
        this.lastMousePoint = this.box.lastPoint!;
        this.acctivePointIndex = getMinDistance(
          this.lastMousePoint,
          this.vertexList,
          this.expent,
          this.box.t.a
        );
        this.render();
        this.box.render();
      }
    } else if (this.status !== "draw") {
      this.status = "done";
    }

    this.mouseDown = false;
    if (this.status == "draw") {
      if (this.pointList.length === 2) {
        this.complete();
      }
    }
  }
  forbidOut({x, y}: {x: number, y: number}) {
    return {
      x: x < 0 ? 0 : x > this.box.img.width ? this.box.img.width : x,
      y: y < 0 ? 0 : y > this.box.img.height ? this.box.img.height : y,
    }
  }
  /** 销毁 */
  destory() {
    this.pointList = [];
    this.removeAll();
  }
  /** 清空子图形 */
  removeAll() {
    for (let i = 0; i < this.group.length; i++) {
      this.group[i] = null;
    }
    this.group = [];
  }
  /** 完成 */
  async complete() {
    if (this.pointList.length < this.minPointCount) return;
    const offset = Math.max(
      Math.abs(this.pointList[0].x - this.pointList[1].x),
      Math.abs(this.pointList[0].y - this.pointList[1].y)
    );
    if (offset < this.completeOffset) {
      this.status = "draw";
      this.pointList = [];
      this.render();
      return;
    }
    // 发送通知获取前端进程的标签数据
    this.completeing = true;
    const labelData = (await new Promise((resolve, reject) => {
      this.box.emit("oncomplete", { ok: resolve, err: reject });
    }).catch(() => {
      this.completeing = false;
      this.pointList = [];
      this.render();
    })) as IObjectLabelData;
    if (!labelData) {
      return;
    }
    // 设置标签
    this.completeing = false;
    this.label = labelData?.label;
    this.color = labelData?.color;

    this.status = "done";
    this.render();
    this.box.render();
    this.box.addObjectData();
  }
  get vertexList(): IPointData[] {
    return this.pointList;
  }
  get resultPoints() {
    return this.pointList;
  }
  /** 获取path  */
  get pathData() {
    let path = ``;
    if (this.pointList.length) {
      this.pointList.forEach((point, index) => {
        // 绘制线段
        if (index === 0) {
          path += `M${point.x},${point.y}`;
        } else {
          path += `L${point.x},${point.y}`;
        }
      });
      path += "Z ";
    }
    return path;
  }
  /** 获取pathIndexPoint */
  get indexPoint() {
    return this.pointList[0];
  }
  /** 渲染 */
  render() {
    this.removeAll();
    const {
      config,
      regionCtx: ctx,
      t: { a: zoom },
    } = this.box;
    if (!this.box.selectObject) {
      this.box.clearCanvas(ctx);
    }
    // 线宽
    ctx.lineWidth = config.lineWidth! / zoom;
    ctx.strokeStyle = this.status === "draw" ? config.drawColor! : this.color!;
    const path = new Path2D(this.pathData);
    this.group.push(path);

    if (this.status === "draw") {
      ctx.stroke(path);
    }
    if (this.status === "edit") {
      this.box.clearCanvas(ctx);
      ctx.stroke(path);
      ctx.fillStyle =
        this.status === "edit" ? config.fillColor : "rgba(0,0,0,0)";
      ctx.fill(path);
      this.vertexList.map((item, index) => {
        // code here...
        // const newPoint = this.forbidOut(item);
        // item.x = newPoint.x
        // item.y = newPoint.y
        let circle = null;
        if (this.acctivePointIndex === index) {
          circle = new Circle({
            ctx,
            center: item,
            radius: 8 / zoom,
            fillColor: this.color!,
          });
        } else {
          circle = new Circle({
            ctx,
            center: item,
            radius: 4 / zoom,
            fillColor: this.color!,
          });
        }
        circle.draw();
        this.group.push(circle);
      });
    }
  }
  /** 判断点是否在多边形内部 */
  isPointInside(point: IPointData): boolean {
    if (!this.pointList.length || this.status === "draw") return false;
    const expand = this.expent / this.box.t.a;
    const offset = isPointInPolygon(point, this.vertexList);
    return offset < expand;
  }

  /** 导入 */
  static import(box: CanvasMarkBoard, data: IMarkObjectJSON) {
    const obj = new this(box);
    obj.label = data.label;
    obj.color = data.color || obj.color;
    obj.pointList = data.pointList;
    obj.status = "done";
    obj.render();
    return obj;
  }
}
