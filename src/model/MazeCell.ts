import {Intersection, Point} from "./Point"
import {TEXTURE_SIZE} from "../textures/textureStorage";

export type MazeCellType = "empty" | "wall" | "window" | "picture" | "exitDoor"

export class MazeCell {

    constructor(
        public readonly index: Point,
        public readonly center: Point,
        public readonly type: MazeCellType
    ) {
    }

    isWall = () => this.type != "empty"

    isCollided = (pos: Point, gap: number) => {
        return (pos.x >= this.center.x - TEXTURE_SIZE / 2 - gap
            && pos.x <= this.center.x + TEXTURE_SIZE / 2 + gap
            && pos.y >= this.center.y - TEXTURE_SIZE / 2 - gap
            && pos.y <= this.center.y + TEXTURE_SIZE / 2 + gap
        )
    }

    getEdgesIntersection = (
        src: Point,
        dx: number,
        dy: number
    ): Intersection[] => {
        let all: Intersection[]
        if (dx === 0) {
            all = this.calculateVerticalEdgesIntersection(src)
        } else if (dy === 0) {
            all = this.calculateHorizontalEdgesIntersection(src)
        } else {
            all = []
            all.push(this.intersectVertical(src, dx, dy, this.x0()))
            all.push(this.intersectVertical(src, dx, dy, this.x1()))
            all.push(this.intersectHorizontal(src, dx, dy, this.y0()))
            all.push(this.intersectHorizontal(src, dx, dy, this.y1()))
        }

        return all.filter(i => this.isOnEdge(i.point) && isOnRay(src, i.point, dx, dy))
    }

    private calculateVerticalEdgesIntersection = (src: Point): Intersection[] => {
        return [
            new Intersection({x: this.x0(), y: src.y}, "vertical"),
            new Intersection({x: this.x1(), y: src.y}, "vertical")
        ]
    }

    private calculateHorizontalEdgesIntersection = (src: Point): Intersection[] => {
        return [
            new Intersection({x: src.x, y: this.y0()}, "horizontal"),
            new Intersection({x: src.x, y: this.y1()}, "horizontal")
        ]
    }

    private intersectVertical = (p: Point, dx: number, dy: number, x: number): Intersection => {
        return new Intersection({x, y: p.y + (x - p.x) * dy / dx}, "vertical")
    }

    private intersectHorizontal = (p: Point, dx: number, dy: number, y: number): Intersection => {
        return new Intersection({x: p.x + (y - p.y) * dx / dy, y}, "horizontal")
    }

    private isOnEdge = (p: Point) => {
        const x0 = this.x0()
        const x1 = this.x1()
        const y0 = this.y0()
        const y1 = this.y1()
        if (p.y == y0 || p.y == y1) {
            return p.x >= x0 && p.x <= x1
        }
        if (p.x == x0 || p.x == x1) {
            return p.y >= y0 && p.y <= y1
        }
        return false
    }

    private x0 = () => this.center.x - TEXTURE_SIZE / 2
    private x1 = () => this.center.x + TEXTURE_SIZE / 2
    private y0 = () => this.center.y - TEXTURE_SIZE / 2
    private y1 = () => this.center.y + TEXTURE_SIZE / 2

}

const isOnRay = (src: Point, p: Point, dx: number, dy: number) => {
    return (p.x - src.x) * dx + (p.y - src.y) * dy >= 0
}


