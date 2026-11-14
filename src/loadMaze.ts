import {Maze} from "./model/Maze"
import {MazeCell, MazeCellType} from "./model/MazeCell"
import {TEXTURE_SIZE} from "./textures/textureStorage";

const getType = (src: string): MazeCellType => {
    switch (src) {
        case "#":
            return "wall"
        case "E":
            return "exitDoor"
        case "P":
            return "picture"
        default:
            return "empty"
    }
}

export const loadMaze = async (mazeResource: string, playerWallGap: number): Promise<Maze> => {

    const response = await fetch(mazeResource)
    const text = await response.text()

    const field: MazeCell[] = []
    const rows = text.split("\n")

    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            const cell = new MazeCell(
                {x, y},
                {x: (x + 0.5) * TEXTURE_SIZE, y: (y + 0.5) * TEXTURE_SIZE},
                TEXTURE_SIZE,
                getType(rows[y].charAt(x))
            )
            field.push(cell)
        }
    }
    let maze = new Maze(field)
    maze.cellSize = TEXTURE_SIZE
    maze.gap = playerWallGap
    return maze
}
