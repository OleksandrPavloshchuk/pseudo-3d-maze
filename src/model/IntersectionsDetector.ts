import {Player} from "./Player"
import {Maze} from "./Maze"
import {Intersection, Point} from "./Point"

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

            let min: Intersection | undefined = undefined

            for (let cell of this.maze.field) {
                cell.getEdgesIntersection(this.player.position, dx, dy).forEach(i => {
                    i.enrich(a, dx, dy, cell, this.distance(i.point))
                    if (cell.isWall()) {
                        if (!min || min.distance! > i.distance!) {
                            min = i
                        }
                    }
                })
            }
            if (min) {
                result.push(min)
            }
        }

        return result
    }

    private distance = (p: Point) =>
        Math.sqrt(pow2(p.x - this.player.position.x) + pow2(p.y - this.player.position.y))

}

const pow2 = (n: number) => n * n
