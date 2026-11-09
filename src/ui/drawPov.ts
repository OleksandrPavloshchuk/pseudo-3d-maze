import {Maze} from "../model/Maze";
import {Player} from "../model/Player";

export const drawPov = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    maze: Maze,
    player: Player
)=> {
    // ceiling
    context.fillStyle = "azure"
    context.fillRect(0, 0, width, height/2)
    // floor
    context.fillStyle = "powderblue"
    context.fillRect(0, height/2, width, height/2)

}