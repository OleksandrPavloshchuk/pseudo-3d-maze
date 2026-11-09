import {Maze} from "../model/Maze";
import {Player} from "../model/Player";
import {Intersection} from "../model/IntersectionsDetector";

const K = 400_000

export const drawPov = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    player: Player,
    intersections: Intersection[]
) => {
    // ceiling
    context.fillStyle = "azure"
    context.fillRect(0, 0, width, height / 2)
    // floor
    context.fillStyle = "powderblue"
    context.fillRect(0, height / 2, width, height / 2)


    // Draw walls
    // TODO 1st attempt
    let x = 0
    const stepX = width / player.viewAngleSteps
    context.beginPath()
    intersections.forEach(intersection => {
        const lineHeight = K / intersection.distance

        context.moveTo(x, height / 2 - lineHeight / 2)
        context.lineTo(x, height / 2 + lineHeight / 2)

        x += stepX
    })

    context.strokeStyle = "beige";
    context.lineWidth = 2;
    context.stroke();


}