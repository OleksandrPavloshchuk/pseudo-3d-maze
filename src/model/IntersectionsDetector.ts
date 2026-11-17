import {Player} from "./Player"
import {Maze} from "./Maze"
import {Intersection, Point} from "./Point"

export class RayIntersections {
    public floors: Intersection[] = []

    constructor(
        public readonly wall: Intersection,
    ) {
    }
}

export class IntersectionsDetector {

    constructor(
        private readonly player: Player,
        private readonly maze: Maze
    ) {
    }

    calculate = () => {

        const result: RayIntersections[] = []

        for (let a = -this.player.viewAngleHalfWidth; a <= this.player.viewAngleHalfWidth; a += this.player.viewAngleStep) {
            const dx = Math.cos(a + this.player.viewAngleMiddle)
            const dy = Math.sin(a + this.player.viewAngleMiddle)

            let min: Intersection | undefined = undefined

            const floors: Intersection[] = []
            for (let cell of this.maze.field) {
                cell.getEdgesIntersection(this.player.position, dx, dy).forEach(i => {
                    if (cell.isWall()) {
                        i.enrich(a, cell, this.distance(i.point))
                        if (!min || min.distance! > i.distance!) {
                            min = i
                        }
                    } else {
                        // TODO fill floors
                    }
                })
            }
            if (min) {
                const item: RayIntersections = new RayIntersections(min)
                item.floors = floors
                result.push(item)
            }
        }

        return result
    }

    private distance = (p: Point) =>
        Math.sqrt(pow2(p.x - this.player.position.x) + pow2(p.y - this.player.position.y))

}

const pow2 = (n: number) => n * n
