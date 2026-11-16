import {MazeCell} from "./MazeCell"
import {Point} from "./Point"

export class Maze {
    public readonly mazeWidth: number
    public readonly mazeHeight: number

    constructor(
        public readonly field: MazeCell[],
        public readonly gap: number
    ) {
        this.mazeWidth = Math.max(...this.field.map(c => c.index.x)) + 1
        this.mazeHeight = Math.max(...this.field.map(c => c.index.y)) + 1
    }

    isCollided = (pos: Point): boolean => {
        for (const cell of this.field) {
            if (cell.isWall() && cell.isCollided(pos, this.gap)) {
                return true
            }
        }
        return false
    }
}