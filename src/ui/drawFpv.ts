import {Player} from "../model/Player";
import {Intersection} from "../model/IntersectionsDetector";
import {MazeCellType} from "../model/MazeCell";

const K = 8_000

function drawCeiling(context: CanvasRenderingContext2D, width: number, height: number) {
    context.fillStyle = "azure"
    context.fillRect(0, 0, width, height / 2)
}

function drawFloor(context: CanvasRenderingContext2D, width: number, height: number) {
    context.fillStyle = "powderblue"
    context.fillRect(0, height / 2, width, height / 2)
}

function drawWalls(context: CanvasRenderingContext2D, width: number, height: number, player: Player, intersections: Intersection[], ) {
    // TODO 1st attempt
    let x = 0
    const stepX = width / player.viewAngleSteps
    intersections.forEach(intersection => {
        const lineHeight = K / intersection.distance

        context.beginPath()
        context.moveTo(x, height / 2 - lineHeight)
        context.lineTo(x, height / 2 + lineHeight)

        context.strokeStyle = getColor(intersection.cell.type)
        context.lineWidth = 4;
        context.stroke();

        x += stepX
    })
}

export const drawFpv = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    player: Player,
    intersections: Intersection[]
) => {
    drawCeiling(context, width, height);
    drawFloor(context, width, height);
    drawWalls(context, width, height, player, intersections);
}

const getColor= (type: MazeCellType)=> {
    switch (type) {
        case "wall":
            return "#BBFFCC"
        case "picture":
            return "pink"
        case "exitDoor":
            return "yellow"
        default:
            return "powderblue"
    }
}