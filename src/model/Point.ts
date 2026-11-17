import {MazeCell} from "./MazeCell";
import {TEXTURE_SIZE} from "../textures/textureStorage";

export interface Point {
    x: number
    y: number
}

export class Intersection {
    public a?: number
    public dx?: number
    public dy?: number
    public cell?: MazeCell
    public distance?: number

    constructor(
        public readonly point: Point,
        public readonly edge: "vertical" | "horizontal"
    ) {
    }

    enrich = (
        a: number,
        dx: number,
        dy: number,
        cell: MazeCell,
        distance: number
    )=> {
        this.a = a
        this.dx = dx
        this.dy = dy
        this.cell = cell
        this.distance = distance
    }

    getTextureX = () => Math.floor(
        this.getOffset() - this.getEdgeStart()
    )

    private getOffset = () => this.edge === "horizontal"
        ? this.point.x
        : this.point.y

    private getEdgeStart = () => this.edge === "horizontal"
        ? this.cell!.center.x - TEXTURE_SIZE / 2
        : this.cell!.center.y - TEXTURE_SIZE / 2

}