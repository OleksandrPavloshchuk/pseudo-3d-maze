import {Player} from "../model/Player"
import {Intersection} from "../model/IntersectionsDetector"
import {getColor} from "./utils"

const K = 10_000

const drawPixel = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    fillColor: string
) => {
    context.fillStyle = fillColor
    context.fillRect(x - 1, y - 1, 2, 2)
}

const drawVerticalLine = (
    context: CanvasRenderingContext2D,
    x: number,
    height: number,
    intersection: Intersection
) => {
    // TODO very slow
    const lineHeight = K / intersection.distance
    for (let y = 0; y < height; y++) {
        let color
        if (y < height / 2 - lineHeight) {
            // floor
            color = "powderblue"
        } else if (y > height / 2 + lineHeight) {
            // ceiling
            color = "azure"
        } else {
            // wall
            color = getColor(intersection.cell.type)
        }
        drawPixel(context, x, y, color)
    }
}

export const drawFpv = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    player: Player,
    intersections: Intersection[]
) => {
    let x = 0
    const stepX = width / player.viewAngleSteps
    intersections.forEach(intersection => {
        drawVerticalLine(context, x, height, intersection)
        x += stepX
    })
}