import {Maze} from "../model/Maze";
import {MazeCell, MazeCellType} from "../model/MazeCell";

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

const getColor= (type: MazeCellType)=> {
    switch (type) {
        case "wall":
            return "lightGrey"
        case "picture":
            return "pink"
        case "exitDoor":
            return "yellow"
        default:
            return "powderblue"
    }
}