import {Point} from "./Point";

export type MazeCellType = "empty" | "wall"

export class MazeCell {
    readonly index: Point
    readonly center: Point
    readonly type: MazeCellType
    readonly cellSize: number

    constructor(index: Point, center: Point, cellSize: number, type: MazeCellType) {
        this.center = center
        this.type = type
        this.index = index
        this.cellSize = cellSize
    }

    isCollided = (pos: Point, gap: number) => {
        const cellSize = this.cellSize
        return (pos.x >= this.center.x - cellSize / 2 - gap
            && pos.x <= this.center.x + cellSize / 2 + gap
            && pos.y >= this.center.y - cellSize / 2 - gap
            && pos.y <= this.center.y + cellSize / 2 + gap
        )
    }

    getEdgesIntersection = (src: Point, dx: number, dy: number): Point[] => {
        if (dx === 0) {
            return this.calculateVerticalEdgesIntersection(src)
        } else if (dy === 0) {
            return this.calculateHorizontalEdgesIntersection(src)
        }
        const all: Point[] = []

        all.push(this.intersectVertical(src, dx, dy, this.x0()))
        all.push(this.intersectVertical(src, dx, dy, this.x1()))
        all.push(this.intersectHorizontal(src, dx, dy, this.y0()))
        all.push(this.intersectHorizontal(src, dx, dy, this.y1()))

        return all.filter(p => this.isOnEdge(p) && this.isOnRay(src, p, dx, dy))
    }

    private calculateVerticalEdgesIntersection = (src: Point): Point[] => {
        return [{x: this.x0(), y: src.y}, {x: this.x1(), y: src.y}]
    }

    private calculateHorizontalEdgesIntersection = (src: Point): Point[] => {
        return [{x: src.x, y: this.y0()}, {x: src.x, y: this.y1()}]
    }

    private intersectVertical = (p: Point, dx: number, dy: number, x: number): Point => {
        return {x, y: p.y + (x - p.x) * dy / dx}
    }

    private intersectHorizontal = (p: Point, dx: number, dy: number, y: number): Point => {
        return {x: p.x + (y - p.y) * dx / dy, y}
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

