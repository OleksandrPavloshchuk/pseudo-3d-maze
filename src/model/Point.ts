import {MazeCell} from "./MazeCell";
import {TEXTURE_SIZE} from "../textures/textureStorage";

export interface Point {
    x: number
    y: number
}

export class Intersection {
    public a?: number
    public cell?: MazeCell
    public distance?: number

    constructor(
        public readonly point: Point,
        public readonly edge: "vertical" | "horizontal"
    ) {
    }

    getTextureX = () => Math.floor(
        (this.getOffset() - this.getEdgeStart()) / TEXTURE_SIZE * TEXTURE_SIZE
    )

    private getOffset = () => this.edge === "horizontal"
        ? this.point.x
        : this.point.y

    private getEdgeStart = () => this.edge === "horizontal"
        ? this.cell!.center.x - TEXTURE_SIZE / 2
        : this.cell!.center.y - TEXTURE_SIZE / 2

}