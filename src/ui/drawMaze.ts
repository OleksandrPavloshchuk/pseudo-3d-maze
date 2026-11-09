import {Maze} from "../model/Maze";
import {MazeCell} from "../model/MazeCell";

export const drawMaze = (
    context: CanvasRenderingContext2D,
    maze: Maze
) => {
    const cellSize = maze.cellSize

    maze.field.forEach((cell: MazeCell) => {
        context.fillStyle = cell.type === "empty" ? "powderblue" : "lightGray"
        context.fillRect(cell.center.x - cellSize / 2, cell.center.y - cellSize / 2, cellSize, cellSize)

        /*
        // TODO remove this after test
        context.beginPath();
        context.moveTo(cell.center.x - cellSize / 2, cell.center.y - cellSize / 2);
        context.lineTo(cell.center.x - cellSize / 2, cell.center.y + cellSize / 2);
        context.lineTo(cell.center.x + cellSize / 2, cell.center.y + cellSize / 2);
        context.lineTo(cell.center.x - cellSize / 2, cell.center.y + cellSize / 2);
        context.lineTo(cell.center.x - cellSize / 2, cell.center.y - cellSize / 2);
        context.strokeStyle = "white";
        context.lineWidth = 1;
        context.stroke();
         */
    })

}