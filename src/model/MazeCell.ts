import {type Intersection, Point} from "./Point"

export type MazeCellType = "empty" | "wall" | "picture" | "exitDoor"

export class MazeCell {

    constructor(
        public readonly index: Point,
        public readonly center: Point,
        public readonly cellSize: number,
        public readonly type: MazeCellType
    ) {
    }

    isCollided = (pos: Point, gap: number) => {
        const cellSize = this.cellSize
        return (pos.x >= this.center.x - cellSize / 2 - gap
            && pos.x <= this.center.x + cellSize / 2 + gap
            && pos.y >= this.center.y - cellSize / 2 - gap
            && pos.y <= this.center.y + cellSize / 2 + gap
        )
    }

    getEdgesIntersection = (
        src: Point,
        dx: number,
        dy: number
    ): Intersection[] => {
        if (dx === 0) {
            return this.calculateVerticalEdgesIntersection(src)
        } else if (dy === 0) {
            return this.calculateHorizontalEdgesIntersection(src)
        }
        const all: Intersection[] = []

        all.push(this.intersectVertical(src, dx, dy, this.x0()))
        all.push(this.intersectVertical(src, dx, dy, this.x1()))
        all.push(this.intersectHorizontal(src, dx, dy, this.y0()))
        all.push(this.intersectHorizontal(src, dx, dy, this.y1()))

        return all.filter(i => this.isOnEdge(i.point) && this.isOnRay(src, i.point, dx, dy))
    }

    private calculateVerticalEdgesIntersection = (src: Point): Intersection[] => {
        return [
            {point: {x: this.x0(), y: src.y}, edge: "vertical"},
            {point: {x: this.x1(), y: src.y}, edge: "vertical"}
        ]
    }

    private calculateHorizontalEdgesIntersection = (src: Point): Intersection[] => {
        return [
            {point: {x: src.x, y: this.y0()}, edge: "horizontal"},
            {point: {x: src.x, y: this.y1()}, edge: "horizontal"}
        ]
    }

    private intersectVertical = (p: Point, dx: number, dy: number, x: number): Intersection => {
        return {
            point: {
                x,
                y: p.y + (x - p.x) * dy / dx
            },
            edge: "vertical"
        }
    }

    private intersectHorizontal = (p: Point, dx: number, dy: number, y: number): Intersection => {
        return {
            point: {
                x: p.x + (y - p.y) * dx / dy,
                y
            },
            edge: "horizontal"
        }
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

    private x0 = () => this.center.x - this.cellSize / 2
    private x1 = () => this.center.x + this.cellSize / 2
    private y0 = () => this.center.y - this.cellSize / 2
    private y1 = () => this.center.y + this.cellSize / 2

    private isOnRay = (src: Point, p: Point, dx: number, dy: number) => {
        return (p.x - src.x) * dx + (p.y - src.y) * dy >= 0
    }
}

