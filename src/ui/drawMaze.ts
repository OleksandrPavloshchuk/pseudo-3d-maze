import {Maze} from "../model/Maze"
import {MazeCell, type MazeCellType} from "../model/MazeCell"
import {TEXTURE_SIZE} from "../textures/textureStorage";

export const drawMaze = (
    context: CanvasRenderingContext2D,
    maze: Maze,
    mapScale: number   // "4" means, that original scale of maze map is 1/4
) => {
    const cellSize = TEXTURE_SIZE / mapScale

    maze.field.forEach((cell: MazeCell) => {
        context.fillStyle = getColor(cell.type)
        context.fillRect(cell.center.x / mapScale - cellSize / 2, cell.center.y / mapScale - cellSize / 2, cellSize, cellSize)
    })

}

const getColor = (type: MazeCellType) => {
    switch (type) {
        case "empty":
            return "#F0F0F0"
        default:
            return "#D0D0D0"
    }
}