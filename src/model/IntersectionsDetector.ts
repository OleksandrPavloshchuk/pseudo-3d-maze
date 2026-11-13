import {Player} from "./Player"
import {Maze} from "./Maze"
import {Point} from "./Point"
import {MazeCell} from "./MazeCell"

export interface Intersection {
    a: number
    point: Point
    cell: MazeCell,
    distance: number
}

export class IntersectionsDetector {

    constructor(
        private readonly player: Player,
        private readonly maze: Maze
    ) {
    }

    calculate = () => {

        const result: Intersection[] = []

        for (let a = -this.player.viewAngleHalfWidth; a <= this.player.viewAngleHalfWidth; a += this.player.viewAngleStep) {
            const dx = Math.cos(a + this.player.viewAngleMiddle)
            const dy = Math.sin(a + this.player.viewAngleMiddle)

            let min: Intersection|undefined = undefined

            for (let cell of this.maze.field) {
                if (cell.type != "empty") {
                    const intersections = cell.getEdgesIntersection(this.player.position, dx, dy)
                    intersections.forEach(point => {
                        const i = {a, cell, point, distance: this.distance(point)}
                        if (!min || min.distance > i.distance) {
                            min = i
                        }
                    })
                }
            }
            if (min) {
                result.push(min)
            }
        }

        return result
    }

    private pow2 = (n: number) => n * n

    private distance = (p: Point) =>
        Math.sqrt(this.pow2(p.x - this.player.position.x) + this.pow2(p.y - this.player.position.y))

}