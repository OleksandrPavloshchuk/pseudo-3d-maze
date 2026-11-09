import {MazeCell} from "./MazeCell";
import {Point} from "./Point";

export class Maze {
    public readonly mazeWidth: number;
    public readonly mazeHeight: number
    public readonly field: MazeCell[];

    public cellSize: number = 0
    public gap: number = 0

    constructor(field: MazeCell[]) {
        this.field = field;

        this.mazeWidth = Math.max(...this.field.map(c => c.index.x)) + 1
        this.mazeHeight = Math.max(...this.field.map(c => c.index.y)) + 1
    }

    public isCollided = (pos: Point): boolean => {

        for (const cell of this.field) {
            if (cell.type == "wall" && cell.isCollided(pos, this.gap)) {
                return true
            }
        }
        return false
    }
}