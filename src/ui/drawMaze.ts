import {Maze} from "../model/Maze"
import {MazeCell} from "../model/MazeCell"
import {getColor} from "./utils"

export const drawMaze = (
    context: CanvasRenderingContext2D,
    maze: Maze
) => {
    const cellSize = maze.cellSize

    maze.field.forEach((cell: MazeCell) => {
        context.fillStyle = getColor(cell.type)
        context.fillRect(cell.center.x - cellSize / 2, cell.center.y - cellSize / 2, cellSize, cellSize)

    })

}